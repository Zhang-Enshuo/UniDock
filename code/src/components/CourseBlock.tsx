import type { KeyboardEvent } from "react";
import type { Course, CourseModalState } from "../types";
import { isActiveNow } from "../utils/time";

type CourseBlockProps = {
  course: Course;
  position: { top: number; height: number };
  onOpen: (modal: CourseModalState) => void;
};

export function CourseBlock({ course, position, onOpen }: CourseBlockProps) {
  const activeNow = isActiveNow(course.startTime, course.endTime, course.weekday);

  function openCourse(target: HTMLElement) {
    onOpen({ course, originRect: target.getBoundingClientRect() });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCourse(event.currentTarget);
    }
  }

  return (
    <button
      className={`course-block${activeNow ? " active-now" : ""}`}
      style={{ top: position.top, height: position.height }}
      type="button"
      onClick={(event) => openCourse(event.currentTarget)}
      onKeyDown={handleKeyDown}
    >
      <span className="course-name">{course.name}</span>
      <span className="course-meta">{course.startTime} - {course.endTime}</span>
      <span className="course-meta">{course.location}</span>
    </button>
  );
}
