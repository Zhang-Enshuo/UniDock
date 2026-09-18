import { X } from "lucide-react";
import { useEffect } from "react";
import type { CourseModalState } from "../types";

type CoursePreviewModalProps = {
  modal: CourseModalState;
  onClose: () => void;
};

const weekdayLabels = { mon: "周一", tue: "周二", wed: "周三", thu: "周四", fri: "周五", sat: "周六", sun: "周日" };

export function CoursePreviewModal({ modal, onClose }: CoursePreviewModalProps) {
  useEffect(() => {
    if (!modal) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal, onClose]);

  if (!modal) return null;

  const { course, originRect } = modal;
  const transformOrigin = `${originRect.left + originRect.width / 2}px ${originRect.top + originRect.height / 2}px`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <article
        className="course-modal"
        style={{ transformOrigin }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="关闭课程详情" onClick={onClose}>
          <X size={18} />
        </button>
        <p className="modal-kicker">课程详情</p>
        <h2 id="course-modal-title">{course.name}</h2>
        <dl className="course-detail-list">
          <div>
            <dt>星期</dt>
            <dd>{weekdayLabels[course.weekday]}</dd>
          </div>
          <div>
            <dt>时间</dt>
            <dd>{course.startTime} - {course.endTime}</dd>
          </div>
          <div>
            <dt>地点</dt>
            <dd>{course.location}</dd>
          </div>
        </dl>
      </article>
    </div>
  );
}
