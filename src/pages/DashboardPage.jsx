import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from '../components/Dashboard';
import ThemeToggle from '../components/ThemeToggle';
import BackgroundSlider from '../components/BackgroundSlider';
import { useTheme } from '../contexts/ThemeContext';
import { useBackground } from '../contexts/BackgroundContext';

const DashboardPage = () => {
  const { isDarkMode } = useTheme();
  const { backgroundImages } = useBackground();
  
  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Dynamic background slider */}
      <BackgroundSlider images={backgroundImages} interval={8000} />
      
      {/* Remove the static background style and patterns */}

      {/* Overlay content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">✈️ TripPal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">Home</Link>
                <Link to="/dashboard" className="px-3 py-2 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">Dashboard</Link>
                <Link to="/itineraries" className="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">Itineraries</Link>
                <Link to="/activities" className="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">Activities</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto py-8 px-4 flex-grow">
          <motion.div 
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Your Trip Dashboard</h1>
            <p className="text-gray-200 mb-8 drop-shadow">Manage and plan all your trips in one place</p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Link 
                to="/new-trip" 
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create New Trip</span>
              </Link>
            </motion.div>
          </motion.div>
          
          <div className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage; 