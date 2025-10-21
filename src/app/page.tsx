import About from "@/components/custom/About";
import Footer from "@/components/custom/Footer";
import HeroPage from "@/components/custom/HeroPage";
import React from "react";

const LandingPage = () => {
  return (
    <main className="p-5 space-y-6">
      <HeroPage />
      <About />
      <Footer />
    </main>
  );
};

export default LandingPage;
