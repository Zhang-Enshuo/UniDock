import type { UniLink } from "../types";

type OverviewHeaderProps = {
  kicker: string;
  title: string;
  description: string;
  quickLinks?: UniLink[];
};

export function OverviewHeader({ kicker, title, description, quickLinks = [] }: OverviewHeaderProps) {
  const date = new Intl.DateTimeFormat("en-AU", { weekday: "long", day: "numeric", month: "short" }).format(new Date());

  return (
    <section className="overview" aria-labelledby="overview-title">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2 id="overview-title">{title}</h2>
        <p className="overview-copy">{description}</p>
      </div>
      <div className="overview-actions">
        <p className="date-pill">{date}</p>
        {quickLinks.length ? (
          <div className="quick-links" aria-label="高频快捷入口">
            {quickLinks.map((link) => (
              <a className="quick-link" href={link.url} key={link.id} target="_blank" rel="noreferrer">
                {link.title}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
