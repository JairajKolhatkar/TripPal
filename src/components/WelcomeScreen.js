import React from 'react';
import { motion } from 'framer-motion';

const WelcomeScreen = ({ onStart }) => {
  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-b from-primary-50 to-secondary-50 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-center max-w-3xl px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
          Welcome to Your Trip Planner
        </h1>
        
        <div className="mb-8 relative w-full max-w-lg mx-auto rounded-lg overflow-hidden shadow-xl">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2QxYXZndm52ZmF1c3hrOGlsaGN2eHZoMDM0dXFkZzU0NmhyamZiNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l378yMgn5U8gyjug8/giphy.gif" 
            alt="Travel Planning" 
            className="w-full object-cover"
          />
          
          {/* Overlay with SVG decorations */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent">
            <svg 
              className="absolute bottom-0 left-0 w-full" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 1440 320"
            >
              <path 
                fill="#ffffff" 
                fillOpacity="0.3" 
                d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Create and organize your perfect itinerary with our interactive drag-and-drop planner.
          Easily manage activities for each day of your trip!
        </p>
        
        <motion.button
          onClick={onStart}
          className="bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center">
            <span>Start Planning</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 ml-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </div>
        </motion.button>
      </motion.div>
      
      {/* Animated SVG decorations */}
      <motion.div 
        className="absolute top-10 right-10"
        animate={{ 
          y: [0, -10, 0], 
          rotate: [0, 5, 0] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut" 
        }}
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 left-10"
        animate={{ 
          y: [0, 10, 0], 
          rotate: [0, -5, 0] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 4,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.2451 8.90983H21.5106L15.6327 13.1803L17.8779 20.0902L12 15.8197L6.12215 20.0902L8.36729 13.1803L2.48944 8.90983H9.75486L12 2Z" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen; 