import Content from "@/components/about/Content/Content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "How the receipt processor extracts, checks and reviews data, and what its evaluation set shows.",
};


const AboutPage = () => {
  return (
    <Content />
  );
}


export default AboutPage;