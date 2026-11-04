import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import Link from "next/link";
import { WakeUpBanner } from "@/components/backend-status/WakeUpBanner";
import { config } from "@/lib/config";
import { Providers } from "./providers";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], weight: "500", variable: "--font-newsreader", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Ledger — receipt processing you can audit", template: "%s · Ledger" },
  description:
    "Upload a receipt photo or PDF and see the extracted data, the checks behind it, and what still needs a human.",
};

const nav = [
  { href: "/", label: "Process" },
  { href: "/history", label: "History" },
  { href: "/review", label: "Review" },
  { href: "/about", label: "About" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body className="flex min-h-dvh flex-col bg-paper text-ink antialiased">
        <a
          href="#main"
          className="sr-only rounded-sm bg-surface px-3 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        <header className="border-b border-line">
          <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="font-serif text-xl leading-none">
              Ledger
            </Link>
            <nav aria-label="Main" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-muted">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <Providers>
          <WakeUpBanner />
          <main id="main" className="flex-1">
            {children}
          </main>
        </Providers>
        <footer className="mt-16 border-t border-line">
          <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-6 text-sm text-ink-muted sm:px-6 lg:px-8">
            <p className="flex-1">
              Recycled demo data. Uploads are deleted after {config.retentionHours} hours.
            </p>
            {config.sheetUrl ? (
              <a href={config.sheetUrl} target="_blank" rel="noreferrer" className="hover:text-ink">
                Approved rows in Google Sheets
              </a>
            ) : null}
            {config.repoUrl ? (
              <a href={config.repoUrl} target="_blank" rel="noreferrer" className="hover:text-ink">
                Source
              </a>
            ) : null}
          </div>
        </footer>
      </body>
    </html>
  );
}
