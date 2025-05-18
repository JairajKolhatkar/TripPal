import React from 'react';
import Dashboard from '../components/Dashboard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" 
         style={{
           background: "linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%)",
           backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a3bffa' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
         }}>
      {/* Floating Elements */}
      <div className="absolute inset-0" 
           style={{
             backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%234f46e5' fill-opacity='0.05' d='M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,208C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E\")",
             backgroundSize: "cover",
             backgroundPosition: "center bottom",
             zIndex: "0",
             opacity: "0.8"
           }}>
      </div>
      
      {/* Colorful blobs */}
      <div className="absolute top-0 right-0" 
           style={{
             width: "300px",
             height: "300px",
             backgroundImage: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0) 70%)"
           }}>
      </div>
      <div className="absolute bottom-0 left-0" 
           style={{
             width: "400px",
             height: "400px",
             backgroundImage: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, rgba(96,165,250,0) 70%)"
           }}>
      </div>
      
      {/* Floating emojis */}
      <div className="absolute top-1/4 left-1/6 animate-bounce-slow opacity-20 text-4xl">
        ✈️
      </div>
      <div className="absolute top-2/3 right-1/4 animate-pulse opacity-20 text-4xl">
        🏝️
      </div>
      <div className="absolute bottom-1/3 left-1/3 animate-wiggle opacity-20 text-4xl">
        🧳
      </div>
      <div className="absolute top-1/2 right-1/6 animate-float opacity-20 text-4xl">
        🗺️
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">✈️ TripPal</h1>
            </div>
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mr-4"
              >
                <Link 
                  to="/new-trip" 
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Trip</span>
                </Link>
              </motion.div>
              <nav className="flex space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md bg-primary-50 text-primary-700 font-medium">Dashboard</Link>
                <Link to="/itineraries" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Itineraries</Link>
                <Link to="/settings" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Settings</Link>
              </nav>
            </div>
          </div>
        </header>
        
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16 relative overflow-hidden">
          {/* Confetti pattern */}
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
               }}>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to TripPal 🧳
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-6 opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your best pal for planning perfect trips.
            </motion.p>
            <motion.p 
              className="text-lg mb-8 opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Your trip. Your vibe. Your Pal. 🗺️
            </motion.p>
            <motion.div
              className="bg-white text-primary-700 rounded-lg py-3 px-6 inline-block shadow-lg font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              No stress. Just press. Your trip, sorted with TripPal. 🎉
            </motion.div>
          </div>
        </div>
        
        <main className="container mx-auto py-8 px-4 relative">
          {/* Striped diagonal pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 -z-10"
               style={{
                 backgroundImage: "linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 50%, #3b82f6 50%, #3b82f6 75%, transparent 75%, transparent)",
                 backgroundSize: "20px 20px"
               }}>
          </div>
          
          <motion.div 
            className="mb-10 text-center backdrop-blur-sm bg-white/70 p-8 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready for your next adventure? 🏝️</h2>
            <p className="text-gray-600 mb-6">Let TripPal help you organize the perfect journey</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link 
                to="/new-trip" 
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md font-medium"
              >
                <span className="text-xl mr-2">📍</span>
                Start Planning Now
              </Link>
            </motion.div>
          </motion.div>
          
          <div className="backdrop-blur-sm bg-white/70 p-6 rounded-2xl shadow-lg">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
