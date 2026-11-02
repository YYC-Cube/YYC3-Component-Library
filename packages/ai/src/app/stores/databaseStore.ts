/**
 * @file databaseStore.ts
 * @description 数据库管理 Zustand 状态管理 — 连接管理、SQL 控制台、表浏览、备份恢复
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, database, sql, connection, table-browser, backup
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */
export type DBEngineType = "postgresql" | "mysql" | "redis";

export interface DetectedEngine {
  type: DBEngineType;
  version: string;
  defaultPort: number;
  status: "running" | "stopped" | "unknown";
}

export interface DBConnectionProfile {
  id: string;
  name: string;
  type: DBEngineType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
  color: string;
  isConnected: boolean;
  lastConnectedAt?: number;
}

export interface TableInfo {
  name: string;
  schema: string;
  rowCount: number;
  size: string;
  columns: ColumnInfo[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: boolean;
  defaultValue: string | null;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTime: number;
  affectedRows?: number;
  error?: string;
}

export interface QueryHistory {
  id: string;
  connectionId: string;
  sql: string;
  timestamp: number;
  executionTime: number;
  rowCount: number;
  success: boolean;
  error?: string;
}

/* ─── 模拟引擎探测 ─── */
const mockEngines: DetectedEngine[] = [
  { type: "postgresql", version: "16.2", defaultPort: 5432, status: "running" },
  { type: "mysql", version: "8.0.36", defaultPort: 3306, status: "stopped" },
  { type: "redis", version: "7.2.4", defaultPort: 6379, status: "running" },
];

/* ─── 模拟表数据 ─── */
const mockTables: Record<string, TableInfo[]> = {
  default: [
    {
      name: "users", schema: "public", rowCount: 1250, size: "2.4 MB",
      columns: [
        { name: "id", type: "serial", nullable: false, primaryKey: true, defaultValue: "nextval('users_id_seq')" },
        { name: "username", type: "varchar(100)", nullable: false, primaryKey: false, defaultValue: null },
        { name: "email", type: "varchar(255)", nullable: false, primaryKey: false, defaultValue: null },
        { name: "created_at", type: "timestamptz", nullable: false, primaryKey: false, defaultValue: "now()" },
        { name: "is_active", type: "boolean", nullable: false, primaryKey: false, defaultValue: "true" },
      ],
    },
    {
      name: "projects", schema: "public", rowCount: 340, size: "1.1 MB",
      columns: [
        { name: "id", type: "uuid", nullable: false, primaryKey: true, defaultValue: "gen_random_uuid()" },
        { name: "name", type: "varchar(200)", nullable: false, primaryKey: false, defaultValue: null },
        { name: "owner_id", type: "integer", nullable: false, primaryKey: false, defaultValue: null },
        { name: "description", type: "text", nullable: true, primaryKey: false, defaultValue: null },
        { name: "status", type: "varchar(20)", nullable: false, primaryKey: false, defaultValue: "'draft'" },
        { name: "updated_at", type: "timestamptz", nullable: false, primaryKey: false, defaultValue: "now()" },
      ],
    },
    {
      name: "ai_sessions", schema: "public", rowCount: 8900, size: "12.6 MB",
      columns: [
        { name: "id", type: "bigserial", nullable: false, primaryKey: true, defaultValue: null },
        { name: "user_id", type: "integer", nullable: false, primaryKey: false, defaultValue: null },
        { name: "provider", type: "varchar(50)", nullable: false, primaryKey: false, defaultValue: null },
        { name: "model", type: "varchar(100)", nullable: false, primaryKey: false, defaultValue: null },
        { name: "tokens_used", type: "integer", nullable: false, primaryKey: false, defaultValue: "0" },
        { name: "cost", type: "decimal(10,6)", nullable: false, primaryKey: false, defaultValue: "0" },
        { name: "created_at", type: "timestamptz", nullable: false, primaryKey: false, defaultValue: "now()" },
      ],
    },
    {
      name: "files", schema: "public", rowCount: 4500, size: "8.2 MB",
      columns: [
        { name: "id", type: "uuid", nullable: false, primaryKey: true, defaultValue: "gen_random_uuid()" },
        { name: "project_id", type: "uuid", nullable: false, primaryKey: false, defaultValue: null },
        { name: "path", type: "text", nullable: false, primaryKey: false, defaultValue: null },
        { name: "content", type: "text", nullable: true, primaryKey: false, defaultValue: null },
        { name: "version", type: "integer", nullable: false, primaryKey: false, defaultValue: "1" },
      ],
    },
    {
      name: "plugins", schema: "public", rowCount: 28, size: "0.1 MB",
      columns: [
        { name: "id", type: "varchar(100)", nullable: false, primaryKey: true, defaultValue: null },
        { name: "name", type: "varchar(200)", nullable: false, primaryKey: false, defaultValue: null },
        { name: "version", type: "varchar(20)", nullable: false, primaryKey: false, defaultValue: null },
        { name: "enabled", type: "boolean", nullable: false, primaryKey: false, defaultValue: "true" },
      ],
    },
  ],
};

/* ─── 模拟查询结果 ─── */
function mockQueryResult(sql: string): QueryResult {
  const trimmed = sql.trim().toLowerCase();
  if (trimmed.startsWith("select")) {
    const mockRows = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      username: `user_${i + 1}`,
      email: `user${i + 1}@yyc3.dev`,
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      is_active: i !== 3,
    }));
    return { columns: ["id", "username", "email", "created_at", "is_active"], rows: mockRows, rowCount: 5, executionTime: 12 + Math.random() * 50 };
  }
  if (trimmed.startsWith("insert")) return { columns: [], rows: [], rowCount: 0, executionTime: 8, affectedRows: 1 };
  if (trimmed.startsWith("update")) return { columns: [], rows: [], rowCount: 0, executionTime: 15, affectedRows: 3 };
  if (trimmed.startsWith("delete")) return { columns: [], rows: [], rowCount: 0, executionTime: 10, affectedRows: 1 };
  if (trimmed.startsWith("create")) return { columns: [], rows: [], rowCount: 0, executionTime: 45 };
  return { columns: [], rows: [], rowCount: 0, executionTime: 5, error: trimmed ? undefined : "空查询" };
}

/* ─── Store 接口 ─── */
interface DatabaseStore {
  /* 状态 */
  detectedEngines: DetectedEngine[];
  connections: DBConnectionProfile[];
  activeConnectionId: string | null;
  tables: TableInfo[];
  selectedTable: string | null;
  queryText: string;
  queryResult: QueryResult | null;
  queryHistory: QueryHistory[];
  isExecuting: boolean;
  schemas: string[];
  activeSchema: string;

  /* 引擎探测 */
  detectEngines: () => void;

  /* 连接管理 */
  addConnection: (conn: Omit<DBConnectionProfile, "id" | "isConnected" | "color">) => void;
  editConnection: (conn: DBConnectionProfile) => void;
  removeConnection: (id: string) => void;
  connectTo: (id: string) => Promise<void>;
  disconnect: (id: string) => void;
  testConnection: (id: string) => Promise<boolean>;

  /* 表浏览 */
  loadTables: () => void;
  selectTable: (name: string | null) => void;
  getTableColumns: (name: string) => ColumnInfo[];

  /* SQL 控制台 */
  setQueryText: (sql: string) => void;
  executeQuery: () => Promise<void>;
  clearResult: () => void;

  /* 历史 */
  clearHistory: () => void;

  /* 备份 */
  dumpDatabase: (connId: string) => Promise<string>;
  restoreDatabase: (connId: string, dumpPath: string) => Promise<void>;
}

/* ─── Store 实现 ─── */
const colors = ["#00ff87", "#60efff", "#a855f7", "#ff6b6b", "#ffb86c", "#50fa7b"];

export const useDatabaseStore = create<DatabaseStore>()(
  persist(
    (set, get) => ({
      detectedEngines: [],
      connections: [
        {
          id: "conn-1", name: "本地 PostgreSQL", type: "postgresql",
          host: "localhost", port: 5432, username: "postgres", password: "",
          database: "yyc3_dev", ssl: false, color: "#00ff87", isConnected: false,
        },
        {
          id: "conn-2", name: "本地 Redis", type: "redis",
          host: "localhost", port: 6379, username: "", password: "",
          database: "0", ssl: false, color: "#ff6b6b", isConnected: false,
        },
      ],
      activeConnectionId: null,
      tables: [],
      selectedTable: null,
      queryText: "SELECT * FROM users LIMIT 10;",
      queryResult: null,
      queryHistory: [],
      isExecuting: false,
      schemas: ["public", "auth", "storage"],
      activeSchema: "public",

      detectEngines: () => set({ detectedEngines: mockEngines }),

      addConnection: (conn) => {
        const id = `conn-${crypto.randomUUID().slice(0, 8)}`;
        const color = colors[get().connections.length % colors.length];
        set((s) => ({
          connections: [...s.connections, { ...conn, id, isConnected: false, color }],
        }));
      },

      editConnection: (conn) =>
        set((s) => ({ connections: s.connections.map((c) => (c.id === conn.id ? conn : c)) })),

      removeConnection: (id) =>
        set((s) => ({
          connections: s.connections.filter((c) => c.id !== id),
          activeConnectionId: s.activeConnectionId === id ? null : s.activeConnectionId,
        })),

      connectTo: async (id) => {
        await new Promise((r) => setTimeout(r, 500 + Math.random() * 500));
        set((s) => ({
          connections: s.connections.map((c) =>
            c.id === id ? { ...c, isConnected: true, lastConnectedAt: Date.now() } : c
          ),
          activeConnectionId: id,
        }));
        get().loadTables();
      },

      disconnect: (id) =>
        set((s) => ({
          connections: s.connections.map((c) => (c.id === id ? { ...c, isConnected: false } : c)),
          activeConnectionId: s.activeConnectionId === id ? null : s.activeConnectionId,
          tables: s.activeConnectionId === id ? [] : s.tables,
        })),

      testConnection: async (id) => {
        await new Promise((r) => setTimeout(r, 800));
        return Math.random() > 0.2;
      },

      loadTables: () => set({ tables: mockTables.default || [] }),

      selectTable: (name) => set({ selectedTable: name }),

      getTableColumns: (name) => {
        const table = get().tables.find((t) => t.name === name);
        return table?.columns || [];
      },

      setQueryText: (sql) => set({ queryText: sql }),

      executeQuery: async () => {
        const { queryText, activeConnectionId } = get();
        if (!queryText.trim()) return;
        set({ isExecuting: true });

        await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

        const result = mockQueryResult(queryText);
        const history: QueryHistory = {
          id: crypto.randomUUID().slice(0, 8),
          connectionId: activeConnectionId || "",
          sql: queryText,
          timestamp: Date.now(),
          executionTime: result.executionTime,
          rowCount: result.rowCount,
          success: !result.error,
          error: result.error,
        };

        set((s) => ({
          queryResult: result,
          isExecuting: false,
          queryHistory: [history, ...s.queryHistory].slice(0, 100),
        }));
      },

      clearResult: () => set({ queryResult: null }),
      clearHistory: () => set({ queryHistory: [] }),

      dumpDatabase: async (connId) => {
        await new Promise((r) => setTimeout(r, 1500));
        return `/tmp/yyc3_dump_${Date.now()}.sql`;
      },

      restoreDatabase: async (connId, dumpPath) => {
        await new Promise((r) => setTimeout(r, 2000));
      },
    }),
    {
      name: "yyc3-database",
      partialize: (state) => ({
        connections: state.connections.map((c) => ({ ...c, password: "", isConnected: false })),
        queryHistory: state.queryHistory.slice(0, 20),
      }),
    }
  )
);