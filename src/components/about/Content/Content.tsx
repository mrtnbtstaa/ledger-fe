import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/AboutIntro";
import { ChecksSection } from "@/components/about/ChecksSection";
import { ElsewhereSection } from "@/components/about/ElsewhereSection";
import { PipelineSection } from "@/components/about/PipelineSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "How the receipt processor extracts, checks and reviews data, and what its evaluation set shows.",
};

export default function Content() {
  return (
    <div className="mx-auto w-full max-w-[680px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-[2rem] leading-tight sm:text-4xl">
        What this does, and how you can check it
      </h1>
      <AboutIntro />
      <PipelineSection />
      <ChecksSection />
      <ElsewhereSection />
    </div>
  );
}