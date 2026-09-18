import { Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { Todo } from "../types";

const defaultTodos: Todo[] = [
  { id: "todo-1", title: "确认本周 Academic English 教室", completed: false },
  { id: "todo-2", title: "打开 Moodle 查看新作业", completed: false },
  { id: "todo-3", title: "检查 Student Email", completed: true },
];

function loadTodos() {
  try {
    const saved = localStorage.getItem("unidock-todos");
    return saved ? (JSON.parse(saved) as Todo[]) : defaultTodos;
  } catch {
    return defaultTodos;
  }
}

export function TodoPanel() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [draft, setDraft] = useState("");
  const openCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);

  useEffect(() => {
    localStorage.setItem("unidock-todos", JSON.stringify(todos));
  }, [todos]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setTodos((items) => [{ id: `todo-${Date.now()}`, title, completed: false }, ...items]);
    setDraft("");
  }

  function toggleTodo(id: string) {
    setTodos((items) => items.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  }

  function deleteTodo(id: string) {
    setTodos((items) => items.filter((todo) => todo.id !== id));
  }

  return (
    <section className="panel todo-panel" aria-labelledby="todo-title">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Todo</p>
          <h2 id="todo-title">待办事项</h2>
        </div>
        <span className="todo-count">{openCount}</span>
      </div>
      <form className="todo-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="todo-input">输入待办事项</label>
        <input id="todo-input" placeholder="写下一件要做的事" value={draft} onChange={(event) => setDraft(event.target.value)} />
        <button type="submit" disabled={!draft.trim()}>添加</button>
      </form>
      {todos.length ? (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li className={`todo-item${todo.completed ? " completed" : ""}`} key={todo.id}>
              <input className="todo-check" type="checkbox" checked={todo.completed} aria-label={`切换待办状态：${todo.title}`} onChange={() => toggleTodo(todo.id)} />
              <span className="todo-title">{todo.title}</span>
              <button className="delete-todo" type="button" aria-label={`删除待办：${todo.title}`} onClick={() => deleteTodo(todo.id)}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">还没有待办。把下一件要做的事写下来。</p>
      )}
    </section>
  );
}
