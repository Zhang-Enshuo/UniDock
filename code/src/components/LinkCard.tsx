import { ExternalLink } from "lucide-react";
import type { UniLink } from "../types";

export function LinkCard({ link }: { link: UniLink }) {
  return (
    <a className="link-card" href={link.url} target="_blank" rel="noreferrer">
      <span className="link-title-row">
        <span className="link-title">{link.title}</span>
        <span className="external-icon" aria-hidden="true">
          <ExternalLink size={16} />
        </span>
      </span>
      <span className="link-description">{link.description}</span>
    </a>
  );
}
