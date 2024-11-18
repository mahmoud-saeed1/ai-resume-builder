import Button from "@/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Video } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const LandingPage = React.memo(() => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  return (
    <section className="landing__container">
      {/* Hero Section */}
      <div className="landing__hero">
        {/* Background Shape */}
        <div className="landing__hero-shape" />


        <div className="landing__hero-container">
          <motion.div
            className="landing__hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="landing__hero-title">
              Build Your <span className="landing__hero-highlight">Professional</span> Resume
            </h2>

            <p className="landing__hero-description">
              Effortlessly create your resume with AI-powered tools and modern templates.
            </p>

            <div className="landing__hero-buttons">

              <Button className="py-3 text-lg"><Link to={"/auth/sign-in"}>Get Started</Link> <ArrowRight className="ml-2" /></Button>

              <Button className="text-lg border-gray-300 bg-gray-200 py-3" variant={"outline"} >Watch Demo <Video className="ml-2" /></Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="landing__hero-image"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <img
              src="./ai-resume.svg"
              alt="Hero Illustration"
              className="landing__hero-img"
            />
            <motion.div
              className="landing__hero-animation"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            ><Link to={"/auth/sign-in"} className=""><Plus className="text-white scale-150" /></Link></motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="landing__features">
        <div className="landing__features-bg-top"></div>
        <div className="landing__features-bg-bottom"></div>
        <div className="landing__features-container">
          <h2 className="landing__features-title">
            Why Choose <span className="landing__features-highlight">AI ResumeBuilder?</span>
          </h2>
          <p className="landing__features-subtitle">
            Simplify the resume-building process with these awesome features.
          </p>
          <div className="landing__features-grid">
            {[
              {
                title: "AI-Powered Builder",
                description: "Leverage AI suggestions for crafting the perfect resume.",
                icon: "⚙️",
              },
              {
                title: "Modern Templates",
                description: "Choose from professionally designed, customizable templates.",
                icon: "🎨",
              },
              {
                title: "Responsive Design",
                description: "Your resumes are optimized for both print and digital platforms.",
                icon: "📱",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="landing__feature-card"
                whileHover={{ scale: 1.05 }}
              >
                <span className="landing__feature-icon">{feature.icon}</span>
                <h3 className="landing__feature-title">{feature.title}</h3>
                <p className="landing__feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
});

export default LandingPage;
