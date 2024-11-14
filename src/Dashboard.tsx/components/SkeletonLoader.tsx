import { motion } from "framer-motion";

const SkeletonLoader = ({ count = 1 }) => {
  const skeletonVariants = {
    shimmer: {
      x: [0, 100],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1.2,
        },
      },
    },
  };

  return (
    <div className="skeleton-loader__container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-loader">
          <motion.div
            className="skeleton-loader__header"
            variants={skeletonVariants}
            animate="shimmer"
          />
          <motion.div
            className="skeleton-loader__body"
            variants={skeletonVariants}
            animate="shimmer"
          />
          <motion.div
            className="skeleton-loader__footer"
            variants={skeletonVariants}
            animate="shimmer"
          />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
