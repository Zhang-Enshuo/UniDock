import { LinkCard } from "./LinkCard";
import { OverviewHeader } from "./OverviewHeader";
import { useMemo, useState } from "react";
import { navItems } from "../data/navItems";
import type { LinkPageId, NavItem, UniLink } from "../types";

type LinkPageProps = {
  activeCategoryId: LinkPageId;
  category: NavItem;
  links: UniLink[];
};

const categoryNames = Object.fromEntries(navItems.map((item) => [item.id, item.label]));

export function LinkPage({ activeCategoryId, category, links }: LinkPageProps) {
  const [search, setSearch] = useState("");
  const visibleLinks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const pool = query ? links : links.filter((link) => link.categoryId === activeCategoryId);
    return pool.filter((link) => {
      const categoryName = categoryNames[link.categoryId] ?? "";
      return !query || `${link.title} ${link.description} ${categoryName}`.toLowerCase().includes(query);
    });
  }, [activeCategoryId, links, search]);

  return (
    <>
      <OverviewHeader kicker="学校入口" title={category.label} description="这里是导航分栏页，只展示当前分类或搜索到的学校链接。" />
      <section className="panel links-panel" aria-labelledby="links-title">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Links</p>
            <h2 id="links-title">{search.trim() ? "搜索结果" : category.label}</h2>
          </div>
          <span className="panel-meta">{visibleLinks.length} 个入口</span>
        </div>
        <div className="link-tools">
          <label className="sr-only" htmlFor="link-search">搜索学校入口</label>
          <input
            id="link-search"
            type="search"
            placeholder="搜索学校入口、说明或分类"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button className="ghost-btn" type="button" onClick={() => setSearch("")}>清除搜索</button>
        </div>
        {visibleLinks.length ? (
          <div className="link-grid">
            {visibleLinks.map((link) => (
              <LinkCard link={link} key={link.id} />
            ))}
          </div>
        ) : (
          <p className="empty-state">没有找到相关入口。</p>
        )}
      </section>
    </>
  );
}
