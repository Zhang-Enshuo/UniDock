import { BookOpen, CircleHelp, FileText, HeartHandshake, Home, KeyRound, Map } from "lucide-react";
import { navItems } from "../data/navItems";
import type { PageId } from "../types";

const icons = { home: Home, study: BookOpen, admin: FileText, support: HeartHandshake, help: CircleHelp, campus: Map, account: KeyRound };

type SidebarNavProps = {
  activePage: PageId;
  onPageChange: (page: PageId) => void;
};

export function SidebarNav({ activePage, onPageChange }: SidebarNavProps) {
  return (
    <nav className="nav-list">
      {navItems.map((item) => {
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
      })}
    </nav>
  );
}
