import type { KeyboardEvent } from "react";
import type { AgendaEvent, AgendaEventModalState } from "../types";
import { isActiveNow } from "../utils/time";

type AgendaEventBlockProps = {
  event: AgendaEvent;
  position: { top: number; height: number };
  onOpen: (modal: AgendaEventModalState) => void;
};

export function AgendaEventBlock({ event, position, onOpen }: AgendaEventBlockProps) {
  const activeNow = isActiveNow(event.startTime, event.endTime, event.weekday);

  function openEvent(target: HTMLElement) {
    onOpen({ event, originRect: target.getBoundingClientRect() });
  }

  function handleKeyDown(keyboardEvent: KeyboardEvent<HTMLButtonElement>) {
    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
      keyboardEvent.preventDefault();
      openEvent(keyboardEvent.currentTarget);
    }
  }

  return (
    <button
      className={`course-block${activeNow ? " active-now" : ""}`}
      style={{ top: position.top, height: position.height }}
      type="button"
      onClick={(eventClick) => openEvent(eventClick.currentTarget)}
      onKeyDown={handleKeyDown}
    >
      <span className="course-name">{event.name}</span>
      <span className="course-meta">
        {event.startTime} - {event.endTime}
      </span>
      <span className="course-meta">{event.location}</span>
    </button>
  );
}
