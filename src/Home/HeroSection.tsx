import Button from "@/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Video } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
};

const HeroSection = () => {
    return (
        <section className="landing__hero">

            {/*~~~~~~~~$ Hero Content $~~~~~~~~*/}
            <div className="landing__hero-container">
                <motion.article
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

                        <Button className="py-3 text-lg"><Link to={"/dashboard"}>Get Started</Link> <ArrowRight className="ml-2" /></Button>

                        <Button className="text-lg border-gray-300 bg-gray-200 py-3" variant={"outline"} >Watch Demo <Video className="ml-2" /></Button>
                    </div>
                </motion.article>

                {/*~~~~~~~~$ Hero Image $~~~~~~~~*/}
                <motion.div
                    className="landing__hero-image__container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="landing__hero-shape " />

                    <div className="landing__hero-image">
                        <img
                            src="./ai-resume.svg"
                            alt="Hero Illustration"
                            className="landing__hero-img"
                        />

                        <motion.div className="landing__hero-animation"
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{ repeat: Infinity, duration: 3 }}><Link to={"/dashboard"}><Plus className="text-white scale-125" /></Link></motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection