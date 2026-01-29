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
import DaownloadPannel from "../components/DaownloadPannel";

export default function Home() {
  const siteName = "Tryde";
  const primaryColor = "#FF5252";

  return (
    <div className="min-h-screen bg-white font-sans antialiased font-['Poppins']">

      <Navbar siteName={siteName} primaryColor={primaryColor} />

      <section id="home">
        <Hero siteName={siteName} primaryColor={primaryColor} />
      </section>

      <section id="why">
        <WhyPartner siteName={siteName} primaryColor={primaryColor} />
      </section>

      <section id="stories">
        <SuccessStories />
      </section>

      <section id="how">
        <HowItWorks primaryColor={primaryColor} />
      </section>

      <section id="faq">
        <FAQ />
      </section>

    <section id="doawnload">
        <DaownloadPannel siteName={siteName} primaryColor={primaryColor} />
      </section>


      <section id="getstarted">
        <GetStarted />
      </section>

      <section id="cta">
        <FinalCTA siteName={siteName} primaryColor={primaryColor} />
      </section>

      <Footer siteName={siteName} />

    </div>
  );
}

