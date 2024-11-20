import { motion } from "framer-motion";


const FeaturesSection = () => {
    return (
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
    )
}

export default FeaturesSection