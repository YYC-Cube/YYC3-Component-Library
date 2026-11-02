/**
 * @file DatabasePanel.tsx
 * @description 数据库管理面板 v3.0 — SQL 模板 + CSV 导出 + 查询历史回填 + 表结构可视化 + 增强连接管理
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v3.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, database, sql, templates, csv-export, pagination, table-visualization
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Database, Plus, Trash2, Play, RefreshCw,
  PlugZap, Unplug, Table2, Columns3, Key, ChevronRight,
  ChevronDown, Clock, CircleAlert, Check, X,
  Download, Search, Zap,
  ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight,
  LayoutGrid, Hash, Type, Calendar, ToggleLeft, Link2,
} from "lucide-react";
import {
  useDatabaseStore,
  type DBConnectionProfile,
  type TableInfo,
  type ColumnInfo,
  type DBEngineType,
} from "../../../stores/databaseStore";

/* ─── 引擎配色 ─── */
const engineMeta: Record<DBEngineType, { color: string; label: string }> = {
  postgresql: { color: "#336791", label: "PostgreSQL" },
  mysql: { color: "#4479A1", label: "MySQL" },
  redis: { color: "#DC382D", label: "Redis" },
};

/* ─── SQL 语法高亮 ─── */
const sqlKeywords = new Set([
  "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
  "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "INDEX", "JOIN", "LEFT",
  "RIGHT", "INNER", "OUTER", "ON", "AND", "OR", "NOT", "IN", "IS", "NULL",
  "AS", "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET", "DISTINCT",
  "COUNT", "SUM", "AVG", "MAX", "MIN", "BETWEEN", "LIKE", "EXISTS",
  "UNION", "ALL", "CASE", "WHEN", "THEN", "ELSE", "END", "PRIMARY",
  "FOREIGN", "REFERENCES", "CASCADE", "DEFAULT", "CONSTRAINT", "CHECK",
  "UNIQUE", "IF", "BEGIN", "COMMIT", "ROLLBACK", "TRANSACTION", "GRANT",
  "REVOKE", "WITH", "RETURNING", "EXPLAIN", "ANALYZE", "VACUUM", "TRUNCATE",
]);

const sqlTypes = new Set([
  "INT", "INTEGER", "BIGINT", "SMALLINT", "SERIAL", "BIGSERIAL",
  "VARCHAR", "CHAR", "TEXT", "BOOLEAN", "BOOL", "DATE", "TIMESTAMP",
  "TIMESTAMPTZ", "FLOAT", "DOUBLE", "DECIMAL", "NUMERIC", "JSON",
  "JSONB", "UUID", "BYTEA", "ARRAY", "ENUM", "REAL",
]);

function highlightSQL(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const parts = text.split(
    /(--.*$|'[^']*'|"[^"]*"|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b|\*|[(),;.])/gm
  );
  parts.forEach((p, i) => {
    if (!p) return;
    if (p.startsWith("--")) tokens.push(<span key={i} style={{ color: "#6a9955" }}>{p}</span>);
    else if (p.startsWith("'") || p.startsWith('"')) tokens.push(<span key={i} style={{ color: "#ce9178" }}>{p}</span>);
    else if (/^\d/.test(p)) tokens.push(<span key={i} style={{ color: "#b5cea8" }}>{p}</span>);
    else if (sqlKeywords.has(p.toUpperCase())) tokens.push(<span key={i} style={{ color: "#569cd6", fontWeight: 600 }}>{p}</span>);
    else if (sqlTypes.has(p.toUpperCase())) tokens.push(<span key={i} style={{ color: "#4ec9b0" }}>{p}</span>);
    else if (p === "*") tokens.push(<span key={i} style={{ color: "#d4d4d4", fontWeight: 700 }}>{p}</span>);
    else tokens.push(<span key={i}>{p}</span>);
  });
  return tokens;
}

/* ─── 列类型图标 ─── */
function getColumnIcon(type: string): React.ElementType {
  const t = type.toLowerCase();
  if (t.includes("int") || t.includes("serial") || t.includes("numeric") || t.includes("decimal") || t.includes("float") || t.includes("double") || t.includes("real")) return Hash;
  if (t.includes("char") || t.includes("text") || t.includes("varchar")) return Type;
  if (t.includes("date") || t.includes("time") || t.includes("timestamp")) return Calendar;
  if (t.includes("bool")) return ToggleLeft;
  if (t.includes("json")) return LayoutGrid;
  if (t.includes("uuid")) return Key;
  return Columns3;
}

/* ─── 连接卡片 ─── */
const ConnectionCard: React.FC<{ conn: DBConnectionProfile }> = ({ conn }) => {
  const { connectTo, disconnect, removeConnection, activeConnectionId, testConnection } = useDatabaseStore();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const isActive = activeConnectionId === conn.id;

  const handleTest = async () => {
    setTesting(true); setTestResult(null);
    const ok = await testConnection(conn.id);
    setTestResult(ok); setTesting(false);
  };

  return (
    <div className="rounded-lg px-3 py-2 transition-colors" style={{ background: isActive ? "rgba(0,255,135,0.04)" : "rgba(255,255,255,0.02)", border: `1px solid ${isActive ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}` }}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: conn.isConnected ? "#00ff87" : "rgba(255,255,255,0.15)" }} />
        <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: `${engineMeta[conn.type].color}20` }}>
          <Database size={12} style={{ color: engineMeta[conn.type].color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: "12px", fontWeight: 500 }}>{conn.name}</span>
            <span className="px-1 rounded" style={{ fontSize: "8px", background: `${engineMeta[conn.type].color}20`, color: engineMeta[conn.type].color }}>{engineMeta[conn.type].label}</span>
          </div>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{conn.host}:{conn.port}/{conn.database}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {!conn.isConnected ? (
            <button onClick={() => connectTo(conn.id)} className="px-2 py-1 rounded" style={{ fontSize: "10px", color: "#00ff87", background: "rgba(0,255,135,0.06)", border: "1px solid rgba(0,255,135,0.12)" }}>
              <PlugZap size={10} className="inline mr-0.5" />连接
            </button>
          ) : (
            <button onClick={() => disconnect(conn.id)} className="px-2 py-1 rounded" style={{ fontSize: "10px", color: "#ff6b6b", background: "rgba(255,50,50,0.06)" }}>
              <Unplug size={10} className="inline mr-0.5" />断开
            </button>
          )}
          <button onClick={handleTest} disabled={testing} className="w-5 h-5 flex items-center justify-center rounded opacity-30 hover:opacity-70" title="测试">
            {testing ? <RefreshCw size={10} className="animate-spin" /> : <Zap size={10} />}
          </button>
          <button onClick={() => removeConnection(conn.id)} className="w-5 h-5 flex items-center justify-center rounded opacity-20 hover:opacity-50" style={{ color: "#ff6b6b" }}>
            <Trash2 size={10} />
          </button>
        </div>
      </div>
      {testResult !== null && (
        <div className="mt-1.5 flex items-center gap-1" style={{ fontSize: "10px", color: testResult ? "#00ff87" : "#ff6b6b" }}>
          {testResult ? <Check size={10} /> : <CircleAlert size={10} />}
          {testResult ? "连接成功" : "连接失败"}
        </div>
      )}
    </div>
  );
};

/* ─── 表结构可视化 ─── */
const TableStructureView: React.FC<{ table: TableInfo }> = ({ table }) => {
  const pkCols = table.columns.filter((c) => c.primaryKey);
  const fkCols = table.columns.filter((c) => c.foreignKey);
  const normalCols = table.columns.filter((c) => !c.primaryKey && !c.foreignKey);

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
      {/* 表头 */}
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: "rgba(0,255,135,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Table2 size={13} style={{ color: "#00ff87" }} />
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#00ff87" }}>{table.name}</span>
        <span className="ml-auto" style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>{table.rowCount} 行 · {table.size}</span>
      </div>

      {/* 主键区 */}
      {pkCols.length > 0 && (
        <div className="px-2 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-1 mb-1" style={{ fontSize: "9px", color: "#ffb86c" }}>
            <Key size={8} />PRIMARY KEY
          </div>
          {pkCols.map((col) => (
            <ColumnRow key={col.name} col={col} variant="pk" />
          ))}
        </div>
      )}

      {/* 外键区 */}
      {fkCols.length > 0 && (
        <div className="px-2 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-1 mb-1" style={{ fontSize: "9px", color: "#60efff" }}>
            <Link2 size={8} />FOREIGN KEYS
          </div>
          {fkCols.map((col) => (
            <ColumnRow key={col.name} col={col} variant="fk" />
          ))}
        </div>
      )}

      {/* 普通列 */}
      <div className="px-2 py-1">
        {normalCols.map((col) => (
          <ColumnRow key={col.name} col={col} variant="normal" />
        ))}
      </div>
    </div>
  );
};

const ColumnRow: React.FC<{ col: ColumnInfo; variant: "pk" | "fk" | "normal" }> = ({ col, variant }) => {
  const IconComp = variant === "pk" ? Key : variant === "fk" ? Link2 : getColumnIcon(col.type);
  const iconColor = variant === "pk" ? "#ffb86c" : variant === "fk" ? "#60efff" : "rgba(255,255,255,0.25)";

  return (
    <div className="flex items-center gap-2 py-0.5 px-1" style={{ fontSize: "10.5px" }}>
      <IconComp size={9} style={{ color: iconColor }} />
      <span style={{ color: variant === "pk" ? "#ffb86c" : variant === "fk" ? "#60efff" : "rgba(255,255,255,0.6)", fontWeight: variant === "pk" ? 600 : 400 }}>
        {col.name}
      </span>
      <span className="font-mono" style={{ fontSize: "9px", color: "#4ec9b0" }}>{col.type}</span>
      {col.nullable && <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.15)" }}>NULL</span>}
      {col.defaultValue && <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.15)" }}>= {col.defaultValue}</span>}
    </div>
  );
};

/* ─── 表浏览器 (增强) ─── */
const TableBrowser: React.FC = () => {
  const { tables, selectedTable, selectTable } = useDatabaseStore();
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "visual">("list");
  const [search, setSearch] = useState("");

  const filteredTables = useMemo(() =>
    tables.filter((t) => t.name.toLowerCase().includes(search.toLowerCase())),
    [tables, search]
  );

  return (
    <div className="flex flex-col h-full">
      {/* 工具栏 */}
      <div className="flex items-center gap-1.5 px-2 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex-1 flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Search size={10} className="opacity-30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索表..."
            className="flex-1 bg-transparent border-none outline-none"
            style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}
          />
        </div>
        <button
          onClick={() => setViewMode(viewMode === "list" ? "visual" : "list")}
          className="w-6 h-6 flex items-center justify-center rounded transition-colors"
          style={{ color: viewMode === "visual" ? "#a855f7" : "rgba(255,255,255,0.25)", background: viewMode === "visual" ? "rgba(168,85,247,0.06)" : "transparent" }}
          title={viewMode === "list" ? "可视化视图" : "列表视图"}
        >
          <LayoutGrid size={11} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredTables.length === 0 ? (
          <div className="px-3 py-6 text-center" style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
            {tables.length === 0 ? "请先连接数据库" : "无匹配表"}
          </div>
        ) : viewMode === "visual" ? (
          /* 可视化视图 */
          <div className="p-2 space-y-2">
            {filteredTables.map((table) => (
              <TableStructureView key={table.name} table={table} />
            ))}
          </div>
        ) : (
          /* 列表视图 */
          filteredTables.map((table) => {
            const isExpanded = expandedTable === table.name;
            const isSelected = selectedTable === table.name;
            return (
              <div key={table.name}>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors"
                  style={{ background: isSelected ? "rgba(0,255,135,0.06)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  onClick={() => { selectTable(table.name); setExpandedTable(isExpanded ? null : table.name); }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  {isExpanded ? <ChevronDown size={11} className="opacity-40" /> : <ChevronRight size={11} className="opacity-40" />}
                  <Table2 size={12} style={{ color: isSelected ? "#00ff87" : "rgba(255,255,255,0.4)" }} />
                  <span className="flex-1 truncate" style={{ fontSize: "12px", color: isSelected ? "#00ff87" : "rgba(255,255,255,0.7)" }}>{table.name}</span>
                  <span className="opacity-20" style={{ fontSize: "9px" }}>{table.rowCount} 行</span>
                  <span className="opacity-15" style={{ fontSize: "9px" }}>{table.size}</span>
                </div>
                {isExpanded && (
                  <div className="pl-8 pr-3 py-1" style={{ background: "rgba(255,255,255,0.01)" }}>
                    {table.columns.map((col) => {
                      const ColIcon = col.primaryKey ? Key : col.foreignKey ? Link2 : getColumnIcon(col.type);
                      const iconColor = col.primaryKey ? "#ffb86c" : col.foreignKey ? "#60efff" : "rgba(255,255,255,0.2)";
                      return (
                        <div key={col.name} className="flex items-center gap-2 py-0.5" style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.45)" }}>
                          <ColIcon size={9} style={{ color: iconColor }} />
                          <span style={{ color: col.primaryKey ? "#ffb86c" : col.foreignKey ? "#60efff" : undefined }}>{col.name}</span>
                          <span className="font-mono" style={{ fontSize: "9px", color: "#4ec9b0" }}>{col.type}</span>
                          {col.nullable && <span className="opacity-20">null</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/* ─── SQL 快捷模板 ─── */
const sqlTemplates = [
  { label: "SELECT 全表", sql: "SELECT * FROM table_name LIMIT 100;" },
  { label: "COUNT 统计", sql: "SELECT COUNT(*) FROM table_name;" },
  { label: "GROUP BY", sql: "SELECT column, COUNT(*) AS cnt\nFROM table_name\nGROUP BY column\nORDER BY cnt DESC;" },
  { label: "JOIN 查询", sql: "SELECT a.*, b.column\nFROM table_a a\nLEFT JOIN table_b b ON a.id = b.a_id\nWHERE a.active = true;" },
  { label: "CREATE TABLE", sql: "CREATE TABLE IF NOT EXISTS new_table (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);" },
  { label: "INSERT INTO", sql: "INSERT INTO table_name (col1, col2)\nVALUES ('value1', 'value2')\nRETURNING *;" },
  { label: "UPDATE", sql: "UPDATE table_name\nSET column = 'value'\nWHERE id = 1;" },
  { label: "DELETE", sql: "DELETE FROM table_name\nWHERE id = 1;" },
  { label: "EXPLAIN", sql: "EXPLAIN ANALYZE\nSELECT * FROM table_name WHERE id > 100;" },
];

/* ─── SQL 编辑器 (增强：语法高亮 + 分页 + 模板 + CSV 导出) ─── */
const SQLEditor: React.FC = () => {
  const { queryText, setQueryText, executeQuery, isExecuting, queryResult, clearResult, selectedTable } = useDatabaseStore();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const totalRows = queryResult?.rows.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const pagedRows = queryResult?.rows.slice((page - 1) * pageSize, page * pageSize) || [];

  useEffect(() => { setPage(1); }, [queryResult]);

  /* 插入 SQL 模板 */
  const insertTemplate = (sql: string) => {
    const filled = selectedTable ? sql.replace(/table_name/g, selectedTable) : sql;
    setQueryText(filled);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  /* CSV 导出 */
  const handleExportCSV = () => {
    if (!queryResult || queryResult.rows.length === 0) return;
    const header = queryResult.columns.join(",");
    const rows = queryResult.rows.map((row) =>
      queryResult.columns.map((col) => {
        const val = row[col];
        if (val === null) return "";
        const str = String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query-result-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      executeQuery();
    }
    // Tab for indent
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.target as HTMLTextAreaElement;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = queryText.substring(0, start) + "  " + queryText.substring(end);
      setQueryText(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  // Sync scroll between textarea and overlay
  const handleScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "200px" }}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-2 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>SQL 控制台</span>
        <div className="flex items-center gap-1">
          <button
            onClick={executeQuery}
            disabled={isExecuting || !queryText.trim()}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded transition-colors"
            style={{
              fontSize: "10.5px",
              background: !isExecuting && queryText.trim() ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.03)",
              color: !isExecuting && queryText.trim() ? "#00ff87" : "rgba(255,255,255,0.3)",
              border: `1px solid ${!isExecuting && queryText.trim() ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            {isExecuting ? <RefreshCw size={10} className="animate-spin" /> : <Play size={10} />}
            {isExecuting ? "执行中..." : "执行 (⌘↩)"}
          </button>
          {queryResult && (
            <button onClick={clearResult} className="opacity-30 hover:opacity-60" title="清除">
              <X size={11} />
            </button>
          )}
          <button onClick={() => setShowTemplates(!showTemplates)} className="opacity-30 hover:opacity-60" title="模板">
            <PlugZap size={11} />
          </button>
          {queryResult && (
            <button onClick={handleExportCSV} className="opacity-30 hover:opacity-60" title="导出 CSV">
              <Download size={11} />
            </button>
          )}
        </div>
      </div>

      {/* SQL 输入 (带语法高亮叠加层) */}
      <div className="relative" style={{ minHeight: "100px" }}>
        {/* 高亮叠加 */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none overflow-auto px-3 py-2 whitespace-pre-wrap"
          style={{
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            fontSize: "12px",
            lineHeight: "18px",
            color: "transparent",
          }}
        >
          {highlightSQL(queryText)}
        </div>
        {/* 实际输入 */}
        <textarea
          ref={textareaRef}
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          placeholder="输入 SQL 查询... (⌘+Enter 执行)"
          className="w-full h-full bg-transparent border-none outline-none resize-none px-3 py-2 relative z-10"
          style={{
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            fontSize: "12px",
            lineHeight: "18px",
            color: "rgba(255,255,255,0.7)",
            caretColor: "#aeafad",
            minHeight: "100px",
          }}
          spellCheck={false}
        />
      </div>

      {/* 查询结果 */}
      {queryResult && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {/* 状态栏 */}
          <div className="flex items-center justify-between px-3 py-1" style={{ background: "rgba(255,255,255,0.02)", fontSize: "10px" }}>
            <div className="flex items-center gap-2">
              {queryResult.error ? (
                <span style={{ color: "#ff6b6b" }}>
                  <CircleAlert size={10} className="inline mr-1" />{queryResult.error}
                </span>
              ) : (
                <>
                  <span style={{ color: "#00ff87" }}>
                    <Check size={10} className="inline mr-0.5" />{queryResult.rowCount} 行
                  </span>
                  {queryResult.affectedRows != null && (
                    <span style={{ color: "#60efff" }}>影响 {queryResult.affectedRows} 行</span>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="opacity-30">{queryResult.executionTime.toFixed(0)}ms</span>
              {/* 分页控制 */}
              {totalRows > pageSize && (
                <div className="flex items-center gap-0.5">
                  <PagBtn icon={ChevronsLeft} onClick={() => setPage(1)} disabled={page === 1} />
                  <PagBtn icon={ArrowLeft} onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} />
                  <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", minWidth: "50px", textAlign: "center" }}>
                    {page}/{totalPages}
                  </span>
                  <PagBtn icon={ArrowRight} onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} />
                  <PagBtn icon={ChevronsRight} onClick={() => setPage(totalPages)} disabled={page === totalPages} />
                </div>
              )}
            </div>
          </div>

          {/* 结果表格 */}
          {queryResult.columns.length > 0 && pagedRows.length > 0 && (
            <div className="overflow-auto" style={{ maxHeight: "240px" }}>
              <table className="w-full" style={{ borderCollapse: "collapse", fontSize: "11px" }}>
                <thead>
                  <tr>
                    <th className="sticky top-0 px-2 py-1 text-left" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontWeight: 500, fontSize: "10px", width: "32px" }}>
                      #
                    </th>
                    {queryResult.columns.map((col) => (
                      <th key={col} className="sticky top-0 px-2 py-1 text-left" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontWeight: 500, fontSize: "10px", whiteSpace: "nowrap" }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((row, i) => {
                    const rowIdx = (page - 1) * pageSize + i;
                    return (
                      <tr
                        key={rowIdx}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <td className="px-2 py-1" style={{ color: "rgba(255,255,255,0.15)", fontSize: "9px" }}>{rowIdx + 1}</td>
                        {queryResult.columns.map((col) => (
                          <td key={col} className="px-2 py-1" style={{ color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {row[col] === null ? (
                              <span className="italic" style={{ color: "rgba(255,255,255,0.12)" }}>NULL</span>
                            ) : typeof row[col] === "boolean" ? (
                              <span style={{ color: (row[col] as boolean) ? "#00ff87" : "#ff6b6b" }}>{String(row[col])}</span>
                            ) : typeof row[col] === "number" ? (
                              <span style={{ color: "#b5cea8" }}>{String(row[col])}</span>
                            ) : (
                              String(row[col])
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* 模板列表 */}
      {showTemplates && (
        <div
          className="overflow-y-auto py-1"
          style={{
            maxHeight: "200px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(10,10,22,0.98)",
          }}
        >
          <div className="flex items-center justify-between px-3 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>SQL 快捷模板</span>
            <button onClick={() => setShowTemplates(false)} className="opacity-30 hover:opacity-60"><X size={10} /></button>
          </div>
          {sqlTemplates.map((tpl) => (
            <button
              key={tpl.label}
              onClick={() => insertTemplate(tpl.sql)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,135,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <Play size={8} className="opacity-30 flex-shrink-0" />
              <span>{tpl.label}</span>
              {selectedTable && <span className="ml-auto opacity-20" style={{ fontSize: "9px" }}>→ {selectedTable}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* 分页小按钮 */
const PagBtn: React.FC<{ icon: React.ElementType; onClick: () => void; disabled: boolean }> = ({ icon: Icon, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} className="w-4 h-4 flex items-center justify-center rounded transition-opacity" style={{ opacity: disabled ? 0.15 : 0.4 }}>
    <Icon size={9} />
  </button>
);

/* ─── 新建连接表单 ─── */
const NewConnectionForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addConnection } = useDatabaseStore();
  const [form, setForm] = useState({ name: "", type: "postgresql" as DBEngineType, host: "localhost", port: 5432, username: "postgres", password: "", database: "", ssl: false });
  const portDefaults: Record<DBEngineType, number> = { postgresql: 5432, mysql: 3306, redis: 6379 };

  const handleSave = () => {
    if (!form.name.trim() || !form.database.trim()) return;
    addConnection(form);
    onClose();
  };

  return (
    <div className="px-3 py-3 space-y-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,255,135,0.02)" }}>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: "12px", fontWeight: 500 }}>新建连接</span>
        <button onClick={onClose} className="opacity-30 hover:opacity-60"><X size={12} /></button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="连接名称" className="col-span-2 px-2 py-1.5 rounded bg-transparent outline-none" style={{ fontSize: "11px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }} />
        <select
          value={form.type}
          onChange={(e) => { const type = e.target.value as DBEngineType; setForm({ ...form, type, port: portDefaults[type] }); }}
          className="px-2 py-1.5 rounded bg-transparent outline-none"
          style={{ fontSize: "11px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", background: "#14142a" }}
        >
          <option value="postgresql">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="redis">Redis</option>
        </select>
        <input value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} placeholder="主机" className="px-2 py-1.5 rounded bg-transparent outline-none" style={{ fontSize: "11px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }} />
        <input type="number" value={form.port} onChange={(e) => setForm({ ...form, port: parseInt(e.target.value) || 0 })} placeholder="端口" className="px-2 py-1.5 rounded bg-transparent outline-none" style={{ fontSize: "11px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }} />
        <input value={form.database} onChange={(e) => setForm({ ...form, database: e.target.value })} placeholder="数据库名" className="px-2 py-1.5 rounded bg-transparent outline-none" style={{ fontSize: "11px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }} />
        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="用户名" className="px-2 py-1.5 rounded bg-transparent outline-none" style={{ fontSize: "11px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }} />
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="密码" className="px-2 py-1.5 rounded bg-transparent outline-none" style={{ fontSize: "11px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }} />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onClose} className="px-3 py-1 rounded" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>取消</button>
        <button
          onClick={handleSave}
          disabled={!form.name.trim() || !form.database.trim()}
          className="px-3 py-1 rounded"
          style={{
            fontSize: "11px",
            background: form.name.trim() && form.database.trim() ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.03)",
            color: form.name.trim() && form.database.trim() ? "#00ff87" : "rgba(255,255,255,0.3)",
            border: `1px solid ${form.name.trim() && form.database.trim() ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          保存
        </button>
      </div>
    </div>
  );
};

/* ─── 主面板 ─── */
export const DatabasePanel: React.FC = () => {
  const { connections, activeConnectionId, detectedEngines, detectEngines, queryHistory, clearHistory, dumpDatabase } = useDatabaseStore();
  const [activeTab, setActiveTab] = useState<"connections" | "tables" | "sql" | "history">("connections");
  const [showNewConn, setShowNewConn] = useState(false);
  const [dumping, setDumping] = useState(false);

  useEffect(() => { detectEngines(); }, [detectEngines]);

  const activeConn = connections.find((c) => c.id === activeConnectionId);

  const tabs = [
    { id: "connections" as const, label: "连接", icon: PlugZap },
    { id: "tables" as const, label: "表", icon: Table2 },
    { id: "sql" as const, label: "SQL", icon: Play },
    { id: "history" as const, label: "历史", icon: Clock },
  ];

  const handleDump = async () => {
    if (!activeConnectionId) return;
    setDumping(true);
    await dumpDatabase(activeConnectionId);
    setDumping(false);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#14142a", color: "rgba(255,255,255,0.85)" }}>
      {/* Tab 栏 */}
      <div className="flex items-center justify-between px-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: "32px" }}>
        <div className="flex items-center gap-0.5">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
              style={{ fontSize: "10.5px", color: activeTab === tab.id ? "#00ff87" : "rgba(255,255,255,0.4)", background: activeTab === tab.id ? "rgba(0,255,135,0.06)" : "transparent" }}>
              <tab.icon size={10} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {activeConn && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(0,255,135,0.06)", color: "#00ff87" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ff87" }} />
              {activeConn.name}
            </span>
          )}
          {activeConn && (
            <button onClick={handleDump} disabled={dumping} className="w-5 h-5 flex items-center justify-center rounded opacity-30 hover:opacity-60" title="备份">
              {dumping ? <RefreshCw size={10} className="animate-spin" /> : <Download size={10} />}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "connections" && (
          <div className="p-2 space-y-2">
            {detectedEngines.length > 0 && (
              <div className="px-2 py-1.5 rounded-lg" style={{ background: "rgba(96,239,255,0.03)", border: "1px solid rgba(96,239,255,0.08)" }}>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>已检测的本地引擎</span>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {detectedEngines.map((e) => (
                    <span key={e.type} className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                      style={{ fontSize: "9.5px", background: `${engineMeta[e.type].color}15`, color: engineMeta[e.type].color, border: `1px solid ${engineMeta[e.type].color}25` }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: e.status === "running" ? "#00ff87" : "#ff6b6b" }} />
                      {engineMeta[e.type].label} {e.version}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setShowNewConn(!showNewConn)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-colors"
              style={{ fontSize: "11px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,135,0.3)"; e.currentTarget.style.color = "#00ff87"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>
              <Plus size={12} />新建连接
            </button>
            {showNewConn && <NewConnectionForm onClose={() => setShowNewConn(false)} />}
            {connections.map((conn) => <ConnectionCard key={conn.id} conn={conn} />)}
          </div>
        )}
        {activeTab === "tables" && <TableBrowser />}
        {activeTab === "sql" && <SQLEditor />}
        {activeTab === "history" && (
          <div>
            {queryHistory.length === 0 ? (
              <div className="px-3 py-8 text-center" style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>暂无查询历史</div>
            ) : (
              <>
                <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{queryHistory.length} 条记录</span>
                  <button onClick={clearHistory} style={{ fontSize: "10px", color: "#ff6b6b", opacity: 0.5 }}>清除</button>
                </div>
                {queryHistory.slice(0, 20).map((h) => (
                  <div key={h.id} className="px-3 py-2 transition-colors cursor-pointer" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: "11px" }}
                    onClick={() => useDatabaseStore.getState().setQueryText(h.sql)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                    <div className="flex items-center gap-2">
                      {h.success ? <Check size={10} style={{ color: "#00ff87" }} /> : <CircleAlert size={10} style={{ color: "#ff6b6b" }} />}
                      <span className="flex-1 truncate font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{h.sql}</span>
                      <span className="opacity-20" style={{ fontSize: "9px" }}>{h.executionTime.toFixed(0)}ms</span>
                    </div>
                    <span className="ml-5 opacity-20" style={{ fontSize: "9px" }}>{new Date(h.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};