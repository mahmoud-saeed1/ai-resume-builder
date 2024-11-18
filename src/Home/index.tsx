import { motion } from "framer-motion";
import { ArrowRight, Video } from "lucide-react";
import React from "react";

const LandingPage = React.memo(() => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" },
    tap: { scale: 0.95 },
  };

  return (
    <div className="landing__container">
      {/* Header */}
      {/* <header className="landing__header">
        <div className="landing__header-container">
          <div className="landing__logo">
            Resume<span className="landing__logo-highlight">Builder</span>
          </div>
          <nav className="landing__nav">
            <a href="#features" className="landing__nav-link">Features</a>
            <a href="#templates" className="landing__nav-link">Templates</a>
            <a href="#pricing" className="landing__nav-link">Pricing</a>
            <a href="#contact" className="landing__nav-link">Contact</a>
          </nav>
          <motion.button
            className="landing__header-button"
            variants={buttonVariants}
            whileHover="hover"
          >
            Start Now
          </motion.button>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="landing__hero">
        {/* Background Shape */}
        <div className="landing__hero-shape"></div>
        <div className="landing__hero-container">
          <motion.div
            className="landing__hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="landing__hero-title">
              Build Your <span className="landing__hero-highlight">Professional</span> Resume
            </h1>
            <p className="landing__hero-description">
              Effortlessly create your resume with AI-powered tools and modern templates.
            </p>
            <div className="landing__hero-buttons">
              <motion.button
                className="landing__button-primary"
                variants={buttonVariants}
                whileHover="hover"
              >
                Get Started <ArrowRight className="ml-2" />
              </motion.button>
              <motion.button
                className="landing__button-secondary"
                variants={buttonVariants}
                whileHover="hover"
              >
                Watch Demo <Video className="ml-2" />
              </motion.button>
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
              src="https://via.placeholder.com/400x500"
              alt="Hero Illustration"
              className="landing__hero-img"
            />
            <motion.div
              className="landing__hero-animation"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 45, 0],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            ></motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing__features">
        <div className="landing__features-bg-top"></div>
        <div className="landing__features-bg-bottom"></div>
        <div className="landing__features-container">
          <h2 className="landing__features-title">
            Why Choose <span className="landing__features-highlight">ResumeBuilder?</span>
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

      {/* Footer */}
      <footer className="landing__footer">
        <p>
          © 2024 ResumeBuilder. Built with ❤️ for job seekers worldwide.
        </p>
      </footer>
    </div>
  );
});

export default LandingPage;
