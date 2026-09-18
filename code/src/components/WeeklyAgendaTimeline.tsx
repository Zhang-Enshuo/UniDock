import { CalendarPlus } from "lucide-react";
import { AgendaEventBlock } from "./AgendaEventBlock";
import type { AgendaEvent, AgendaEventModalState } from "../types";
import { getCoursePosition, getTodayId, hourHeight, timelineEndHour, timelineStartHour, weekdays } from "../utils/time";

type WeeklyAgendaTimelineProps = {
  events: AgendaEvent[];
  onEventOpen: (modal: AgendaEventModalState) => void;
  onManageOpen: (eventId?: string) => void;
};

export function WeeklyAgendaTimeline({ events, onEventOpen, onManageOpen }: WeeklyAgendaTimelineProps) {
  const hours = Array.from({ length: timelineEndHour - timelineStartHour + 1 }, (_, index) => timelineStartHour + index);
  const todayId = getTodayId();

  return (
    <section className="panel schedule-panel equal-panel" aria-labelledby="agenda-title">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Schedule</p>
          <h2 id="agenda-title">本周日程</h2>
        </div>
        <div className="panel-actions">
          <button className="panel-action primary-action" type="button" onClick={() => onManageOpen()}>
            <CalendarPlus size={16} />
            添加日程
          </button>
          <a className="panel-action" href="https://timetables.unswcollege.edu.au/aplus/student" target="_blank" rel="noreferrer">
            打开 Allocate+
          </a>
        </div>
      </div>

      <div className="timeline-shell agenda-scroll" style={{ "--hour-height": `${hourHeight}px` } as React.CSSProperties}>
        <div className="timeline-header">
          <div className="timeline-corner" />
          {weekdays.map((day) => (
            <div className={`timeline-day-head${todayId === day.id ? " today" : ""}`} key={day.id}>
              <span>{day.label}</span>
              <strong>{day.zh}</strong>
            </div>
          ))}
        </div>

        <div className="timeline-body">
          <div className="time-axis">
            {hours.map((hour) => (
              <div className="time-slot-label" key={hour}>
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>
          <div className="week-grid">
            {weekdays.map((day) => (
              <div className={`day-lane${todayId === day.id ? " today" : ""}`} key={day.id}>
                {hours.slice(0, -1).map((hour) => (
                  <div className="hour-line" key={hour} />
                ))}
                {events
                  .filter((event) => event.weekday === day.id)
                  .map((event) => (
                    <AgendaEventBlock event={event} key={event.id} onOpen={onEventOpen} position={getCoursePosition(event.startTime, event.endTime)} />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
