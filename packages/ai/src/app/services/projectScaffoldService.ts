/**
 * @file projectScaffoldService.ts
 * @description 项目脚手架服务 — FS 桥接 + 模板文件生成 + 进度反馈
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.1.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags service, scaffold, fs-bridge, project-creation
 */

/* ─── 类型定义 ─── */
export interface ScaffoldConfig {
  templateId: string;
  projectName: string;
  projectPath: string;
  initGit: boolean;
  installDeps: boolean;
  openAfter: boolean;
}

export interface ScaffoldProgress {
  phase: "prepare" | "scaffold" | "git" | "deps" | "complete" | "error";
  message: string;
  percent: number;
  detail?: string;
}

export interface TemplateFile {
  path: string;
  content: string;
  type: "file" | "directory";
}

/* ─── FS 桥接抽象 ─── */
interface FsBridge {
  createDirectory(path: string): Promise<void>;
  writeFile(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
}

/**
 * 模拟 FS 桥接 — 浏览器环境
 * 当运行在 Tauri 桌面端时，可替换为真实的 invoke 调用
 */
const createFsBridge = (): FsBridge => ({
  async createDirectory(path: string) {
    console.debug(`[FS] mkdir: ${path}`);
    await new Promise((r) => setTimeout(r, 50));
  },
  async writeFile(path: string, content: string) {
    console.debug(`[FS] write: ${path} (${content.length} bytes)`);
    await new Promise((r) => setTimeout(r, 30));
  },
  async exists(path: string) {
    console.debug(`[FS] exists: ${path}`);
    return false;
  },
});

/* ─── 模板文件定义 ─── */
const templateFiles: Record<string, (name: string) => TemplateFile[]> = {
  "react-ts": (name) => [
    { path: "", type: "directory", content: "" },
    { path: "src", type: "directory", content: "" },
    { path: "src/app", type: "directory", content: "" },
    { path: "src/app/components", type: "directory", content: "" },
    { path: "src/styles", type: "directory", content: "" },
    { path: "public", type: "directory", content: "" },
    {
      path: "package.json", type: "file",
      content: JSON.stringify({
        name, private: true, version: "0.0.1", type: "module",
        scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
        dependencies: { react: "^18.3.1", "react-dom": "^18.3.1", "react-router": "^7.0.0", zustand: "^5.0.0" },
        devDependencies: { "@vitejs/plugin-react": "^4.7.0", typescript: "^5.6.0", vite: "^6.0.0", tailwindcss: "^4.0.0" },
      }, null, 2),
    },
    {
      path: "tsconfig.json", type: "file",
      content: JSON.stringify({
        compilerOptions: {
          target: "ES2020", useDefineForClassFields: true, lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext", skipLibCheck: true, moduleResolution: "bundler",
          allowImportingTsExtensions: true, resolveJsonModule: true, isolatedModules: true,
          noEmit: true, jsx: "react-jsx", strict: true,
        },
        include: ["src"],
      }, null, 2),
    },
    {
      path: "vite.config.ts", type: "file",
      content: `import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\nexport default defineConfig({\n  plugins: [react()],\n});\n`,
    },
    {
      path: "src/main.tsx", type: "file",
      content: `import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./app/App";\nimport "./styles/index.css";\n\nReactDOM.createRoot(document.getElementById("root")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n`,
    },
    {
      path: "src/app/App.tsx", type: "file",
      content: `import React from "react";\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">\n      <h1 className="text-4xl font-bold">${name}</h1>\n    </div>\n  );\n}\n`,
    },
    {
      path: "src/styles/index.css", type: "file",
      content: `@import "tailwindcss";\n`,
    },
    {
      path: "index.html", type: "file",
      content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${name}</title>\n</head>\n<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.tsx"></script>\n</body>\n</html>\n`,
    },
  ],

  "fullstack": (name) => [
    ...templateFiles["react-ts"](name),
    { path: "src-tauri", type: "directory", content: "" },
    { path: "src-tauri/src", type: "directory", content: "" },
    {
      path: "src-tauri/Cargo.toml", type: "file",
      content: `[package]\nname = "${name}"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\ntauri = { version = "2", features = [] }\nserde = { version = "1", features = ["derive"] }\nserde_json = "1"\n`,
    },
    {
      path: "src-tauri/src/main.rs", type: "file",
      content: `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]\n\nfn main() {\n    tauri::Builder::default()\n        .run(tauri::generate_context!())\n        .expect("error while running tauri application");\n}\n`,
    },
  ],

  "dashboard": (name) => templateFiles["react-ts"](name),
  "design-system": (name) => templateFiles["react-ts"](name),
  "api-server": (name) => [
    { path: "", type: "directory", content: "" },
    { path: "src", type: "directory", content: "" },
    {
      path: "Cargo.toml", type: "file",
      content: `[package]\nname = "${name}"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\naxum = "0.7"\ntokio = { version = "1", features = ["full"] }\nserde = { version = "1", features = ["derive"] }\nserde_json = "1"\n`,
    },
    {
      path: "src/main.rs", type: "file",
      content: `use axum::{routing::get, Router};\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new().route("/", get(|| async { "Hello from ${name}!" }));\n    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();\n    axum::serve(listener, app).await.unwrap();\n}\n`,
    },
  ],
  "desktop-app": (name) => templateFiles["fullstack"](name),
};

/* ─── 主脚手架函数 ─── */
export async function scaffoldProject(
  config: ScaffoldConfig,
  onProgress: (p: ScaffoldProgress) => void
): Promise<void> {
  const fs = createFsBridge();
  const fullPath = `${config.projectPath}/${config.projectName}`;
  const getFiles = templateFiles[config.templateId] || templateFiles["react-ts"];
  const files = getFiles(config.projectName);

  try {
    // 1. 准备阶段
    onProgress({ phase: "prepare", message: "检查项目路径...", percent: 5 });
    const exists = await fs.exists(fullPath);
    if (exists) {
      throw new Error(`目录已存在: ${fullPath}`);
    }
    await new Promise((r) => setTimeout(r, 300));

    // 2. 创建文件
    onProgress({ phase: "scaffold", message: "创建项目结构...", percent: 15 });
    const dirs = files.filter((f) => f.type === "directory");
    const fileItems = files.filter((f) => f.type === "file");

    for (let i = 0; i < dirs.length; i++) {
      const dirPath = dirs[i].path ? `${fullPath}/${dirs[i].path}` : fullPath;
      await fs.createDirectory(dirPath);
      onProgress({
        phase: "scaffold",
        message: `创建目录: ${dirs[i].path || config.projectName}`,
        percent: 15 + (i / dirs.length) * 30,
        detail: dirPath,
      });
    }

    for (let i = 0; i < fileItems.length; i++) {
      const filePath = `${fullPath}/${fileItems[i].path}`;
      await fs.writeFile(filePath, fileItems[i].content);
      onProgress({
        phase: "scaffold",
        message: `写入文件: ${fileItems[i].path}`,
        percent: 45 + (i / fileItems.length) * 25,
        detail: filePath,
      });
    }

    // 3. Git 初始化
    if (config.initGit) {
      onProgress({ phase: "git", message: "初始化 Git 仓库...", percent: 75 });
      await fs.writeFile(`${fullPath}/.gitignore`, "node_modules/\ndist/\ntarget/\n.env\n");
      await new Promise((r) => setTimeout(r, 400));
    }

    // 4. 依赖安装 (模拟)
    if (config.installDeps) {
      onProgress({ phase: "deps", message: "安装依赖中...", percent: 85, detail: "pnpm install" });
      await new Promise((r) => setTimeout(r, 800));
    }

    // 5. 完成
    onProgress({
      phase: "complete",
      message: "项目创建成功!",
      percent: 100,
      detail: `${fileItems.length} 个文件, ${dirs.length} 个目录`,
    });
  } catch (err: any) {
    onProgress({
      phase: "error",
      message: err.message || "项目创建失败",
      percent: 0,
    });
    throw err;
  }
}