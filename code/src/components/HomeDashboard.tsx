import { OverviewHeader } from "./OverviewHeader";
import { TodoPanel } from "./TodoPanel";
import { WeeklyScheduleTimeline } from "./WeeklyScheduleTimeline";
import type { Course, CourseModalState, UniLink } from "../types";

type HomeDashboardProps = {
  courses: Course[];
  quickLinks: UniLink[];
  onCourseOpen: (modal: CourseModalState) => void;
};

export function HomeDashboard({ courses, quickLinks, onCourseOpen }: HomeDashboardProps) {
  return (
    <>
      <OverviewHeader
        kicker="个人学习工作台"
        title="今天要看的东西"
        description="这里是 Home 页，只放本周课表、待办事项和几个高频入口。"
        quickLinks={quickLinks}
      />
      <section className="dashboard-grid" aria-label="Home 工作台">
        <WeeklyScheduleTimeline courses={courses} onCourseOpen={onCourseOpen} />
        <TodoPanel />
      </section>
    </>
  );
}
