/**
 * @file TaskBoardPanel.tsx
 * @description AI 智能任务看板面板 — 看板/列表视图、状态拖拽、子任务、AI 推理、筛选排序、批量操作
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, task-board, kanban, ai-inference, drag-drop
 */

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Plus, Search, ListFilter, LayoutGrid, List, Archive,
  Trash2, Copy, MoreHorizontal, X, Check, ChevronDown,
  ChevronRight, Clock, CalendarDays, Tag, Sparkles,
  CircleAlert, CircleCheck, LoaderCircle, Pause, Ban,
  ArrowUpDown, Bug, FileCode, TestTube, BookOpen,
  Zap, Pencil, CheckSquare, Square, GripVertical,
  TriangleAlert, ArrowUp, ArrowDown, Minus,
} from "lucide-react";
import {
  useTaskStore,
  type Task, type TaskStatus, type TaskPriority, type TaskType, type SubTask, type TaskInference,
} from "../../../stores/taskStore";
import type { TaskStats } from "../../../stores/taskStore";
import { useI18nStore } from "../../../stores/i18nStore";
import { useNotificationStore } from "../../../stores/notificationStore";

/* ─── 常量映射 ─── */

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  todo:          { label: "tb.statusTodo",       icon: <Square size={12} />,        color: "#94a3b8", bg: "rgba(148,163,184,0.08)" },
  "in-progress": { label: "tb.statusProgress",  icon: <LoaderCircle size={12} />,   color: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
  review:        { label: "tb.statusReview",     icon: <Pause size={12} />,          color: "#c084fc", bg: "rgba(192,132,252,0.08)" },
  done:          { label: "tb.statusDone",       icon: <CircleCheck size={12} />,    color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
  blocked:       { label: "tb.statusBlocked",    icon: <Ban size={12} />,            color: "#f87171", bg: "rgba(248,113,113,0.08)" },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; icon: React.ReactNode; color: string }> = {
  critical: { label: "tb.priorityCritical", icon: <TriangleAlert size={11} />, color: "#ef4444" },
  high:     { label: "tb.priorityHigh",     icon: <ArrowUp size={11} />,       color: "#f97316" },
  medium:   { label: "tb.priorityMedium",   icon: <Minus size={11} />,         color: "#eab308" },
  low:      { label: "tb.priorityLow",      icon: <ArrowDown size={11} />,     color: "#22c55e" },
};

const TYPE_CONFIG: Record<TaskType, { label: string; icon: React.ReactNode; color: string }> = {
  feature:       { label: "tb.typeFeature", icon: <Zap size={11} />,      color: "#60a5fa" },
  bug:           { label: "tb.typeBug",     icon: <Bug size={11} />,      color: "#f87171" },
  refactor:      { label: "tb.typeRefactor",icon: <FileCode size={11} />, color: "#c084fc" },
  test:          { label: "tb.typeTest",    icon: <TestTube size={11} />,  color: "#4ade80" },
  documentation: { label: "tb.typeDocs",    icon: <BookOpen size={11} />,  color: "#fbbf24" },
  other:         { label: "tb.typeOther",   icon: <Tag size={11} />,       color: "#94a3b8" },
};

const STATUS_ORDER: TaskStatus[] = ["todo", "in-progress", "review", "done", "blocked"];

/* ═══════════════════════════════════════════════════════════
 * 主面板组件
 * ═══════════════════════════════════════════════════════════ */

export const TaskBoardPanel: React.FC = () => {
  const store = useTaskStore();
  const { t } = useI18nStore();
  const notifications = useNotificationStore();
  const stats = store.getStats();

  /* ─── 提醒检查 ─── */
  useEffect(() => {
    const interval = setInterval(() => {
      const due = store.triggerDueReminders();
      due.forEach((r) => {
        const task = store.tasks.find((t) => t.id === r.taskId);
        if (task) notifications.warning(task.title, r.message);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col" style={{ background: "rgba(10,10,20,0.5)" }}>
      {/* ═══ 顶部工具栏 ═══ */}
      <TaskBoardToolbar stats={stats} />

      {/* ═══ AI 推理建议条 ═══ */}
      {store.pendingInferences.length > 0 && <InferenceBanner />}

      {/* ═══ 批量操作条 ═══ */}
      {store.selectedTaskIds.length > 0 && <BatchActionBar />}

      {/* ═══ 主体内容 ═══ */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {store.boardView === "kanban" ? <KanbanView /> : <ListView />}
      </div>

      {/* ═══ 创建/编辑对话框 ═══ */}
      {store.showCreateDialog && (
        <TaskDialog
          task={store.editingTaskId ? store.tasks.find((t) => t.id === store.editingTaskId) : undefined}
          onClose={() => { store.setShowCreateDialog(false); store.setEditingTask(null); }}
        />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
 * ���具栏
 * ═══════════════════════════════════════════════════════════ */

const TaskBoardToolbar: React.FC<{ stats: TaskStats }> = ({ stats }) => {
  const store = useTaskStore();
  const { t } = useI18nStore();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 flex-shrink-0 gap-2">
      {/* 左侧：标题 + 统计 */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[12px] text-white/80 whitespace-nowrap">{t("tb.title" as any)}</span>
        <div className="flex items-center gap-1.5">
          <StatBadge count={stats.total} label={t("tb.total" as any)} color="white" />
          <StatBadge count={stats.byStatus["in-progress"]} label={t("tb.active" as any)} color="#60a5fa" />
          {stats.overdue > 0 && (
            <StatBadge count={stats.overdue} label={t("tb.overdue" as any)} color="#f87171" />
          )}
        </div>
      </div>

      {/* 右侧：操作 */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* 搜索 */}
        {searchOpen ? (
          <div className="flex items-center gap-1 bg-white/5 rounded-md px-2 py-1 border border-white/10">
            <Search size={12} className="text-white/30" />
            <input
              autoFocus
              placeholder={t("tb.searchPlaceholder" as any)}
              className="bg-transparent text-[11px] text-white/80 outline-none w-[120px]"
              value={store.filter.searchQuery || ""}
              onChange={(e) => store.updateFilter({ searchQuery: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); store.updateFilter({ searchQuery: "" }); } }}
            />
            <button onClick={() => { setSearchOpen(false); store.updateFilter({ searchQuery: "" }); }} className="text-white/30 hover:text-white/60">
              <X size={11} />
            </button>
          </div>
        ) : (
          <ToolBtn icon={<Search size={13} />} onClick={() => setSearchOpen(true)} />
        )}

        {/* 视图切换 */}
        <ToolBtn
          icon={store.boardView === "kanban" ? <LayoutGrid size={13} /> : <List size={13} />}
          active={false}
          onClick={() => store.setBoardView(store.boardView === "kanban" ? "list" : "kanban")}
          title={store.boardView === "kanban" ? t("tb.listView" as any) : t("tb.kanbanView" as any)}
        />

        {/* 归档切换 */}
        <ToolBtn
          icon={<Archive size={13} />}
          active={store.showArchived}
          onClick={() => store.setShowArchived(!store.showArchived)}
          title={t("tb.toggleArchived" as any)}
        />

        {/* 新建 */}
        <button
          onClick={() => { store.setEditingTask(null); store.setShowCreateDialog(true); }}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors"
          style={{ background: "rgba(0,255,135,0.08)", color: "#00ff87", border: "1px solid rgba(0,255,135,0.15)" }}
        >
          <Plus size={12} />
          {t("tb.newTask" as any)}
        </button>
      </div>
    </div>
  );
};

const ToolBtn: React.FC<{ icon: React.ReactNode; onClick: () => void; active?: boolean; title?: string }> = ({ icon, onClick, active, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded-md transition-colors ${active ? "bg-purple-500/15 text-purple-300" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}
  >
    {icon}
  </button>
);

const StatBadge: React.FC<{ count: number; label: string; color: string }> = ({ count, label, color }) => (
  <span
    className="text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap"
    style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}
  >
    {count} {label}
  </span>
);

/* ═══════════════════════════════════════════════════════════
 * AI 推理建议条
 * ═══════════════════════════════════════════════════════════ */

const InferenceBanner: React.FC = () => {
  const { pendingInferences, acceptInference, rejectInference, clearPendingInferences } = useTaskStore();
  const { t } = useI18nStore();

  return (
    <div className="px-3 py-2 border-b border-purple-500/10 flex-shrink-0" style={{ background: "rgba(168,85,247,0.04)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-purple-400" />
          <span className="text-[11px] text-purple-300">{t("tb.aiSuggestions" as any)}</span>
          <span className="text-[9px] text-purple-400/50">{pendingInferences.length}</span>
        </div>
        <button
          onClick={clearPendingInferences}
          className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
        >
          {t("tb.dismissAll" as any)}
        </button>
      </div>
      <div className="space-y-1 max-h-[120px] overflow-y-auto custom-scrollbar">
        {pendingInferences.map((inf, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/3 group">
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-white/70 truncate block">{inf.task.title}</span>
              <span className="text-[9px] text-white/25">
                {t("tb.confidence" as any)}: {Math.round(inf.confidence * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => acceptInference(i)}
                className="p-1 rounded hover:bg-green-500/10 text-green-400/50 hover:text-green-400 transition-colors"
                title={t("tb.accept" as any)}
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => rejectInference(i)}
                className="p-1 rounded hover:bg-red-500/10 text-red-400/50 hover:text-red-400 transition-colors"
                title={t("tb.reject" as any)}
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
 * 批量操作条
 * ══════════���════════════════════════════════════════════════ */

const BatchActionBar: React.FC = () => {
  const store = useTaskStore();
  const { t } = useI18nStore();
  const count = store.selectedTaskIds.length;

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyan-500/10 flex-shrink-0" style={{ background: "rgba(96,239,255,0.03)" }}>
      <span className="text-[11px] text-cyan-300/70">
        {count} {t("tb.selected" as any)}
      </span>
      <div className="flex items-center gap-1">
        {(["todo", "in-progress", "done"] as TaskStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => store.batchUpdateStatus(store.selectedTaskIds, s)}
            className="px-1.5 py-0.5 rounded text-[9px] transition-colors hover:bg-white/5"
            style={{ color: STATUS_CONFIG[s].color }}
          >
            {t(STATUS_CONFIG[s].label as any)}
          </button>
        ))}
        <button
          onClick={() => store.batchArchiveTasks(store.selectedTaskIds)}
          className="p-1 rounded text-white/30 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
        >
          <Archive size={12} />
        </button>
        <button
          onClick={() => store.batchDeleteTasks(store.selectedTaskIds)}
          className="p-1 rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={12} />
        </button>
        <button onClick={store.clearSelection} className="p-1 rounded text-white/30 hover:text-white/60 transition-colors">
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
 * 看板视图
 * ═══════════════════════════════════════════════════════════ */

const KanbanView: React.FC = () => {
  const store = useTaskStore();
  const filteredTasks = store.getFilteredTasks();
  const { t } = useI18nStore();

  const columns = useMemo(() => {
    const cols: Record<TaskStatus, Task[]> = { todo: [], "in-progress": [], review: [], done: [], blocked: [] };
    filteredTasks.forEach((task) => { cols[task.status].push(task); });
    return cols;
  }, [filteredTasks]);

  const handleDrop = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      store.moveTaskStatus(taskId, newStatus);
    },
    [store]
  );

  return (
    <div className="flex gap-2 p-2 h-full min-w-0 overflow-x-auto">
      {STATUS_ORDER.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={columns[status]}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};

const KanbanColumn: React.FC<{
  status: TaskStatus;
  tasks: Task[];
  onDrop: (taskId: string, status: TaskStatus) => void;
}> = ({ status, tasks, onDrop }) => {
  const { t } = useI18nStore();
  const config = STATUS_CONFIG[status];
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`flex flex-col min-w-[220px] w-[220px] rounded-xl flex-shrink-0 transition-colors ${
        dragOver ? "ring-1 ring-purple-500/30" : ""
      }`}
      style={{ background: config.bg, border: `1px solid ${dragOver ? config.color + "30" : "rgba(255,255,255,0.03)"}` }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) onDrop(taskId, status);
      }}
    >
      {/* 列标题 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/3">
        <div className="flex items-center gap-1.5">
          <span style={{ color: config.color }}>{config.icon}</span>
          <span className="text-[11px] text-white/60">{t(config.label as any)}</span>
          <span className="text-[9px] text-white/20 ml-0.5">{tasks.length}</span>
        </div>
      </div>

      {/* 任务卡片列表 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-1">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center py-6 text-[10px] text-white/10">
            {t("tb.emptyColumn" as any)}
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} compact />)
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
 * 列表视图
 * ═══════════════════════════════════════════════════════════ */

const ListView: React.FC = () => {
  const store = useTaskStore();
  const filteredTasks = store.getFilteredTasks();
  const { t } = useI18nStore();

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
        <CheckSquare size={28} />
        <span className="text-[12px]">{t("tb.noTasks" as any)}</span>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-1">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} compact={false} />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
 * 任务卡片
 * ═══════════════════════════════════════════════════════════ */

const TaskCard: React.FC<{ task: Task; compact: boolean }> = ({ task, compact }) => {
  const store = useTaskStore();
  const { t } = useI18nStore();
  const notifications = useNotificationStore();
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const priorityCfg = PRIORITY_CONFIG[task.priority];
  const typeCfg = TYPE_CONFIG[task.type];
  const isSelected = store.selectedTaskIds.includes(task.id);
  const subtaskDone = task.subtasks?.filter((s) => s.isCompleted).length || 0;
  const subtaskTotal = task.subtasks?.length || 0;
  const isOverdue = task.dueDate && task.dueDate < Date.now() && task.status !== "done";

  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("taskId", task.id); }}
      onClick={() => { if (!menuOpen) setExpanded(!expanded); }}
      className={`group rounded-lg p-2 cursor-pointer transition-all ${
        isSelected ? "ring-1 ring-cyan-400/30 bg-cyan-500/5" : "hover:bg-white/3"
      } ${task.isArchived ? "opacity-40" : ""}`}
      style={{ background: isSelected ? "rgba(96,239,255,0.04)" : "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}
    >
      {/* 首行 */}
      <div className="flex items-start gap-2">
        {/* 选择框 */}
        <button
          onClick={(e) => { e.stopPropagation(); store.toggleTaskSelection(task.id); }}
          className="mt-0.5 flex-shrink-0 text-white/15 hover:text-white/40 transition-colors"
        >
          {isSelected ? <CheckSquare size={13} className="text-cyan-400" /> : <Square size={13} />}
        </button>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {/* 优先级 */}
            <span style={{ color: priorityCfg.color }}>{priorityCfg.icon}</span>
            {/* 标题 */}
            <span className={`text-[11px] truncate ${task.status === "done" ? "text-white/30 line-through" : "text-white/80"}`}>
              {task.title}
            </span>
            {/* AI 标记 */}
            {task.source === "ai-inferred" && (
              <Sparkles size={9} className="text-purple-400/50 flex-shrink-0" />
            )}
          </div>

          {/* 元信息 */}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {/* 类型 */}
            <span className="text-[8px] px-1 py-0.5 rounded" style={{ color: typeCfg.color, background: typeCfg.color + "10" }}>
              {t(typeCfg.label as any)}
            </span>
            {/* 截止日期 */}
            {task.dueDate && (
              <span className={`text-[8px] flex items-center gap-0.5 ${isOverdue ? "text-red-400" : "text-white/25"}`}>
                <CalendarDays size={8} />
                {new Date(task.dueDate).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
              </span>
            )}
            {/* 预估时间 */}
            {task.estimatedHours && (
              <span className="text-[8px] text-white/20 flex items-center gap-0.5">
                <Clock size={8} />{task.estimatedHours}h
              </span>
            )}
            {/* 子任务进度 */}
            {subtaskTotal > 0 && (
              <span className="text-[8px] text-white/20 flex items-center gap-0.5">
                <CheckSquare size={8} />{subtaskDone}/{subtaskTotal}
              </span>
            )}
          </div>
        </div>

        {/* 右侧：菜单 */}
        <div className="flex-shrink-0 relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-white/20 hover:text-white/50 transition-all"
          >
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <TaskContextMenu
              task={task}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>

      {/* 展开详情 */}
      {expanded && !compact && (
        <TaskExpandedDetails task={task} />
      )}
    </div>
  );
};

/* ─── 任务右键菜单 ─── */

const TaskContextMenu: React.FC<{ task: Task; onClose: () => void }> = ({ task, onClose }) => {
  const store = useTaskStore();
  const { t } = useI18nStore();
  const notifications = useNotificationStore();

  useEffect(() => {
    const handler = () => onClose();
    setTimeout(() => document.addEventListener("click", handler), 50);
    return () => document.removeEventListener("click", handler);
  }, [onClose]);

  const items = [
    {
      icon: <Pencil size={11} />, label: t("tb.edit" as any),
      action: () => { store.setEditingTask(task.id); store.setShowCreateDialog(true); },
    },
    {
      icon: <Copy size={11} />, label: t("tb.duplicate" as any),
      action: () => { store.duplicateTask(task.id); notifications.success(t("tb.duplicated" as any), ""); },
    },
    {
      icon: <Archive size={11} />, label: task.isArchived ? t("tb.unarchive" as any) : t("tb.archive" as any),
      action: () => { task.isArchived ? store.unarchiveTask(task.id) : store.archiveTask(task.id); },
    },
    {
      icon: <Trash2 size={11} />, label: t("tb.delete" as any), danger: true,
      action: () => store.deleteTask(task.id),
    },
  ];

  return (
    <div
      className="absolute right-0 top-full mt-1 z-50 rounded-lg py-1 min-w-[130px]"
      style={{ background: "rgba(20,20,35,0.97)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
    >
      {/* 状态切换 */}
      <div className="px-2 py-1 border-b border-white/5">
        <span className="text-[9px] text-white/20">{t("tb.moveTo" as any)}</span>
        <div className="flex items-center gap-1 mt-1">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => { store.moveTaskStatus(task.id, s); onClose(); }}
              className={`p-1 rounded transition-colors ${task.status === s ? "bg-white/10" : "hover:bg-white/5"}`}
              style={{ color: STATUS_CONFIG[s].color }}
              title={t(STATUS_CONFIG[s].label as any)}
            >
              {STATUS_CONFIG[s].icon}
            </button>
          ))}
        </div>
      </div>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => { item.action(); onClose(); }}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-[11px] transition-colors ${
            (item as any).danger ? "text-red-400/70 hover:bg-red-500/10" : "text-white/60 hover:bg-white/5"
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
};

/* ─── 展开详情 ─── */

const TaskExpandedDetails: React.FC<{ task: Task }> = ({ task }) => {
  const store = useTaskStore();
  const { t } = useI18nStore();
  const [newSubtask, setNewSubtask] = useState("");

  return (
    <div className="mt-2 pt-2 border-t border-white/5 space-y-2">
      {/* 描述 */}
      {task.description && (
        <p className="text-[10px] text-white/35 leading-relaxed">{task.description}</p>
      )}

      {/* 标签 */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {task.tags.map((tag) => (
            <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 子任务 */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <CheckSquare size={10} className="text-white/20" />
          <span className="text-[9px] text-white/25">{t("tb.subtasks" as any)}</span>
        </div>
        {task.subtasks?.map((st) => (
          <div key={st.id} className="flex items-center gap-1.5 py-0.5 pl-2">
            <button
              onClick={(e) => { e.stopPropagation(); store.toggleSubtask(task.id, st.id); }}
              className={st.isCompleted ? "text-green-400/50" : "text-white/15 hover:text-white/30"}
            >
              {st.isCompleted ? <CircleCheck size={11} /> : <Square size={11} />}
            </button>
            <span className={`text-[10px] ${st.isCompleted ? "text-white/20 line-through" : "text-white/50"}`}>
              {st.title}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); store.deleteSubtask(task.id, st.id); }}
              className="ml-auto opacity-0 group-hover:opacity-100 text-white/10 hover:text-red-400 transition-all"
            >
              <X size={9} />
            </button>
          </div>
        ))}
        {/* 新增子任务 */}
        <div className="flex items-center gap-1 mt-1 pl-2">
          <Plus size={10} className="text-white/15" />
          <input
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newSubtask.trim()) {
                e.stopPropagation();
                store.addSubtask(task.id, newSubtask.trim());
                setNewSubtask("");
              }
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder={t("tb.addSubtask" as any)}
            className="bg-transparent text-[10px] text-white/40 outline-none flex-1"
          />
        </div>
      </div>

      {/* 关联文件 */}
      {task.relatedFiles && task.relatedFiles.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          <FileCode size={9} className="text-white/15" />
          {task.relatedFiles.map((f) => (
            <span key={f} className="text-[8px] text-cyan-400/40 font-mono">{f}</span>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
 * 创建/编辑任务对话框
 * ═══════════════════════════════════════════════════════════ */

const TaskDialog: React.FC<{ task?: Task; onClose: () => void }> = ({ task, onClose }) => {
  const store = useTaskStore();
  const { t } = useI18nStore();
  const notifications = useNotificationStore();
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "todo");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "medium");
  const [type, setType] = useState<TaskType>(task?.type || "feature");
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "");
  const [estimatedHours, setEstimatedHours] = useState(task?.estimatedHours?.toString() || "");
  const [tagsStr, setTagsStr] = useState(task?.tags?.join(", ") || "");

  const handleSave = () => {
    if (!title.trim()) return;
    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      type,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      tags: tagsStr ? tagsStr.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
    };

    if (isEditing && task) {
      store.updateTask(task.id, data);
      notifications.success(t("tb.taskUpdated" as any), "");
    } else {
      store.addTask(data);
      notifications.success(t("tb.taskCreated" as any), "");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div
        className="w-[420px] rounded-2xl overflow-hidden"
        style={{ background: "rgba(20,20,35,0.97)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <span className="text-[13px] text-white/80">{isEditing ? t("tb.editTask" as any) : t("tb.createTask" as any)}</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* 表单 */}
        <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* 标题 */}
          <div>
            <label className="text-[10px] text-white/30 block mb-1">{t("tb.taskTitle" as any)} *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("tb.taskTitlePlaceholder" as any)}
              className="w-full px-3 py-2 rounded-lg bg-white/3 border border-white/8 text-[12px] text-white/80 outline-none focus:border-purple-500/30 transition-colors"
              autoFocus
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="text-[10px] text-white/30 block mb-1">{t("tb.taskDesc" as any)}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("tb.taskDescPlaceholder" as any)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/3 border border-white/8 text-[12px] text-white/80 outline-none focus:border-purple-500/30 transition-colors resize-none"
            />
          </div>

          {/* 状态 + 优先级 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-white/30 block mb-1">{t("tb.status" as any)}</label>
              <div className="flex flex-wrap gap-1">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-colors border ${
                      status === s ? "border-white/15 bg-white/5" : "border-transparent hover:bg-white/3"
                    }`}
                    style={{ color: STATUS_CONFIG[s].color }}
                  >
                    {STATUS_CONFIG[s].icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/30 block mb-1">{t("tb.priority" as any)}</label>
              <div className="flex flex-wrap gap-1">
                {(["critical", "high", "medium", "low"] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-colors border ${
                      priority === p ? "border-white/15 bg-white/5" : "border-transparent hover:bg-white/3"
                    }`}
                    style={{ color: PRIORITY_CONFIG[p].color }}
                  >
                    {PRIORITY_CONFIG[p].icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 类型 */}
          <div>
            <label className="text-[10px] text-white/30 block mb-1">{t("tb.type" as any)}</label>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(TYPE_CONFIG) as TaskType[]).map((tp) => (
                <button
                  key={tp}
                  onClick={() => setType(tp)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-colors border ${
                    type === tp ? "border-white/15 bg-white/5" : "border-transparent hover:bg-white/3"
                  }`}
                  style={{ color: TYPE_CONFIG[tp].color }}
                >
                  {TYPE_CONFIG[tp].icon}
                  <span>{t(TYPE_CONFIG[tp].label as any)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 截止日期 + 预估时间 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-white/30 block mb-1">{t("tb.dueDate" as any)}</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/3 border border-white/8 text-[11px] text-white/60 outline-none focus:border-purple-500/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/30 block mb-1">{t("tb.estimatedHours" as any)}</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg bg-white/3 border border-white/8 text-[11px] text-white/60 outline-none focus:border-purple-500/30 transition-colors"
              />
            </div>
          </div>

          {/* 标签 */}
          <div>
            <label className="text-[10px] text-white/30 block mb-1">{t("tb.tags" as any)}</label>
            <input
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder={t("tb.tagsPlaceholder" as any)}
              className="w-full px-3 py-2 rounded-lg bg-white/3 border border-white/8 text-[11px] text-white/60 outline-none focus:border-purple-500/30 transition-colors"
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-[12px] text-white/40 hover:bg-white/5 transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-1.5 rounded-lg text-[12px] transition-colors"
            style={{
              background: title.trim() ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.03)",
              color: title.trim() ? "#00ff87" : "rgba(255,255,255,0.2)",
              border: title.trim() ? "1px solid rgba(0,255,135,0.2)" : "1px solid transparent",
            }}
          >
            {isEditing ? t("common.save") : t("tb.create" as any)}
          </button>
        </div>
      </div>
    </div>
  );
};