import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ActivitiesPage = () => {
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
          content: 'Check-in at Hotel',
          time: '14:00',
          date: '2023-12-15',
          type: 'travel',
          location: 'Tokyo Marriott',
          itineraryTitle: 'Tokyo Adventure',
          itineraryId: 'trip-1',
          notes: 'Reservation confirmation: #12345'
        },
        {
          id: 'activity-2',
          content: 'Lunch at Sushi Restaurant',
          time: '12:30',
          date: '2023-12-15',
          type: 'meal',
          location: 'Tsukiji Market',
          itineraryTitle: 'Tokyo Adventure',
          itineraryId: 'trip-1',
          notes: 'Try the tuna sashimi'
        },
        {
          id: 'activity-3',
          content: 'Visit the Eiffel Tower',
          time: '10:00',
          date: '2024-02-11',
          type: 'attraction',
          location: 'Eiffel Tower, Paris',
          itineraryTitle: 'Paris Weekend',
          itineraryId: 'trip-2',
          notes: 'Buy tickets in advance to avoid lines'
        },
        {
          id: 'activity-4',
          content: 'Business Meeting',
          time: '14:00',
          date: '2024-01-06',
          type: 'business',
          location: 'Manhattan Office',
          itineraryTitle: 'Business in NYC',
          itineraryId: 'trip-3',
          notes: 'Prepare presentation for clients'
        },
        {
          id: 'activity-5',
          content: 'Cooking Class',
          time: '16:00',
          date: '2024-03-22',
          type: 'leisure',
          location: 'Ubud, Bali',
          itineraryTitle: 'Bali Retreat',
          itineraryId: 'trip-4',
          notes: 'Learn to make traditional Balinese dishes'
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary-600">✈️ TripPal</h1>
          <nav className="flex space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Dashboard</Link>
            <Link to="/itineraries" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Itineraries</Link>
            <Link to="/activities" className="px-3 py-2 rounded-md bg-primary-50 text-primary-700 font-medium">Activities</Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">All Activities</h1>
          <p className="text-gray-600">View and manage your activities across all itineraries</p>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
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
                  className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="min-w-[200px]">
              <select
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              <div className="bg-white rounded-lg p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium mb-1">No activities found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-8">
                {sortedDates.map(date => (
                  <div key={date} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                      <h2 className="text-lg font-semibold text-gray-800">{formatDate(date)}</h2>
                    </div>
                    
                    <div className="divide-y">
                      <AnimatePresence>
                        {groupedActivities[date].map(activity => (
                          <motion.div 
                            key={activity.id}
                            className="p-6 hover:bg-gray-50 transition-colors"
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
                                    <h3 className="text-lg font-medium text-gray-900">{activity.content}</h3>
                                    <p className="text-gray-600">{activity.location}</p>
                                  </div>
                                  
                                  <div className="text-right">
                                    <p className="text-lg font-medium">{activity.time}</p>
                                    <Link 
                                      to={`/itinerary/${activity.itineraryId}`}
                                      className="text-primary-600 hover:underline text-sm"
                                    >
                                      {activity.itineraryTitle}
                                    </Link>
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