import { PageSection } from "@/components/about/PageSection";
import { getAboutLinks } from "./lib/links";

export const ElsewhereSection = () => {
  const links = getAboutLinks();
  if (links.length === 0) return null;

  return (
    <PageSection id="links" title="Elsewhere">
      <ul className="mt-3 space-y-1 text-sm">
        {links.map(({ href, label }) => (
          <li key={href}>
            <a href={href} target="_blank" rel="noreferrer" className="text-accent underline">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}