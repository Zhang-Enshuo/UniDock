import { useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { HomeDashboard } from "./components/HomeDashboard";
import { LinkPage } from "./components/LinkPage";
import { ProfileSettingsPage } from "./components/ProfileSettingsPage";
import { agendaEvents } from "./data/courses";
import { links } from "./data/links";
import { navItems } from "./data/navItems";
import type { LinkPageId, PageId } from "./types";

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("home");
  const activeNavItem = useMemo(
    () => navItems.find((item) => item.id === activePage) ?? navItems[0],
    [activePage],
  );
  const quickLinks = links.filter((link) => ["moodle", "email", "allocate", "current-student"].includes(link.id));

  return (
    <AppShell activePage={activePage} onPageChange={setActivePage}>
      {activePage === "home" ? (
        <HomeDashboard events={agendaEvents} quickLinks={quickLinks} />
      ) : activePage === "settings" ? (
        <ProfileSettingsPage />
      ) : (
        <LinkPage activeCategoryId={activePage as LinkPageId} category={activeNavItem} links={links} />
      )}
    </AppShell>
  );
}
