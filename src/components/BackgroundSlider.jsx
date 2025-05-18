import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundSlider = ({ images, interval = 10000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50 dark:opacity-70"></div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BackgroundSlider; 