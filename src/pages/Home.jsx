import React from "react";
import Hero from "../components/Hero";
import WhyPartner from "../components/WhyPartner";
import SuccessStories from "../components/SuccessStories";
import HowItWorks from "../components/HowItWorks";
import FAQ from "../components/FAQ";
import GetStarted from "../components/GetStarted";
import FinalCTA from "../components/FinalCTA";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const siteName = "Tryde";
  const primaryColor = "#FF5252";

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar siteName={siteName} primaryColor={primaryColor} />
      <Hero siteName={siteName} primaryColor={primaryColor} />

      <WhyPartner siteName={siteName} primaryColor={primaryColor} />
      <SuccessStories />
      <HowItWorks primaryColor={primaryColor} />
      <FAQ />
      <GetStarted />
      <FinalCTA siteName={siteName} primaryColor={primaryColor} />

      <Footer siteName={siteName} />
    </div>
  );
}
