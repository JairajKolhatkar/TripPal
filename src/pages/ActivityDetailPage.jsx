import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ActivityDetailPanel from '../components/ActivityDetailPanel';

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Simulated data loading
  useEffect(() => {
    // In a real app, you would fetch the specific activity data based on the ID
    setTimeout(() => {
      const sampleActivity = {
        id: id,
        content: 'Visit Tokyo Tower',
        time: '10:00',
        date: '2023-12-16',
        type: 'attraction',
        location: 'Tokyo Tower, Minato City',
        notes: 'Buy tickets in advance for the observation deck for the best views of the city. Opening hours: 9:00 AM - 11:00 PM.',
        itineraryTitle: 'Tokyo Adventure',
        itineraryId: 'trip-1',
        expenses: [
          { id: 'exp-1', amount: '1000', currency: 'JPY', description: 'Entrance fee' },
          { id: 'exp-2', amount: '500', currency: 'JPY', description: 'Souvenir' }
        ],
        reminders: [
          { id: 'rem-1', time: '09:00', message: 'Prepare to leave hotel', isActive: true },
          { id: 'rem-2', time: '09:30', message: 'Take subway to Tokyo Tower', isActive: true }
        ],
        attachments: [],
        coordinates: { lat: 35.6586, lng: 139.7454 },
        weather: '☀️',
        duration: 120, // minutes
        category: 'Must See'
      };
      
      setActivity(sampleActivity);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  const handleUpdate = (updatedActivity) => {
    // In a real app, you would save the updated activity data
    console.log('Updated activity:', updatedActivity);
    setActivity(updatedActivity);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    // In a real app, you would delete the activity
    console.log('Deleting activity:', id);
    navigate('/activities');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/activities" className="text-gray-600 hover:text-gray-900 mr-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-primary-600">✈️ TripPal</h1>
          </div>
          <nav className="flex space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Dashboard</Link>
            <Link to="/itineraries" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Itineraries</Link>
            <Link to="/activities" className="px-3 py-2 rounded-md bg-primary-50 text-primary-700 font-medium">Activities</Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className={`
                      rounded-full p-3 mr-4 
                      ${activity.type === 'meal' ? 'bg-amber-100 text-amber-800' : 
                        activity.type === 'attraction' ? 'bg-emerald-100 text-emerald-800' :
                        activity.type === 'leisure' ? 'bg-sky-100 text-sky-800' :
                        activity.type === 'travel' ? 'bg-violet-100 text-violet-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      <span className="text-2xl">
                        {activity.type === 'meal' ? '🍽️' : 
                          activity.type === 'attraction' ? '🏛️' :
                          activity.type === 'leisure' ? '🏖️' :
                          activity.type === 'travel' ? '✈️' : '📌'}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">{activity.content}</h1>
                      <div className="flex items-center text-gray-600 mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                        
                        <svg className="w-4 h-4 ml-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{activity.time}</span>
                        
                        {activity.duration && (
                          <span className="ml-2 text-sm bg-gray-100 px-2 py-0.5 rounded">
                            {Math.floor(activity.duration / 60)}h {activity.duration % 60}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <motion.button
                      className="mr-2 px-4 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100 font-medium flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsEditing(true)}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </motion.button>
                    
                    <motion.button
                      className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDelete}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </motion.button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-gray-900">Location</h3>
                      <p className="text-gray-600">{activity.location}</p>
                      
                      {activity.coordinates && (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${activity.coordinates.lat},${activity.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline text-sm flex items-center mt-1"
                        >
                          <span>View on Google Maps</span>
                          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {activity.notes && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                    <p className="text-gray-600">{activity.notes}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Expenses */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Expenses</h3>
                    {activity.expenses.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No expenses added</p>
                    ) : (
                      <div className="space-y-2">
                        {activity.expenses.map(expense => (
                          <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">
                                {expense.currency === 'USD' ? '$' : 
                                 expense.currency === 'EUR' ? '€' : 
                                 expense.currency === 'GBP' ? '£' : 
                                 expense.currency === 'JPY' ? '¥' : ''}{expense.amount} {expense.currency}
                              </div>
                              <div className="text-sm text-gray-600">{expense.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Reminders */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Reminders</h3>
                    {activity.reminders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No reminders set</p>
                    ) : (
                      <div className="space-y-2">
                        {activity.reminders.map(reminder => (
                          <div 
                            key={reminder.id} 
                            className={`flex justify-between items-center p-3 rounded-lg ${
                              reminder.isActive ? 'bg-primary-50 border border-primary-100' : 'bg-gray-50 border border-gray-100'
                            }`}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={reminder.isActive}
                                onChange={() => {
                                  // Toggle reminder in a real app
                                }}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3"
                              />
                              <div>
                                <div className={reminder.isActive ? "font-medium text-gray-900" : "font-medium text-gray-500 line-through"}>
                                  {reminder.time}
                                </div>
                                <div className={reminder.isActive ? "text-sm text-gray-600" : "text-sm text-gray-400 line-through"}>
                                  {reminder.message}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/itinerary/${activity.itineraryId}`}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                        </svg>
                        <span>View in "{activity.itineraryTitle}" Itinerary</span>
                      </div>
                    </Link>
                    
                    <div className="text-gray-600 flex items-center">
                      <span className="mr-1">Weather forecast:</span>
                      <span className="text-xl">{activity.weather}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      
      {isEditing && activity && (
        <ActivityDetailPanel 
          activity={activity}
          onClose={() => setIsEditing(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ActivityDetailPage; 