import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import BackgroundSlider from '../components/BackgroundSlider';
import { useTheme } from '../contexts/ThemeContext';
import { useBackground } from '../contexts/BackgroundContext';

const ActivitiesPage = () => {
  const { isDarkMode } = useTheme();
  const { backgroundImages } = useBackground();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample activity data
  useEffect(() => {
    setTimeout(() => {
      setActivities([
        {
          id: 'activity-1',
          content: 'Check-in at Casa Britona Resort',
          time: '14:00',
          date: '2024-04-05',
          type: 'travel',
          location: 'Bardez, Goa',
          itineraryTitle: 'Goa Beach Vacation',
          itineraryId: 'trip-1',
          notes: 'Reservation confirmation: #GOA24589'
        },
        {
          id: 'activity-2',
          content: 'Beach Day at Calangute',
          time: '10:00',
          date: '2024-04-06',
          type: 'leisure',
          location: 'Calangute Beach, Goa',
          itineraryTitle: 'Goa Beach Vacation',
          itineraryId: 'trip-1',
          notes: 'Bring sunscreen and beach towels'
        },
        {
          id: 'activity-3',
          content: 'Visit Amber Fort',
          time: '09:00',
          date: '2024-10-16',
          type: 'attraction',
          location: 'Amber Fort, Jaipur',
          itineraryTitle: 'Rajasthan Heritage Tour',
          itineraryId: 'trip-2',
          notes: 'Hire a local guide, bring camera'
        },
        {
          id: 'activity-4',
          content: 'Tech Conference Presentation',
          time: '10:30',
          date: '2024-07-14',
          type: 'business',
          location: 'Dubai World Trade Centre',
          itineraryTitle: 'Business in Dubai',
          itineraryId: 'trip-3',
          notes: 'Final presentation slides review'
        },
        {
          id: 'activity-5',
          content: 'Houseboat Tour',
          time: '09:00',
          date: '2024-12-22',
          type: 'leisure',
          location: 'Alleppey, Kerala',
          itineraryTitle: 'Kerala Backwaters',
          itineraryId: 'trip-4',
          notes: 'Overnight stay on traditional houseboat'
        },
        {
          id: 'activity-6',
          content: 'Opening Ceremony Tickets',
          time: '18:00',
          date: '2025-02-10',
          type: 'attraction',
          location: 'Olympic Stadium, Tokyo',
          itineraryTitle: 'Tokyo Olympics 2025',
          itineraryId: 'trip-5',
          notes: 'Need to book tickets 6 months in advance'
        },
        {
          id: 'activity-7',
          content: 'Trek to Triund',
          time: '07:00',
          date: '2025-05-14',
          type: 'adventure',
          location: 'Dharamshala, Himachal Pradesh',
          itineraryTitle: 'Himalayan Trek',
          itineraryId: 'trip-6',
          notes: 'Moderate difficulty, 6 hours approx.'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
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
    other: '📌'
  };
  
  const typeColors = {
    meal: 'bg-amber-100 border-amber-200 text-amber-800',
    attraction: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    leisure: 'bg-sky-100 border-sky-200 text-sky-800',
    travel: 'bg-violet-100 border-violet-200 text-violet-800',
    business: 'bg-gray-100 border-gray-200 text-gray-800',
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
          <h1 className="text-3xl font-bold text-white drop-shadow-md mb-2">All Activities</h1>
          <p className="text-gray-200 drop-shadow">View and manage your activities across all itineraries</p>
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
            
            <div className="min-w-[200px]">
              <select
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Activity Types</option>
                <option value="meal">Meals</option>
                <option value="attraction">Attractions</option>
                <option value="leisure">Leisure</option>
                <option value="travel">Travel</option>
                <option value="business">Business</option>
              </select>
            </div>
            
            <div className="min-w-[120px]">
              <motion.button
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Activity</span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Activities list */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {filteredActivities.length === 0 ? (
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium mb-1 dark:text-white">No activities found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-8">
                {sortedDates.map(date => (
                  <div key={date} className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{formatDate(date)}</h2>
                    </div>
                    
                    <div className="divide-y dark:divide-gray-700">
                      <AnimatePresence>
                        {groupedActivities[date].map(activity => (
                          <motion.div 
                            key={activity.id}
                            className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 rounded-full p-3 mr-4 ${typeColors[activity.type] || 'bg-gray-100'}`}>
                                <span className="text-2xl">{typeIcons[activity.type] || '📌'}</span>
                              </div>
                              
                              <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{activity.content}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{activity.location}</p>
                                  </div>
                                  
                                  <div className="text-right">
                                    <p className="text-lg font-medium dark:text-white">{activity.time}</p>
                                    <Link 
                                      to={`/itinerary/${activity.itineraryId}`}
                                      className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                                    >
                                      {activity.itineraryTitle}
                                    </Link>
                                    
                                    {/* Add countdown timer for future activities */}
                                    {new Date(`${activity.date}T${activity.time}`) > new Date() && (
                                      <div className="mt-1 bg-primary-50 dark:bg-primary-900/20 rounded-md px-2 py-1">
                                        <CountdownTimer 
                                          startDate={`${activity.date}T${activity.time}`}
                                          timeZone="local"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {activity.notes && (
                                  <p className="mt-2 text-gray-600 text-sm">{activity.notes}</p>
                                )}
                                
                                <div className="mt-4 flex justify-end space-x-2">
                                  <Link 
                                    to={`/activity/${activity.id}/edit`}
                                    className="text-primary-600 hover:text-primary-800 px-3 py-1 rounded-md border border-primary-200 text-sm"
                                  >
                                    Edit
                                  </Link>
                                  <Link 
                                    to={`/activity/${activity.id}`}
                                    className="text-primary-600 hover:text-primary-800 px-3 py-1 rounded-md border border-primary-200 text-sm"
                                  >
                                    Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ActivitiesPage; 