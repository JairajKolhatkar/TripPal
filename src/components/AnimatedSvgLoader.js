import React from 'react';
import { motion } from 'framer-motion';

// SVG animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { scale: 0, opacity: 0 },
  show: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.8
    }
  }
};

// Animated path for the circle
const circlePath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.2 }
    }
  }
};

const AnimatedSvgLoader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        {/* Main animated SVG */}
        <motion.svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          initial="hidden"
          animate="show"
          variants={container}
        >
          {/* Background circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            stroke="#E0F2FE"
            strokeWidth="10"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Animated loading arc */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            stroke="#0EA5E9"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            initial="hidden"
            animate="visible"
            variants={circlePath}
            style={{ rotate: -90 }}
            strokeDasharray="502"
            strokeDashoffset="502"
          />
          
          {/* Center icon elements */}
          <motion.g variants={item}>
            <motion.path
              d="M80 100H120"
              stroke="#0EA5E9"
              strokeWidth="8"
              strokeLinecap="round"
              animate={{ 
                rotate: [0, 180, 180, 0],
                scale: [1, 1.2, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              style={{ originX: "100px", originY: "100px" }}
            />
            <motion.path
              d="M100 80V120"
              stroke="#0EA5E9"
              strokeWidth="8"
              strokeLinecap="round"
              animate={{ 
                rotate: [0, 180, 180, 0],
                scale: [1, 1.2, 1.2, 1],
                opacity: [1, 0.7, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                delay: 0.5
              }}
              style={{ originX: "100px", originY: "100px" }}
            />
          </motion.g>
        </motion.svg>
        
        {/* Decorative elements */}
        <motion.div
          className="absolute -top-6 -right-6"
          animate={{ 
            y: [0, -10, 0], 
            rotate: [0, 10, 0] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut" 
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.2451 8.90983H21.5106L15.6327 13.1803L17.8779 20.0902L12 15.8197L6.12215 20.0902L8.36729 13.1803L2.48944 8.90983H9.75486L12 2Z" fill="#7C3AED" />
          </svg>
        </motion.div>
        
        <motion.div
          className="absolute -bottom-6 -left-6"
          animate={{ 
            y: [0, 10, 0], 
            rotate: [0, -10, 0] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#0EA5E9" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedSvgLoader; 