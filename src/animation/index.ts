import { Variants } from "framer-motion";

export const VErrorMessage: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
};

export const Vsummary: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 50 },
  },
  hover: {
    scale: 1.02,
    backgroundColor: "#f0f0f0",
    transition: { duration: 0.2 },
  },
};

export const VForm = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};