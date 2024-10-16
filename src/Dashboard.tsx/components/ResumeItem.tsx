import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Calendar, User } from "lucide-react";
import { IReusme } from "@/interfaces";

// Framer Motion animation variants for a cleaner, smoother layout
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  hover: { scale: 1.03, transition: { duration: 0.3, ease: "easeInOut" } },
};

const ResumeItem = ({ title,resumeId }: IReusme) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200 transition-all transform hover:shadow-2xl hover:border-blue-300"
    >
      {/* Header Section with Resume Icon */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <FileText className="text-blue-500" size={36} />
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </div>
        <Link to={`/dashboard/resume/${resumeId}/edit`}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Edit Resume
          </motion.button>
        </Link>
      </div>

      {/* Resume Body (example of real-life details) */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <User className="text-gray-400" size={18} />
          <p>John Doe</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="text-gray-400" size={18} />
          <p>Last updated: Sept 28, 2024</p>
        </div>

        {/* Add more details that would resemble a resume summary */}
        <div className="col-span-2 mt-4 text-gray-700">
          <p>
            Experienced software developer skilled in React, TypeScript, and modern web technologies. 
            Adept at creating user-centric web applications with a focus on functionality, design, and accessibility.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeItem;
