import React from 'react';
import { motion } from 'framer-motion';

const EmptyDayState = ({ onAddActivity }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-10 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-40 h-40 mb-4 relative">
        <img 
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWhydmJoNmpnYnpyZmt5Y3FsYWh1bmU4ZnYyMmt2YnYya3dyYzFzciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBit7YomT80d0M8/giphy.gif" 
          alt="Add activities" 
          className="w-full h-full object-cover rounded-full"
        />
        
        {/* SVG decorative elements */}
        <motion.svg 
          className="absolute -top-4 -right-4 text-primary-500"
          width="30" 
          height="30" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#0EA5E9" />
        </motion.svg>
        
        <motion.svg 
          className="absolute -bottom-2 -left-2 text-secondary-500"
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          animate={{ 
            rotate: [0, -15, 0, 15, 0],
            scale: [1, 1.2, 1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <circle cx="12" cy="12" r="10" fill="#7C3AED" />
          <path d="M12 17V11" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="8" r="1" fill="white" />
        </motion.svg>
      </div>

      <h3 className="text-xl font-medium text-gray-700 mb-2">No Activities Yet</h3>
      <p className="text-gray-500 mb-6 max-w-xs">
        Start adding activities to plan your perfect day!
      </p>
      
      <motion.button
        onClick={onAddActivity}
        className="py-2 px-4 bg-primary-500 text-white rounded-lg flex items-center shadow-md"
        whileHover={{ scale: 1.05, backgroundColor: "#0284c7" }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
            clipRule="evenodd" 
          />
        </svg>
        Add Activity
      </motion.button>
    </motion.div>
  );
};

export default EmptyDayState; 