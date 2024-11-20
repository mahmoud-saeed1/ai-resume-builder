import React from "react";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";

const LandingPage = React.memo(() => {


  return (
    <section className="landing__container">
      <HeroSection />

      <FeaturesSection />
    </section>
  );
});

export default LandingPage;
