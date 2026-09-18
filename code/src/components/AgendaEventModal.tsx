import { Edit3, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import type { AgendaEventModalState } from "../types";
import { weekdayLabel } from "../utils/time";

type AgendaEventModalProps = {
  modal: AgendaEventModalState;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export function AgendaEventModal({ modal, onClose, onDelete, onEdit }: AgendaEventModalProps) {
  useEffect(() => {
    if (!modal) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal, onClose]);

  if (!modal) return null;

  const { event, originRect } = modal;
  const transformOrigin = `${originRect.left + originRect.width / 2}px ${originRect.top + originRect.height / 2}px`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <article className="course-modal" style={{ transformOrigin }} role="dialog" aria-modal="true" aria-labelledby="agenda-modal-title" onClick={(click) => click.stopPropagation()}>
        <button className="modal-close" type="button" aria-label="关闭事件详情" onClick={onClose}>
          <X size={18} />
        </button>
        <p className="modal-kicker">事件详情</p>
        <h2 id="agenda-modal-title">{event.name}</h2>
        <dl className="course-detail-list">
          <div>
            <dt>星期</dt>
            <dd>{weekdayLabel(event.weekday)}</dd>
          </div>
          <div>
            <dt>时间</dt>
            <dd>{event.startTime} - {event.endTime}</dd>
          </div>
          <div>
            <dt>地点</dt>
            <dd>{event.location}</dd>
          </div>
        </dl>
        <div className="modal-actions">
          <button className="ghost-danger" type="button" onClick={() => onDelete(event.id)}>
            <Trash2 size={16} />
            删除
          </button>
          <button className="action-btn" type="button" onClick={() => onEdit(event.id)}>
            <Edit3 size={16} />
            编辑
          </button>
        </div>
      </article>
    </div>
  );
}
