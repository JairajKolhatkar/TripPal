import React from 'react';
import { motion } from 'framer-motion';

const Header = ({ addNewDay }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Interactive Itinerary Board
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Drag and drop to organize your trip
          </p>
        </motion.div>
        
        <motion.button
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
          onClick={addNewDay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
          Add Day
        </motion.button>
      </div>
    </header>
  );
};

export default Header; 