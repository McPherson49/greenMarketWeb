// pages/about.tsx (or app/about/page.tsx for App Router)

import AboutHero from "@/components/about/AboutHero";
import HowToSellBuy from "@/components/about/HowToSellBuy";
import SafetySection from "@/components/about/SafetySection";
import WhatWeProvide from "@/components/about/WhatWeProvide";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AboutHero />
      <WhatWeProvide />
      <HowToSellBuy />
      <SafetySection />
    </div>
  );
}
