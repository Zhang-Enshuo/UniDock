import { useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { CoursePreviewModal } from "./components/CoursePreviewModal";
import { HomeDashboard } from "./components/HomeDashboard";
import { LinkPage } from "./components/LinkPage";
import { courses } from "./data/courses";
import { links } from "./data/links";
import { navItems } from "./data/navItems";
import type { CourseModalState, PageId } from "./types";

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("home");
  const [courseModal, setCourseModal] = useState<CourseModalState>(null);
  const activeNavItem = useMemo(
    () => navItems.find((item) => item.id === activePage) ?? navItems[0],
    [activePage],
  );
  const quickLinks = links.filter((link) => ["moodle", "email", "allocate"].includes(link.id));

  return (
    <>
      <AppShell activePage={activePage} onPageChange={setActivePage}>
        {activePage === "home" ? (
          <HomeDashboard courses={courses} quickLinks={quickLinks} onCourseOpen={setCourseModal} />
        ) : (
          <LinkPage category={activeNavItem} links={links.filter((link) => link.categoryId === activePage)} />
        )}
      </AppShell>
      <CoursePreviewModal modal={courseModal} onClose={() => setCourseModal(null)} />
    </>
  );
}
