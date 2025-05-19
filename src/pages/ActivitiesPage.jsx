import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import BackgroundSlider from '../components/BackgroundSlider';
import { useTheme } from '../contexts/ThemeContext';
import { useBackground } from '../contexts/BackgroundContext';
import api from '../services/api';

const ActivitiesPage = () => {
  const { isDarkMode } = useTheme();
  const { backgroundImages } = useBackground();
  const location = useLocation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tripInfo, setTripInfo] = useState(null);
  
  // Get tripId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const tripId = queryParams.get('tripId');
  
  // Fetch activities and trip info from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // If tripId is provided, fetch trip info
        if (tripId) {
          const trip = await api.trips.getTripById(tripId);
          setTripInfo(trip);
        }
        
        // Fetch activities
        const activitiesData = tripId 
          ? await api.activities.getActivitiesByTripId(tripId)
          : await api.activities.getAllActivities();
          
        setActivities(activitiesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tripId]);
  
  // Filter activities based on type and search term
  const filteredActivities = activities.filter(activity => {
    const matchesType = filter === 'all' || activity.type === filter;
    const matchesSearch = activity.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.itineraryTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });
  
  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});
  
  // Sort dates
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => 
    new Date(a) - new Date(b)
  );
  
  // Activity type icons
  const typeIcons = {
    meal: '🍽️',
    attraction: '🏛️',
    leisure: '🏖️',
    travel: '✈️',
    business: '🤝',
    adventure: '🏔️',
    other: '📌'
  };
  
  const typeColors = {
    meal: 'bg-amber-100 border-amber-200 text-amber-800',
    attraction: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    leisure: 'bg-sky-100 border-sky-200 text-sky-800',
    travel: 'bg-violet-100 border-violet-200 text-violet-800',
    business: 'bg-gray-100 border-gray-200 text-gray-800',
    adventure: 'bg-pink-100 border-pink-200 text-pink-800',
    other: 'bg-gray-100 border-gray-200 text-gray-800'
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Dynamic background slider */}
      <BackgroundSlider images={backgroundImages} interval={8000} />
      
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">✈️ TripPal</h1>
          <nav className="flex space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">Home</Link>
            <Link to="/dashboard" className="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">Dashboard</Link>
            <Link to="/itineraries" className="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">Itineraries</Link>
            <Link to="/activities" className="px-3 py-2 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">Activities</Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-md mb-2">
            {tripInfo ? `${tripInfo.title} Activities` : 'All Activities'}
          </h1>
          <p className="text-gray-200 drop-shadow">
            {tripInfo 
              ? `View and manage activities for your ${tripInfo.title} trip`
              : 'View and manage your activities across all itineraries'}
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg shadow-sm mb-6">
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
                  placeholder="Search activities by name, location or trip..."
                  className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="min-w-[150px]">
              <select
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="meal">Meals</option>
                <option value="attraction">Attractions</option>
                <option value="leisure">Leisure</option>
                <option value="travel">Travel</option>
                <option value="business">Business</option>
                <option value="adventure">Adventure</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Activities List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No activities found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date} className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(date)}</h2>
                </div>
                
                <div className="divide-y dark:divide-gray-700">
                  {groupedActivities[date].map(activity => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg ${typeColors[activity.type]}`}>
                            <span className="text-2xl">{typeIcons[activity.type]}</span>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{activity.content}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{activity.location}</p>
                            
                            {activity.notes && (
                              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{activity.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-medium dark:text-white">{activity.time}</p>
                          {!tripId && (
                            <Link 
                              to={`/itinerary/${activity.itineraryId}`}
                              className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                            >
                              {activity.itineraryTitle}
                            </Link>
                          )}
                          
                          {/* Add countdown timer for future activities */}
                          {new Date(`${activity.date}T${activity.time}`) > new Date() && (
                            <div className="mt-1 bg-primary-50 dark:bg-primary-900/20 rounded-md px-2 py-1">
                              <CountdownTimer 
                                startDate={`${activity.date}T${activity.time}`}
                                timeZone={tripInfo?.timeZone || "local"}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ActivitiesPage; 