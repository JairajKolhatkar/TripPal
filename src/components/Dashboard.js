import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data from API
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const trips = await api.trips.getAllTrips();
        
        // Sort trips by startDate (upcoming trips first, chronologically)
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
        
        setItineraries(sortedTrips);
        setFilteredItineraries(sortedTrips);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load trips. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTrips();
  }, []);
  
  // Filter itineraries based on search term, filter type, and date
  useEffect(() => {
    const filtered = itineraries.filter(itinerary => {
      // Handle both "location" and "destination" fields
      const locationField = itinerary.location || itinerary.destination || '';
      
      const matchesSearch = 
        itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locationField.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesType = filterType === 'all' || itinerary.type === filterType;
      
      const matchesDate = filterDate === 'all' || 
        (filterDate === 'upcoming' && new Date(itinerary.startDate) > new Date()) ||
        (filterDate === 'past' && new Date(itinerary.endDate) < new Date()) ||
        (filterDate === 'active' && new Date(itinerary.startDate) <= new Date() && new Date(itinerary.endDate) >= new Date());
      
      return matchesSearch && matchesType && matchesDate;
    });
    
    // Ensure the filtered results maintain the same sorting as the original trips
    setFilteredItineraries(filtered);
  }, [searchTerm, filterType, filterDate, itineraries]);
  
  // Calculate days until trip with time zone adjustment
  const getDaysUntilTrip = (startDate, timeZone) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const tripStart = new Date(startDate);
    tripStart.setHours(0, 0, 0, 0); // Reset time to start of day
    
    // Time zone adjustment (simplified version)
    try {
      const destinationTime = new Date(new Date().toLocaleString('en-US', {timeZone}));
      const timeDiff = destinationTime.getTime() - today.getTime();
      
      // Adjust trip start by time difference
      const adjustedTripStart = new Date(tripStart.getTime() + timeDiff);
      const diffTime = Math.abs(adjustedTripStart - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (tripStart < today) {
        return 'Past trip';
      }
      
      return diffDays === 0 ? 'Today!' : `${diffDays} days`;
    } catch (e) {
      // Fallback if time zone is invalid
      const diffTime = Math.abs(tripStart - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (tripStart < today) {
        return 'Past trip';
      }
      
      return diffDays === 0 ? 'Today!' : `${diffDays} days`;
    }
  };
  
  // Get current time at destination
  const getDestinationTime = (timeZone) => {
    try {
      return new Date().toLocaleTimeString('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return '--:--';
    }
  };

  // Update mood for a trip
  const updateMood = async (id, newMood) => {
    try {
      // Get the current trip data
      const trip = itineraries.find(itinerary => itinerary.id === id);
      if (!trip) return;
      
      // Update the trip with new mood
      const updatedTrip = { ...trip, mood: newMood };
      
      // Save to API
      await api.trips.updateTrip(id, updatedTrip);
      
      // Update local state
      const updatedItineraries = itineraries.map(itinerary => 
        itinerary.id === id ? updatedTrip : itinerary
      );
      setItineraries(updatedItineraries);
      
      // Update filtered itineraries as well
      setFilteredItineraries(prevFiltered => 
        prevFiltered.map(itinerary => 
          itinerary.id === id ? updatedTrip : itinerary
        )
      );
    } catch (err) {
      console.error('Error updating trip mood:', err);
    }
  };

  // Delete trip
  const deleteTrip = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        // Delete the trip from the API
        await api.trips.deleteTrip(id);
        
        // Update local state
        const updatedItineraries = itineraries.filter(itinerary => itinerary.id !== id);
        setItineraries(updatedItineraries);
        setFilteredItineraries(updatedItineraries);
      } catch (err) {
        console.error('Error deleting trip:', err);
        alert('Failed to delete trip. Please try again.');
      }
    }
  };
  
  // Mood options for the selector
  const moodOptions = ['😄', '😊', '🤩', '😍', '🧘', '❤️', '🤝', '😴', '🏖️', '🗺️', '🌄', '🌃'];
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Your Itineraries</h1>
        <p className="text-gray-600">View and manage all your travel plans in one place</p>
      </motion.div>
      
      {/* Search and filters */}
      <motion.div 
        className="mb-8 bg-white p-4 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search trips by name or location..."
                className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="min-w-[150px]">
            <select
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="leisure">Leisure</option>
              <option value="business">Business</option>
              <option value="romantic">Romantic</option>
              <option value="cultural">Cultural</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>
          
          <div className="min-w-[150px]">
            <select
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="past">Past</option>
            </select>
          </div>
          
          <div className="min-w-[120px]">
            <motion.button
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/new-trip')}
            >
              <div className="flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Trip</span>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Itinerary grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItineraries.length > 0 ? (
          filteredItineraries.map((itinerary, index) => (
            <motion.div
              key={itinerary.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={itinerary.thumbnail} 
                  alt={itinerary.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{itinerary.title}</h3>
                    <div className="flex items-center space-x-2">
                      <select
                        value={itinerary.mood || '😄'}
                        onChange={(e) => updateMood(itinerary.id, e.target.value)}
                        className="text-lg bg-transparent border-none focus:ring-0"
                      >
                        {moodOptions.map(mood => (
                          <option key={mood} value={mood}>{mood}</option>
                        ))}
                      </select>
                      <span className="text-sm text-gray-600 flex items-center">
                        <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {itinerary.location || itinerary.destination}
                      </span>
                      <button
                        onClick={() => deleteTrip(itinerary.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Trip"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Replace Trip countdown indicator with CountdownTimer */}
                <div className="absolute top-0 right-0 bg-primary-600 text-white text-sm px-3 py-1 m-2 rounded-full">
                  <CountdownTimer 
                    startDate={itinerary.startDate}
                    timeZone={itinerary.timeZone}
                  />
                </div>
                
                {/* Weather and mood indicators */}
                <div className="absolute top-0 left-0 flex gap-1 m-2">
                  <span className="bg-white/90 p-1 rounded-full text-lg" title="Weather forecast">
                    {itinerary.weather}
                  </span>
                  <button 
                    className="bg-white/90 p-1 rounded-full text-lg group relative"
                    title="Trip mood"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {itinerary.mood}
                    
                    {/* Mood selector dropdown */}
                    <div className="absolute top-full left-0 mt-1 hidden group-hover:grid grid-cols-4 gap-1 bg-white p-2 rounded-lg shadow-lg z-10">
                      {moodOptions.map(mood => (
                        <button 
                          key={mood} 
                          className="text-xl p-1 hover:bg-gray-100 rounded transition-colors"
                          onClick={() => updateMood(itinerary.id, mood)}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>{new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}</span>
                  <span>{itinerary.dayCount} days</span>
                </div>
                
                {/* Add prominent countdown */}
                {new Date(itinerary.startDate) > new Date() && (
                  <div className="mb-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 text-center">
                    <div className="text-primary-600 dark:text-primary-400 font-medium mb-1">Trip starts in:</div>
                    <div className="flex justify-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="text-xl font-bold text-primary-700 dark:text-primary-300">
                          <CountdownTimer 
                            startDate={itinerary.startDate}
                            timeZone={itinerary.timeZone}
                            showDetailed={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Destination time */}
                <div className="mb-3 text-sm">
                  <span className="text-gray-600">Local time: </span>
                  <span className="font-medium">{getDestinationTime(itinerary.timeZone)}</span>
                </div>
                
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Planning progress</span>
                    <span className="font-medium">{itinerary.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${itinerary.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  <Link 
                    to={`/itinerary/${itinerary.id}`} 
                    className="text-center py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
                  >
                    Edit
                  </Link>
                  <button className="py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    Share
                  </button>
                  <motion.button 
                    className="py-2 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/activities?tripId=${itinerary.id}`)}
                  >
                    Explore
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="text-xl font-medium mb-1">No itineraries found</h3>
            <p>Try adjusting your search or create a new trip</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 