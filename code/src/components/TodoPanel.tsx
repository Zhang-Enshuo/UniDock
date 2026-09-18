import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Todo } from "../types";

const defaultTodos: Todo[] = [
  { id: "todo-1", title: "提交 Academic English essay plan", completed: false, dueDate: "2026-09-17", dueTime: "16:00" },
  { id: "todo-2", title: "确认下周 Computing Lab 教室", completed: false, dueDate: "2026-09-18", dueTime: "18:00" },
  { id: "todo-3", title: "预约 Student ID Card", completed: false, dueDate: "2026-09-19", dueTime: "10:00" },
  { id: "todo-4", title: "整理住宿材料", completed: false },
  { id: "todo-5", title: "检查 Student Email", completed: true, dueDate: "2026-09-18", dueTime: "09:00" },
];

type TodoDraft = {
  title: string;
  dueDate: string;
  dueTime: string;
};

function loadTodos() {
  try {
    const saved = localStorage.getItem("unidock-todos");
    return saved ? (JSON.parse(saved) as Todo[]) : defaultTodos;
  } catch {
    return defaultTodos;
  }
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
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
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<TodoDraft>({ title: "", dueDate: "", dueTime: "" });
  const [error, setError] = useState("");
  const openCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);
  const sortedTodos = useMemo(() => sortTodos(todos), [todos]);

  useEffect(() => {
    localStorage.setItem("unidock-todos", JSON.stringify(todos));
  }, [todos]);

  function openTodo(todo?: Todo) {
    setEditingTodoId(todo?.id ?? null);
    setDraft({ title: todo?.title ?? "", dueDate: todo?.dueDate ?? "", dueTime: todo?.dueTime ?? "" });
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

  return (
    <section className="panel todo-panel equal-panel" aria-labelledby="todo-title">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Todo</p>
          <h2 id="todo-title">待办事项</h2>
        </div>
        <div className="panel-actions">
          <span className="todo-count">{openCount}</span>
          <button className="action-btn" type="button" onClick={() => openTodo()}>
            <Plus size={16} />
            新增待办
          </button>
        </div>
      </div>
      <p className="sort-note">自动排序：未完成优先，按截止时间排列</p>
      {todos.length ? (
        <ul className="todo-list scroll-list">
          {sortedTodos.map((todo) => {
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
                  <span className={`status-badge ${info.className}`}>{info.label}</span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="empty-state">还没有待办。把下一件要做的事写下来。</p>
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
    </section>
  );
}
