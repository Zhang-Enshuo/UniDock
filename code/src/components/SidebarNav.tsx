import { BookOpen, CircleHelp, FileText, HeartHandshake, Home, KeyRound, Map, Settings } from "lucide-react";
import { navItems } from "../data/navItems";
import type { PageId } from "../types";

const icons = { home: Home, study: BookOpen, admin: FileText, support: HeartHandshake, help: CircleHelp, campus: Map, account: KeyRound, settings: Settings };

type SidebarNavProps = {
  activePage: PageId;
  onPageChange: (page: PageId) => void;
};

export function SidebarNav({ activePage, onPageChange }: SidebarNavProps) {
  const mainItems = navItems.filter((item) => item.id !== "settings");
  const settingsItem = navItems.find((item) => item.id === "settings");

  function renderItem(item: (typeof navItems)[number]) {
    const Icon = icons[item.id];
    return (
      <button className={`nav-item${activePage === item.id ? " active" : ""}`} key={item.id} type="button" onClick={() => onPageChange(item.id)}>
        <span className="nav-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <span className="nav-copy">
          <span className="nav-label">{item.label}</span>
          <span className="nav-subtitle">{item.subtitle}</span>
        </span>
      </button>
    );
  }

  return (
    <nav className="sidebar-nav" aria-label="UniDock 导航">
      <div className="nav-list nav-main">{mainItems.map(renderItem)}</div>
      {settingsItem ? <div className="nav-list nav-bottom">{renderItem(settingsItem)}</div> : null}
    </nav>
  );
}
