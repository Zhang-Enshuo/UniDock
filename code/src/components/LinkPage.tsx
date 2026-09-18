import { LinkCard } from "./LinkCard";
import { OverviewHeader } from "./OverviewHeader";
import type { NavItem, UniLink } from "../types";

type LinkPageProps = {
  category: NavItem;
  links: UniLink[];
};

export function LinkPage({ category, links }: LinkPageProps) {
  return (
    <>
      <OverviewHeader kicker="学校入口" title={category.label} description="这里是导航分栏页，只展示当前分类下的学校链接。" />
      <section className="panel links-panel" aria-labelledby="links-title">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Links</p>
            <h2 id="links-title">{category.label}</h2>
          </div>
          <span className="panel-meta">{links.length} 个入口</span>
        </div>
        <div className="link-grid">
          {links.map((link) => (
            <LinkCard link={link} key={link.id} />
          ))}
        </div>
      </section>
    </>
  );
}
