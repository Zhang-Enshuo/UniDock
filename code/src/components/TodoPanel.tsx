import { MailPlus, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { analyzeMailWithAi } from "../services/aiMailAnalysis";
import type { AiConfidence, AiTodoType, MailAnalysisState, MailTodoSuggestion, Todo, TodoViewId } from "../types";

const defaultTodos: Todo[] = [
  { id: "todo-1", title: "提交 Academic English essay plan", completed: false, dueDate: "2026-09-17", dueTime: "16:00", source: "Academic English" },
  { id: "todo-2", title: "确认下周 Computing Lab 教室", completed: false, dueDate: "2026-09-20", dueTime: "18:00", source: "Computing Lab" },
  { id: "todo-3", title: "预约 Student ID Card", completed: false, dueDate: "2026-09-22", dueTime: "10:00" },
  { id: "todo-4", title: "整理住宿材料", completed: false },
  { id: "todo-5", title: "检查 Student Email", completed: true, dueDate: "2026-09-18", dueTime: "09:00" },
];

type TodoDraft = {
  title: string;
  dueDate: string;
  dueTime: string;
  source: string;
};

const todoViewOrder: TodoViewId[] = ["today", "planned", "completed", "all"];
const todoViewLabels: Record<TodoViewId, string> = {
  today: "今天",
  planned: "计划",
  completed: "完成",
  all: "全部",
};

const todoViewNotes: Record<TodoViewId, string> = {
  today: "今天：包含今日截止和已逾期未完成事项。",
  planned: "计划：展示未来有截止时间的未完成事项。",
  completed: "完成：展示已经处理完的事项。",
  all: "全部：展示所有未完成和已完成事项。",
};

const typeLabels: Record<AiTodoType, string> = {
  assignment: "作业",
  appointment: "预约",
  meeting: "会议",
  material: "材料",
  admin: "行政",
  other: "其他",
};

const confidenceLabels: Record<AiConfidence, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

function loadTodos() {
  try {
    const saved = localStorage.getItem("unidock-todos");
    return saved ? (JSON.parse(saved) as Todo[]) : defaultTodos;
  } catch {
    return defaultTodos;
  }
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayDate() {
  return formatLocalDate(new Date());
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + days);
  return formatLocalDate(value);
}

function dueInfo(todo: Todo) {
  if (todo.completed) return { label: "已完成", className: "badge-muted", order: 6 };
  if (!todo.dueDate) return { label: "无截止时间", className: "badge-muted", order: 5 };
  const today = todayDate();
  const tomorrow = addDays(today, 1);
  const time = todo.dueTime || "09:00";
  if (todo.dueDate < today) return { label: `已逾期 ${time}`, className: "badge-overdue", order: 1 };
  if (todo.dueDate === today) return { label: `今天 ${time}`, className: "badge-today", order: 2 };
  if (todo.dueDate === tomorrow) return { label: `明天 ${time}`, className: "badge-tomorrow", order: 3 };
  return { label: `${todo.dueDate.slice(5)} ${time}`, className: "badge-muted", order: 4 };
}

function todoViewItems(todos: Todo[], view: TodoViewId) {
  const today = todayDate();
  if (view === "today") return todos.filter((todo) => !todo.completed && Boolean(todo.dueDate) && todo.dueDate! <= today);
  if (view === "planned") return todos.filter((todo) => !todo.completed && Boolean(todo.dueDate) && todo.dueDate! > today);
  if (view === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

function sortTodos(todos: Todo[]) {
  return [...todos].sort((a, b) => {
    const aInfo = dueInfo(a);
    const bInfo = dueInfo(b);
    if (aInfo.order !== bInfo.order) return aInfo.order - bInfo.order;
    return `${a.dueDate ?? "9999"} ${a.dueTime ?? "99:99"}`.localeCompare(`${b.dueDate ?? "9999"} ${b.dueTime ?? "99:99"}`);
  });
}

export function TodoPanel() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [activeView, setActiveView] = useState<TodoViewId>("today");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<TodoDraft>({ title: "", dueDate: "", dueTime: "", source: "" });
  const [error, setError] = useState("");
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailText, setMailText] = useState("");
  const [mailSuggestions, setMailSuggestions] = useState<MailTodoSuggestion[]>([]);
  const [mailError, setMailError] = useState("");
  const [mailAnalysisState, setMailAnalysisState] = useState<MailAnalysisState>("idle");
  const viewCounts = useMemo(
    () => Object.fromEntries(todoViewOrder.map((view) => [view, todoViewItems(todos, view).length])) as Record<TodoViewId, number>,
    [todos],
  );
  const visibleTodos = useMemo(() => sortTodos(todoViewItems(todos, activeView)), [activeView, todos]);
  const selectedSuggestionCount = useMemo(
    () => mailSuggestions.filter((suggestion) => suggestion.selected && suggestion.title.trim()).length,
    [mailSuggestions],
  );

  useEffect(() => {
    localStorage.setItem("unidock-todos", JSON.stringify(todos));
  }, [todos]);

  function openTodo(todo?: Todo) {
    setEditingTodoId(todo?.id ?? null);
    setDraft({ title: todo?.title ?? "", dueDate: todo?.dueDate ?? "", dueTime: todo?.dueTime ?? "", source: todo?.source ?? "" });
    setError("");
    setModalOpen(true);
  }

  function closeTodo() {
    setModalOpen(false);
    setEditingTodoId(null);
    setError("");
  }

  function saveTodo() {
    const title = draft.title.trim();
    if (!title) {
      setError("待办内容必填。");
      return;
    }
    const existing = editingTodoId ? todos.find((todo) => todo.id === editingTodoId) : undefined;
    const next: Todo = {
      id: editingTodoId ?? `todo-${Date.now()}`,
      title,
      completed: existing?.completed ?? false,
      dueDate: draft.dueDate || undefined,
      dueTime: draft.dueDate ? draft.dueTime || "09:00" : undefined,
      source: draft.source.trim() || undefined,
    };
    setTodos((items) => (editingTodoId ? items.map((todo) => (todo.id === editingTodoId ? next : todo)) : [next, ...items]));
    closeTodo();
  }

  function toggleTodo(id: string) {
    setTodos((items) => items.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  }

  function deleteTodo() {
    if (!editingTodoId) return;
    const confirmed = window.confirm("确定要删除这个待办吗？此操作不会影响其他待办。");
    if (!confirmed) return;
    setTodos((items) => items.filter((todo) => todo.id !== editingTodoId));
    closeTodo();
  }

  function closeMailModal() {
    setMailModalOpen(false);
    setMailText("");
    setMailSuggestions([]);
    setMailError("");
    setMailAnalysisState("idle");
  }

  async function analyzeMailText() {
    if (!mailText.trim()) {
      setMailError("请先粘贴邮件内容。");
      setMailSuggestions([]);
      setMailAnalysisState("idle");
      return;
    }
    setMailError("");
    setMailSuggestions([]);
    setMailAnalysisState("loading");

    try {
      const result = await analyzeMailWithAi(mailText, {
        today: todayDate(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "local",
      });
      if (!result.hasTasks || !result.suggestions.length) {
        setMailAnalysisState("empty");
        return;
      }
      setMailSuggestions(
        result.suggestions.map((suggestion, index) => ({
          id: `ai-suggestion-${Date.now()}-${index}`,
          selected: true,
          ...suggestion,
        })),
      );
      setMailAnalysisState("success");
    } catch (error) {
      setMailError(error instanceof Error ? error.message : "分析失败，请稍后重试，或手动新增 Todo。");
      setMailAnalysisState("error");
    }
  }

  function addSelectedSuggestions() {
    const selected = mailSuggestions.filter((suggestion) => suggestion.selected && suggestion.title.trim());
    if (!selected.length) {
      setMailError("请至少选择一条 Todo 建议。");
      return;
    }
    const nextTodos: Todo[] = selected.map((suggestion, index) => ({
      id: `mail-todo-${Date.now()}-${index}`,
      title: suggestion.title.trim(),
      completed: false,
      dueDate: suggestion.dueDate || undefined,
      dueTime: suggestion.dueDate ? suggestion.dueTime || "09:00" : undefined,
      source: suggestion.source?.trim() || undefined,
    }));
    setTodos((items) => [...nextTodos, ...items]);
    setActiveView("today");
    closeMailModal();
  }

  function updateSuggestion(id: string, patch: Partial<MailTodoSuggestion>) {
    setMailSuggestions((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <section className="panel todo-panel equal-panel" aria-labelledby="todo-title">
      <div className="panel-header todo-header">
        <div>
          <p className="panel-kicker">Todo</p>
          <h2 id="todo-title">待办事项</h2>
        </div>
      </div>
      <div className="todo-actions-row">
        <button className="ghost-btn" type="button" onClick={() => setMailModalOpen(true)}>
          <MailPlus size={16} />
          从邮件生成
        </button>
        <button className="action-btn" type="button" onClick={() => openTodo()}>
          <Plus size={16} />
          新增待办
        </button>
      </div>
      <div className="todo-view-tabs" aria-label="待办系统视图">
        {todoViewOrder.map((view) => (
          <button className={`todo-view-tab${activeView === view ? " active" : ""}`} key={view} type="button" aria-pressed={activeView === view} onClick={() => setActiveView(view)}>
            <span>{todoViewLabels[view]}</span>
            <span className="tab-count">{viewCounts[view]}</span>
          </button>
        ))}
      </div>
      <p className="sort-note">{todoViewNotes[activeView]}</p>
      {visibleTodos.length ? (
        <ul className="todo-list scroll-list">
          {visibleTodos.map((todo) => {
            const info = dueInfo(todo);
            return (
              <li className={`todo-item clickable${todo.completed ? " completed" : ""}`} key={todo.id} onClick={() => openTodo(todo)}>
                <button
                  className={`todo-check-button${todo.completed ? " checked" : ""}`}
                  type="button"
                  aria-label={`切换待办状态：${todo.title}`}
                  onClick={(click) => {
                    click.stopPropagation();
                    toggleTodo(todo.id);
                  }}
                >
                  {todo.completed ? "✓" : ""}
                </button>
                <span>
                  <span className="todo-title">{todo.title}</span>
                  <span className="todo-sub">
                    <span className={`status-badge ${info.className}`}>{info.label}</span>
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="empty-state">这个视图下暂时没有待办。</p>
      )}
      {modalOpen ? (
        <div className="modal-backdrop" onClick={closeTodo}>
          <article className="todo-modal" role="dialog" aria-modal="true" aria-labelledby="todo-modal-title" onClick={(click) => click.stopPropagation()}>
            <p className="modal-kicker">{editingTodoId ? "Todo detail" : "New todo"}</p>
            <h2 id="todo-modal-title">{editingTodoId ? "待办详情" : "新增待办"}</h2>
            <p className="local-note">填写待办内容，截止日期和时间可以留空。</p>
            <div className="drawer-form">
              <label>
                <span>待办内容</span>
                <input autoFocus value={draft.title} onChange={(input) => setDraft((current) => ({ ...current, title: input.target.value }))} />
              </label>
              <div className="form-grid compact-grid">
                <label>
                  <span>截止日期</span>
                  <input type="date" value={draft.dueDate} onChange={(input) => setDraft((current) => ({ ...current, dueDate: input.target.value }))} />
                </label>
                <label>
                  <span>截止时间</span>
                  <input type="time" value={draft.dueTime} onChange={(input) => setDraft((current) => ({ ...current, dueTime: input.target.value }))} />
                </label>
              </div>
              <label>
                <span>来源 / 课程</span>
                <input value={draft.source} onChange={(input) => setDraft((current) => ({ ...current, source: input.target.value }))} />
              </label>
              {error ? <p className="form-error">{error}</p> : null}
              <div className="modal-actions">
                {editingTodoId ? (
                  <button className="ghost-danger" type="button" onClick={deleteTodo}>
                    <Trash2 size={16} />
                    删除待办
                  </button>
                ) : null}
                <button className="ghost-btn" type="button" onClick={closeTodo}>取消</button>
                <button className="action-btn" type="button" onClick={saveTodo}>保存</button>
              </div>
            </div>
          </article>
        </div>
      ) : null}
      {mailModalOpen ? (
        <div className="modal-backdrop" onClick={closeMailModal}>
          <article className="todo-modal mail-modal" role="dialog" aria-modal="true" aria-labelledby="mail-modal-title" onClick={(click) => click.stopPropagation()}>
            <p className="modal-kicker">Mail assistant</p>
            <h2 id="mail-modal-title">从邮件生成待办</h2>
            <p className="local-note">手动粘贴一封邮件，AI 会生成可编辑的 Todo 建议；不会读取真实邮箱。</p>
            <div className="mail-assistant-grid">
              <section className="mail-input-block">
                <label>
                  <span>邮件内容</span>
                  <textarea
                    placeholder="粘贴邮件或通知内容，例如作业通知、预约提醒、社团活动或生活事项。"
                    value={mailText}
                    onChange={(event) => setMailText(event.target.value)}
                    disabled={mailAnalysisState === "loading"}
                  />
                </label>
                <p className="privacy-note">邮件内容会被发送给 AI 用于分析。请不要粘贴密码、验证码或其他敏感信息。</p>
                {mailError && mailAnalysisState !== "error" ? <p className="form-error">{mailError}</p> : null}
                <button className="action-btn" type="button" onClick={analyzeMailText} disabled={mailAnalysisState === "loading"}>
                  {mailAnalysisState === "loading" ? "分析中..." : "AI 分析"}
                </button>
              </section>
              <section className="suggestion-block" aria-live="polite">
                <p className="panel-kicker">Todo suggestions</p>
                {mailAnalysisState === "idle" ? (
                  <p className="empty-state">粘贴邮件后点击“AI 分析”，这里会出现 Todo 建议。</p>
                ) : null}
                {mailAnalysisState === "loading" ? (
                  <p className="empty-state">正在分析邮件内容...</p>
                ) : null}
                {mailAnalysisState === "empty" ? (
                  <p className="empty-state">未发现明确待办。你仍然可以手动新增 Todo。</p>
                ) : null}
                {mailAnalysisState === "error" ? (
                  <div className="analysis-error">
                    <p>分析失败，请稍后重试，或手动新增 Todo。</p>
                    {mailError ? <span>{mailError}</span> : null}
                    <button className="ghost-btn" type="button" onClick={analyzeMailText}>
                      <RefreshCw size={15} />
                      重试
                    </button>
                  </div>
                ) : null}
                {mailAnalysisState === "success" && mailSuggestions.length ? (
                  <div className="suggestion-list">
                    {mailSuggestions.map((suggestion) => (
                      <article className="suggestion-card" key={suggestion.id}>
                        <input
                          type="checkbox"
                          checked={suggestion.selected}
                          aria-label={`是否添加 ${suggestion.title}`}
                          onChange={(event) => updateSuggestion(suggestion.id, { selected: event.target.checked })}
                        />
                        <div className="suggestion-fields">
                          <label>
                            <span>标题</span>
                            <input value={suggestion.title} onChange={(event) => updateSuggestion(suggestion.id, { title: event.target.value })} />
                          </label>
                          <div className="form-grid compact-grid">
                            <label>
                              <span>截止日期</span>
                              <input type="date" value={suggestion.dueDate ?? ""} onChange={(event) => updateSuggestion(suggestion.id, { dueDate: event.target.value })} />
                            </label>
                            <label>
                              <span>截止时间</span>
                              <input type="time" value={suggestion.dueTime ?? ""} onChange={(event) => updateSuggestion(suggestion.id, { dueTime: event.target.value })} />
                            </label>
                          </div>
                          <label>
                            <span>来源 / 课程</span>
                            <input value={suggestion.source ?? ""} onChange={(event) => updateSuggestion(suggestion.id, { source: event.target.value })} />
                          </label>
                          <div className="ai-meta-row">
                            <span>{typeLabels[suggestion.type ?? "other"]}</span>
                            <span>置信度 {confidenceLabels[suggestion.confidence ?? "medium"]}</span>
                          </div>
                          {suggestion.evidence ? (
                            <p className="evidence-line">
                              <strong>原文依据</strong>
                              {suggestion.evidence}
                            </p>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>
            <div className="modal-actions">
              <button className="ghost-btn" type="button" onClick={closeMailModal}>取消</button>
              <button className="action-btn" type="button" onClick={addSelectedSuggestions} disabled={selectedSuggestionCount === 0 || mailAnalysisState !== "success"}>
                添加选中的待办
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
