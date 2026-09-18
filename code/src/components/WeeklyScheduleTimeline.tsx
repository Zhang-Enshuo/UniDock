import { CourseBlock } from "./CourseBlock";
import type { Course, CourseModalState } from "../types";
import { getCoursePosition, getTodayId, hourHeight, timelineEndHour, timelineStartHour, weekdays } from "../utils/time";

type WeeklyScheduleTimelineProps = {
  courses: Course[];
  onCourseOpen: (modal: CourseModalState) => void;
};

export function WeeklyScheduleTimeline({ courses, onCourseOpen }: WeeklyScheduleTimelineProps) {
  const hours = Array.from({ length: timelineEndHour - timelineStartHour + 1 }, (_, index) => timelineStartHour + index);
  const todayId = getTodayId();

  return (
    <section className="panel schedule-panel" aria-labelledby="schedule-title">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Schedule</p>
          <h2 id="schedule-title">本周课表</h2>
        </div>
        <a className="panel-action" href="https://timetables.unswcollege.edu.au/aplus/student" target="_blank" rel="noreferrer">
          打开 Allocate+
        </a>
      </div>
      <div className="timeline-shell" style={{ "--hour-height": `${hourHeight}px` } as React.CSSProperties}>
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
                {courses
                  .filter((course) => course.weekday === day.id)
                  .map((course) => (
                    <CourseBlock course={course} key={course.id} onOpen={onCourseOpen} position={getCoursePosition(course.startTime, course.endTime)} />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
