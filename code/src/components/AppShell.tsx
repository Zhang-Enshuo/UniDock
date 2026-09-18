import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";
import type { PageId } from "../types";

type AppShellProps = {
  activePage: PageId;
  children: ReactNode;
  onPageChange: (page: PageId) => void;
};

export function AppShell({ activePage, children, onPageChange }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handlePageChange(page: PageId) {
    onPageChange(page);
    setMobileNavOpen(false);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="学校入口导航">
        <Brand />
        <SidebarNav activePage={activePage} onPageChange={handlePageChange} />
      </aside>
      <header className="mobile-topbar">
        <Brand compact />
        <button
          className="icon-button"
          type="button"
          aria-label="打开导航"
          aria-controls="mobile-nav"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          <Menu size={20} />
        </button>
      </header>
      {mobileNavOpen ? (
        <div className="mobile-nav" id="mobile-nav">
          <SidebarNav activePage={activePage} onPageChange={handlePageChange} />
        </div>
      ) : null}
      <main className="workspace">{children}</main>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand${compact ? " brand-compact" : ""}`}>
      <div className="brand-mark">U</div>
      <div>
        <h1>UniDock</h1>
        <p>UNSW student hub</p>
      </div>
    </div>
  );
}
