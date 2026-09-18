import { X } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { AgendaEvent, Weekday } from "../types";
import { weekdayLabel, weekdays } from "../utils/time";

type AgendaEditDrawerProps = {
  events: AgendaEvent[];
  editingEventId: string | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEditSelect: (id: string) => void;
  onSave: (event: AgendaEvent) => void;
};

type AgendaDraft = {
  name: string;
  weekday: Weekday | "";
  startTime: string;
  endTime: string;
  location: string;
};

const emptyDraft: AgendaDraft = {
  name: "",
  weekday: "",
  startTime: "",
  endTime: "",
  location: "",
};

export function AgendaEditDrawer({ events, editingEventId, open, onClose, onDelete, onEditSelect, onSave }: AgendaEditDrawerProps) {
  const editingEvent = useMemo(() => events.find((event) => event.id === editingEventId), [editingEventId, events]);
  const [draft, setDraft] = useState<AgendaDraft>(emptyDraft);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setDraft(editingEvent ? {
      name: editingEvent.name,
      weekday: editingEvent.weekday,
      startTime: editingEvent.startTime,
      endTime: editingEvent.endTime,
      location: editingEvent.location,
    } : emptyDraft);
    setError("");
  }, [editingEvent, open]);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim()) {
      setError("事件名称必填。");
      return;
    }
    if (!draft.weekday) {
      setError("请选择星期。");
      return;
    }
    if (!draft.startTime || !draft.endTime) {
      setError("请填写开始时间和结束时间。");
      return;
    }
    if (draft.startTime >= draft.endTime) {
      setError("开始时间需要早于结束时间。");
      return;
    }
    onSave({
      id: editingEventId ?? `event-${Date.now()}`,
      name: draft.name.trim(),
      weekday: draft.weekday,
      startTime: draft.startTime,
      endTime: draft.endTime,
      location: draft.location.trim() || "TBC",
    });
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" aria-label="编辑日程" onClick={(click) => click.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <p className="modal-kicker">Schedule editor</p>
            <h2>编辑日程</h2>
            <p className="local-note">日程事件只保存在此浏览器中。</p>
          </div>
          <button className="icon-button bordered" type="button" aria-label="关闭日程抽屉" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="mini-list">
          {events.map((event) => (
            <div className="mini-row" key={event.id}>
              <div>
                <strong>{event.name}</strong>
                <p>
                  {weekdayLabel(event.weekday)} {event.startTime}-{event.endTime} · {event.location}
                </p>
              </div>
              <button className="ghost-btn" type="button" onClick={() => onEditSelect(event.id)}>
                编辑
              </button>
            </div>
          ))}
        </div>

        <form className="drawer-form" onSubmit={handleSubmit}>
          <h3>{editingEventId ? "编辑事件" : "新增事件"}</h3>
          <label>
            <span>事件名称</span>
            <input placeholder="例如：Academic Writing Tutorial" value={draft.name} onChange={(input) => setDraft((current) => ({ ...current, name: input.target.value }))} />
          </label>
          <div className="weekday-row" aria-label="选择星期">
            {weekdays.map((day) => (
              <button className={draft.weekday === day.id ? "selected" : ""} key={day.id} type="button" onClick={() => setDraft((current) => ({ ...current, weekday: day.id }))}>
                {day.zh}
              </button>
            ))}
          </div>
          <div className="form-grid compact-grid">
            <label>
              <span>开始时间</span>
              <input type="time" value={draft.startTime} onChange={(input) => setDraft((current) => ({ ...current, startTime: input.target.value }))} />
            </label>
            <label>
              <span>结束时间</span>
              <input type="time" value={draft.endTime} onChange={(input) => setDraft((current) => ({ ...current, endTime: input.target.value }))} />
            </label>
          </div>
          <label>
            <span>地点</span>
            <input placeholder="例如：Webster 251" value={draft.location} onChange={(input) => setDraft((current) => ({ ...current, location: input.target.value }))} />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="modal-actions">
            {editingEventId ? (
              <button className="ghost-danger" type="button" onClick={() => onDelete(editingEventId)}>
                删除事件
              </button>
            ) : null}
            <button className="action-btn" type="submit">保存事件</button>
          </div>
        </form>
      </aside>
    </div>
  );
}
