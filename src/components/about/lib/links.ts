import { config } from "@/lib/config";

export type AboutLink = {
  href: string;
  label: string;
};

export function getAboutLinks(): AboutLink[] {
  const links: AboutLink[] = [];

  if (config.repoUrl) {
    links.push({ href: config.repoUrl, label: "Source code and the backend" });
  }
  if (config.demoVideoUrl) {
    links.push({ href: config.demoVideoUrl, label: "Recorded walkthrough" });
  }
  if (config.sheetUrl) {
    links.push({ href: config.sheetUrl, label: "Approved rows in Google Sheets" });
  }

  return links;
}