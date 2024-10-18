import { motion } from "framer-motion";
import "../../index.css";

const Skeleton = () => {
  return (
    <div className="skeleton">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="skeleton-item"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.2 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export default Skeleton;
