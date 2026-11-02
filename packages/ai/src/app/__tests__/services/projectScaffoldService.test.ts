/**
 * @file projectScaffoldService.test.ts
 * @description 项目脚手架服务单元测试 — 模板生成、FS 桥接、进度回调、错误处理
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, unit, scaffold-service, project-creation
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { scaffoldProject, type ScaffoldConfig, type ScaffoldProgress } from "../../services/projectScaffoldService";

describe("scaffoldProject", () => {
  const baseConfig: ScaffoldConfig = {
    templateId: "react-ts",
    projectName: "test-project",
    projectPath: "~/projects",
    initGit: true,
    installDeps: true,
    openAfter: false,
  };

  /* ─── 进度回调 ─── */
  describe("进度回调", () => {
    it("应按顺序触发进度阶段", async () => {
      const phases: string[] = [];
      await scaffoldProject(baseConfig, (p) => phases.push(p.phase));

      expect(phases).toContain("prepare");
      expect(phases).toContain("scaffold");
      expect(phases).toContain("git");
      expect(phases).toContain("deps");
      expect(phases).toContain("complete");
    });

    it("最终进度应为 100%", async () => {
      let lastProgress: ScaffoldProgress | null = null;
      await scaffoldProject(baseConfig, (p) => { lastProgress = p; });

      expect(lastProgress).not.toBeNull();
      expect(lastProgress!.percent).toBe(100);
      expect(lastProgress!.phase).toBe("complete");
    });

    it("进度百分比应单调递增", async () => {
      const percents: number[] = [];
      await scaffoldProject(baseConfig, (p) => percents.push(p.percent));

      for (let i = 1; i < percents.length; i++) {
        expect(percents[i]).toBeGreaterThanOrEqual(percents[i - 1]);
      }
    });

    it("每次进度应包含 message 字段", async () => {
      await scaffoldProject(baseConfig, (p) => {
        expect(p.message).toBeDefined();
        expect(typeof p.message).toBe("string");
        expect(p.message.length).toBeGreaterThan(0);
      });
    });
  });

  /* ─── 不同模板 ─── */
  describe("不同模板", () => {
    const templates = ["react-ts", "fullstack", "dashboard", "design-system", "api-server", "desktop-app"];

    templates.forEach((templateId) => {
      it(`模板 "${templateId}" 应成功完成脚手架`, async () => {
        let completed = false;
        await scaffoldProject(
          { ...baseConfig, templateId },
          (p) => { if (p.phase === "complete") completed = true; }
        );
        expect(completed).toBe(true);
      });
    });

    it("未知模板应 fallback 到 react-ts", async () => {
      let completed = false;
      await scaffoldProject(
        { ...baseConfig, templateId: "unknown-template" },
        (p) => { if (p.phase === "complete") completed = true; }
      );
      expect(completed).toBe(true);
    });
  });

  /* ─── 配置选项 ─── */
  describe("配置选项", () => {
    it("禁用 Git 初始化时不应触发 git 阶段", async () => {
      const phases: string[] = [];
      await scaffoldProject(
        { ...baseConfig, initGit: false },
        (p) => phases.push(p.phase)
      );
      expect(phases).not.toContain("git");
    });

    it("禁用依赖安装时不应触发 deps 阶段", async () => {
      const phases: string[] = [];
      await scaffoldProject(
        { ...baseConfig, installDeps: false },
        (p) => phases.push(p.phase)
      );
      expect(phases).not.toContain("deps");
    });

    it("同时禁用 Git 和依赖应直接完成", async () => {
      const phases = new Set<string>();
      await scaffoldProject(
        { ...baseConfig, initGit: false, installDeps: false },
        (p) => phases.add(p.phase)
      );
      expect(phases.has("prepare")).toBe(true);
      expect(phases.has("scaffold")).toBe(true);
      expect(phases.has("complete")).toBe(true);
    });
  });

  /* ─── 输入验证 ─── */
  describe("输入验证", () => {
    it("项目名称包含空格应正常处理", async () => {
      let completed = false;
      await scaffoldProject(
        { ...baseConfig, projectName: "my project" },
        (p) => { if (p.phase === "complete") completed = true; }
      );
      expect(completed).toBe(true);
    });

    it("项目路径以斜杠结尾应正常处理", async () => {
      let completed = false;
      await scaffoldProject(
        { ...baseConfig, projectPath: "~/projects/" },
        (p) => { if (p.phase === "complete") completed = true; }
      );
      expect(completed).toBe(true);
    });
  });
});
