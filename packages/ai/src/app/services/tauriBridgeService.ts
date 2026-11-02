/**
 * @file tauriBridgeService.ts
 * @description Tauri 原生桥接服务 — 封装 Tauri invoke 调用，提供类型安全的原生功能接口
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags tauri, bridge, native, ipc, fs, db, window
 */

/* ─── 环境检测 ─── */
const isTauri = (): boolean => {
  return typeof window !== "undefined" && "__TAURI__" in window;
};

/* ─── 模拟 invoke（非 Tauri 环境回退） ─── */
async function invokeNative<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauri()) {
    // 真实 Tauri 环境 — 动态导入避免构建报错
    const { invoke } = await import("@tauri-apps/api/core");
    return invoke<T>(cmd, args);
  }
  // 模拟层 — 本地开发回退
  console.warn(`[TauriBridge] 模拟调用: ${cmd}`, args);
  return simulateCommand<T>(cmd, args);
}

/* ─── 模拟命令返回 ─── */
function simulateCommand<T>(cmd: string, args?: Record<string, unknown>): T {
  const mocks: Record<string, unknown> = {
    "fs_list_dir": [
      { name: "src", isDir: true, size: 0, modified: Date.now() },
      { name: "package.json", isDir: false, size: 1024, modified: Date.now() },
      { name: "README.md", isDir: false, size: 2048, modified: Date.now() },
    ],
    "fs_read_file": "// 模拟文件内容\nconsole.log('Hello YYC³');",
    "fs_write_file": true,
    "fs_delete_path": true,
    "fs_rename_path": true,
    "fs_create_file": true,
    "fs_create_directory": true,
    "fs_get_workspace": "/Users/yyc3/Documents/YYC3-AI-Code",
    "fs_set_workspace": true,
    "fs_watch_start": `watch-${Date.now()}`,
    "fs_watch_stop": true,
    "fs_watch_stop_all": 0,
    "fs_watch_list": [],
    "db_detect_engines": [
      { type: "postgres", version: "16.2", defaultPort: 5432, isRunning: true },
      { type: "mysql", version: "8.0", defaultPort: 3306, isRunning: false },
      { type: "redis", version: "7.2", defaultPort: 6379, isRunning: true },
    ],
    "db_register_connection": `conn-${Date.now()}`,
    "db_test_connection": { success: true, latency: 12, message: "连接成功", version: "16.2" },
    "db_exec_query": {
      columns: [
        { name: "id", dataType: "int4", nullable: false },
        { name: "name", dataType: "varchar", nullable: true },
      ],
      rows: [[1, "test"], [2, "demo"]],
      rowCount: 2,
      duration: 5,
      affectedRows: null,
    },
    "db_list_schemas": ["public", "information_schema"],
    "db_list_tables": [
      { name: "users", schema: "public", rowCount: 150, size: "16 KB", tableType: "TABLE" },
      { name: "projects", schema: "public", rowCount: 42, size: "8 KB", tableType: "TABLE" },
    ],
    "db_get_columns": [
      { name: "id", dataType: "integer", nullable: false, defaultValue: "nextval('users_id_seq')", isPrimaryKey: true, ordinalPosition: 1 },
      { name: "name", dataType: "varchar", nullable: true, defaultValue: null, isPrimaryKey: false, ordinalPosition: 2 },
      { name: "email", dataType: "varchar", nullable: true, defaultValue: null, isPrimaryKey: false, ordinalPosition: 3 },
    ],
    "db_close_connection": true,
    "db_redis_exec": {
      resultType: "string",
      value: "OK",
      intValue: null,
      arrayValue: null,
      duration: 2,
    },
    "db_redis_pipeline": {
      results: [
        { resultType: "string", value: "OK", intValue: null, arrayValue: null, duration: 1 },
        { resultType: "string", value: "OK", intValue: null, arrayValue: null, duration: 1 },
      ],
      duration: 3,
    },
    "db_redis_subscribe": [
      { msgType: "subscribe", channel: "test-channel", data: null },
    ],
    "db_redis_publish": {
      resultType: "integer",
      value: "1",
      intValue: 1,
      arrayValue: null,
      duration: 1,
    },
    "db_redis_subscribe_stream": `mock-sub-${Date.now()}`,
    "backup_dump": true,
    "backup_restore": true,
    "window_create": { id: `win-${Date.now()}`, success: true },
    "window_close": true,
    "window_focus": true,
    "window_set_size": true,
    "window_set_position": true,
    "window_get_all": [{ id: "main", title: "YYC³ AI Code", focused: true }],
    "get_ai_config": JSON.stringify({ providers: [], activeProvider: "", activeModel: "" }),
    "save_ai_config": true,
    "get_encryption_key": "yyc3-dev-key-0000000000000000",
  };
  return (mocks[cmd] ?? null) as T;
}

/* ═══════════════════════════════════════════════════════
   文件系统桥接
   ═══════════════════════════════════════════════════════ */

export interface FileNode {
  name: string;
  isDir: boolean;
  size: number;
  modified: number;
}

export const fsBridge = {
  getWorkspace: () => invokeNative<string>("fs_get_workspace"),
  setWorkspace: (path: string) => invokeNative<boolean>("fs_set_workspace", { path }),
  listDir: (dir: string) => invokeNative<FileNode[]>("fs_list_dir", { dir }),
  readFile: (path: string) => invokeNative<string>("fs_read_file", { path }),
  writeFile: (path: string, content: string) => invokeNative<boolean>("fs_write_file", { path, content }),
  deletePath: (path: string) => invokeNative<boolean>("fs_delete_path", { path }),
  renamePath: (oldPath: string, newPath: string) => invokeNative<boolean>("fs_rename_path", { oldPath, newPath }),
  createFile: (path: string, content?: string) => invokeNative<boolean>("fs_create_file", { path, content }),
  createDirectory: (path: string) => invokeNative<boolean>("fs_create_directory", { path }),
  watchStart: (path: string) => invokeNative<string>("fs_watch_start", { path }),
  watchStop: (watchId: string) => invokeNative<boolean>("fs_watch_stop", { watchId }),
  watchStopAll: () => invokeNative<number>("fs_watch_stop_all"),
  watchList: () => invokeNative<string[]>("fs_watch_list"),
};

/* ═══════════════════════════════════════════════════════
   数据库桥接
   ═══════════════════════════════════════════════════════ */

export interface DetectedEngine {
  type: "postgres" | "mysql" | "redis";
  version: string;
  defaultPort: number;
  isRunning: boolean;
}

export interface ConnectionTestResult {
  success: boolean;
  latency: number;
  message: string;
  version: string;
}

export interface QueryResult {
  columns: { name: string; dataType: string; nullable: boolean }[];
  rows: (number | string | null)[][];
  rowCount: number;
  duration: number;
  affectedRows: number | null;
}

export interface TableInfo {
  name: string;
  schema: string;
  rowCount: number;
  size: string;
  tableType: string;
}

export interface ColumnInfo {
  name: string;
  dataType: string;
  nullable: boolean;
  defaultValue: string | null;
  isPrimaryKey: boolean;
  ordinalPosition: number;
}

export const dbBridge = {
  detectEngines: () => invokeNative<DetectedEngine[]>("db_detect_engines"),
  registerConnection: (cfg: Record<string, unknown>) => invokeNative<string>("db_register_connection", { cfg }),
  testConnection: (connId: string) => invokeNative<ConnectionTestResult>("db_test_connection", { connId }),
  execQuery: (connId: string, sql: string, opts?: { limit?: number; offset?: number }) =>
    invokeNative<QueryResult>("db_exec_query", { connId, sql, ...opts }),
  listSchemas: (connId: string) => invokeNative<string[]>("db_list_schemas", { connId }),
  listTables: (connId: string, schema: string) => invokeNative<TableInfo[]>("db_list_tables", { connId, schema }),
  getColumns: (connId: string, schema: string, table: string) => invokeNative<ColumnInfo[]>("db_get_columns", { connId, schema, table }),
  closeConnection: (connId: string) => invokeNative<boolean>("db_close_connection", { connId }),
  redisExec: (command: string, opts?: { host?: string; port?: number; password?: string; dbIndex?: number }) =>
    invokeNative<{ resultType: string; value: string | null; intValue: number | null; arrayValue: (string | null)[] | null; duration: number }>(
      "db_redis_exec",
      { command, host: opts?.host, port: opts?.port, password: opts?.password, dbIndex: opts?.dbIndex }
    ),
  redisPipeline: (commands: { command: string; opts?: { host?: string; port?: number; password?: string; dbIndex?: number } }[]) =>
    invokeNative<{ results: { resultType: string; value: string | null; intValue: number | null; arrayValue: (string | null)[] | null; duration: number }[]; duration: number }>(
      "db_redis_pipeline",
      { commands }
    ),
  redisSubscribe: (channels: string[]) =>
    invokeNative<{ msgType: "subscribe" | "message" | "unsubscribe"; channel: string; data: string | null }[]>(
      "db_redis_subscribe",
      { channels }
    ),
  redisPublish: (channel: string, message: string) =>
    invokeNative<{ resultType: string; value: string | null; intValue: number | null; arrayValue: (string | null)[] | null; duration: number }>(
      "db_redis_publish",
      { channel, message }
    ),
  redisSubscribeStream: () => invokeNative<string>("db_redis_subscribe_stream"),
};

/* ═══════════════════════════════════════════════════════
   窗口管理桥接
   ══════════════════════════════════════════════════════ */

export interface WindowInfo {
  id: string;
  title?: string;
  focused?: boolean;
}

export const windowBridge = {
  create: (opts?: { title?: string; width?: number; height?: number }) =>
    invokeNative<{ id: string; success: boolean }>("window_create", opts),
  close: (windowId: string) => invokeNative<boolean>("window_close", { windowId }),
  focus: (windowId: string) => invokeNative<boolean>("window_focus", { windowId }),
  setSize: (windowId: string, width: number, height: number) =>
    invokeNative<boolean>("window_set_size", { windowId, width, height }),
  setPosition: (windowId: string, x: number, y: number) =>
    invokeNative<boolean>("window_set_position", { windowId, x, y }),
  getAll: () => invokeNative<WindowInfo[]>("window_get_all"),
};

/* ═══════════════════════════════════════════════════════
   备份桥接
   ═══════════════════════════════════════════════════════ */

export const backupBridge = {
  dump: (connId: string, destPath: string, opts?: Record<string, unknown>) =>
    invokeNative<boolean>("backup_dump", { connId, destPath, ...opts }),
  restore: (connId: string, dumpFile: string) =>
    invokeNative<boolean>("backup_restore", { connId, dumpFile }),
};

/* ═══════════════════════════════════════════════════════
   AI 配置桥接
   ═══════════════════════════════════════════════════════ */

export const aiConfigBridge = {
  getConfig: () => invokeNative<string>("get_ai_config"),
  saveConfig: (config: string) => invokeNative<boolean>("save_ai_config", { config }),
  getEncryptionKey: () => invokeNative<string>("get_encryption_key"),
};

/* ═══════════════════════════════════════════════════════
   环境信息
   ═══════════════════════════════════════════════════════ */

export const tauriBridge = {
  isTauri,
  fs: fsBridge,
  db: dbBridge,
  window: windowBridge,
  backup: backupBridge,
  aiConfig: aiConfigBridge,
};