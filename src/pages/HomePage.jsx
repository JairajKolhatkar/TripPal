import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import BackgroundSlider from '../components/BackgroundSlider';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { useTheme } from '../contexts/ThemeContext';
import { useBackground } from '../contexts/BackgroundContext';
import api from '../services/api';

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const { backgroundImages } = useBackground();
  const [tripPackages, setTripPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch trip packages from API
  useEffect(() => {
    const fetchTripPackages = async () => {
      try {
        setLoading(true);
        
        // Fetch all trips from API
        const trips = await api.trips.getAllTrips();
        
        // Sort trips by date (same logic as Dashboard)
        const sortedTrips = [...trips].sort((a, b) => {
          const today = new Date();
          const startDateA = new Date(a.startDate);
          const startDateB = new Date(b.startDate);
          
          // Check if trips are upcoming or past
          const aIsUpcoming = startDateA > today;
          const bIsUpcoming = startDateB > today;
          
          // If both are upcoming or both are past, sort by date
          if (aIsUpcoming === bIsUpcoming) {
            // For upcoming trips, sort from closest to furthest
            return aIsUpcoming ? 
              startDateA - startDateB : // Ascending for upcoming trips (closest first)
              startDateB - startDateA;  // Descending for past trips (most recent first)
          }
          
          // If only one is upcoming, place it first
          return aIsUpcoming ? -1 : 1;
        });
        
        // Transform trips to packages format (take first 3 for featured section)
        const packages = sortedTrips.slice(0, 3).map(trip => ({
          id: trip.id,
          destination: trip.title,
          location: trip.location,
          duration: `${trip.dayCount} days`,
          price: 25000 + Math.floor(Math.random() * 30000), // Generate a random price for demo
          image: trip.thumbnail,
          startDate: trip.startDate,
          endDate: trip.endDate
        }));
        
        setTripPackages(packages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trip packages:', err);
        setError('Failed to load featured trips');
        setLoading(false);
      }
    };
    
    fetchTripPackages();
  }, []);

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Dynamic background slider */}
      <BackgroundSlider images={backgroundImages} interval={8000} />
      
      {/* Overlay content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with theme toggle */}
        <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">✈️ TripPal</h1>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-gray-900 dark:text-white font-medium">Home</Link>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">Dashboard</Link>
                <Link to="/activities" className="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">Activities</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        {/* Hero section */}
        <section className="flex-grow flex items-center">
          <div className="container mx-auto px-6 py-16 md:py-24">
            <div className="md:w-2/3 lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-xl"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Plan Your Perfect Trip with TripPal
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                  Your trip. Your vibe. Your Pal. 🗺️
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/dashboard" className="inline-block px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition duration-150 text-center">
                    Get Started
                  </Link>
                  <a href="#features" className="inline-block px-8 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-medium rounded-lg border border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition duration-150 text-center">
                    Learn More
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose TripPal?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to plan the perfect trip, all in one place.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🗓️",
                title: "Drag & Drop Planning",
                description: "Easily organize your days with our intuitive drag-and-drop interface."
              },
              {
                icon: "💰",
                title: "Budget Tracking",
                description: "Keep track of expenses and stay within your travel budget."
              },
              {
                icon: "📍",
                title: "Location Intelligence",
                description: "Optimize your daily routes with smart location grouping."
              },
              {
                icon: "🔔",
                title: "Travel Reminders",
                description: "Never miss a reservation with built-in notifications."
              },
              {
                icon: "📋",
                title: "Travel Templates",
                description: "Start with expertly designed itinerary templates."
              },
              {
                icon: "📱",
                title: "Mobile Access",
                description: "Access your plans anywhere, even without internet."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trip Packages with INR Currency */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Trip Packages</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore our specially curated trips with the best prices.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-md max-w-xl mx-auto">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {tripPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.destination}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{pkg.destination}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">{pkg.location}</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between items-center">
                      <CurrencyDisplay amount={pkg.price} initialCurrency="INR" />
                      <Link to={`/itinerary/${pkg.id}`} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm">
                        View Trip
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary-600 dark:bg-primary-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to start planning your next adventure?</h2>
            <p className="text-xl mb-8 text-primary-100">Your trip. Your vibe. Your Pal. Join thousands of travelers today!</p>
            <Link to="/dashboard" className="inline-block px-8 py-3 bg-white text-primary-600 dark:text-primary-700 font-bold rounded-lg hover:bg-gray-100 transition duration-150">
              Get Started for Free
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">TripPal</h2>
              <p className="text-gray-400">Your trip. Your vibe. Your Pal.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Features</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Pricing</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} TripPal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
