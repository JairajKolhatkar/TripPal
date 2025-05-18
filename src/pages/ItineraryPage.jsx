import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import ItineraryBoard from '../components/ItineraryBoard';
import { motion } from 'framer-motion';
import BackgroundSlider from '../components/BackgroundSlider';
import { useTheme } from '../contexts/ThemeContext';
import { useBackground } from '../contexts/BackgroundContext';

const ItineraryPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { backgroundImages } = useBackground();
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [destinationTimeZone, setDestinationTimeZone] = useState('UTC');
  
  // Simulated data loading
  useEffect(() => {
    // In a real app, you would fetch the specific itinerary data based on the ID
    setTimeout(() => {
      setItineraryData({
        id: tripId,
        title: 'Tokyo Adventure',
        startDate: '2023-12-15',
        endDate: '2023-12-25',
        location: 'Tokyo, Japan',
        days: {
          'day-1': {
            id: 'day-1',
            title: 'Day 1 - Arrival',
            activityIds: ['activity-1', 'activity-2', 'activity-3']
          },
          'day-2': {
            id: 'day-2',
            title: 'Day 2 - Exploration',
            activityIds: ['activity-4', 'activity-5']
          },
          'day-3': {
            id: 'day-3',
            title: 'Day 3 - Cultural Day',
            activityIds: ['activity-6', 'activity-7']
          }
        },
        dayOrder: ['day-1', 'day-2', 'day-3'],
        activities: {
          'activity-1': {
            id: 'activity-1',
            content: 'Check-in at Hotel',
            time: '14:00',
            type: 'travel',
            location: 'Tokyo Marriott',
            notes: 'Reservation confirmation: #12345'
          },
          'activity-2': {
            id: 'activity-2',
            content: 'Lunch at Sushi Restaurant',
            time: '12:30',
            type: 'meal',
            location: 'Tsukiji Market',
            notes: 'Try the tuna sashimi'
          },
          'activity-3': {
            id: 'activity-3',
            content: 'Rest at Hotel',
            time: '16:00',
            type: 'leisure',
            location: 'Tokyo Marriott',
            notes: 'Jet lag recovery'
          },
          'activity-4': {
            id: 'activity-4',
            content: 'Visit Tokyo Tower',
            time: '10:00',
            type: 'attraction',
            location: 'Tokyo Tower',
            notes: 'Buy tickets in advance for the observation deck'
          },
          'activity-5': {
            id: 'activity-5',
            content: 'Dinner at Izakaya',
            time: '19:00',
            type: 'meal',
            location: 'Shinjuku area',
            notes: 'Try local beer and yakitori'
          },
          'activity-6': {
            id: 'activity-6',
            content: 'Visit Meiji Shrine',
            time: '09:00',
            type: 'attraction',
            location: 'Meiji Shrine, Shibuya',
            notes: 'Peaceful morning walk through the shrine grounds'
          },
          'activity-7': {
            id: 'activity-7',
            content: 'Shopping in Harajuku',
            time: '13:00',
            type: 'leisure',
            location: 'Takeshita Street, Harajuku',
            notes: 'Check out the fashion boutiques and quirky cafes'
          }
        }
      });
      setDestinationTimeZone('Asia/Tokyo');
      setLoading(false);
    }, 1000);
  }, [tripId]);
  
  const handleDragEnd = (result) => {
    // Implement drag handling logic for activities and days
    console.log('Drag ended:', result);
    // In a real app, you would update the state based on the drag result
  };
  
  const removeDay = (dayId) => {
    if (!itineraryData) return;
    
    const newDayOrder = itineraryData.dayOrder.filter(id => id !== dayId);
    const newDays = { ...itineraryData.days };
    delete newDays[dayId];
    
    // Update the state
    setItineraryData({
      ...itineraryData,
      days: newDays,
      dayOrder: newDayOrder
    });
  };
  
  const editDayTitle = (dayId, newTitle) => {
    if (!itineraryData) return;
    
    setItineraryData({
      ...itineraryData,
      days: {
        ...itineraryData.days,
        [dayId]: {
          ...itineraryData.days[dayId],
          title: newTitle
        }
      }
    });
  };
  
  const openAddActivityModal = (dayId) => {
    // Implement modal opening logic
    console.log('Open activity modal for day:', dayId);
  };
  
  const removeActivity = (activityId, dayId) => {
    if (!itineraryData) return;
    
    const day = itineraryData.days[dayId];
    const newActivityIds = day.activityIds.filter(id => id !== activityId);
    
    setItineraryData({
      ...itineraryData,
      days: {
        ...itineraryData.days,
        [dayId]: {
          ...day,
          activityIds: newActivityIds
        }
      }
    });
  };
  
  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Dynamic background slider */}
      <BackgroundSlider images={backgroundImages} interval={8000} />
      
      <div className="relative z-10">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 mr-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-primary-600">✈️ TripPal</h1>
            </div>
            <nav className="flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Home</Link>
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Dashboard</Link>
              <Link to="/activities" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Activities</Link>
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
              <div className="mb-8 backdrop-blur-sm bg-white/70 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{itineraryData.title}</h1>
                    <p className="text-gray-600">
                      {new Date(itineraryData.startDate).toLocaleDateString()} - {new Date(itineraryData.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">{itineraryData.location}</p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100 font-medium flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </motion.button>
                    <motion.button
                      className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 font-medium flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Day
                    </motion.button>
                  </div>
                </div>
              </div>
              
              <div className="backdrop-blur-sm bg-white/70 p-6 rounded-xl shadow-lg">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <ItineraryBoard
                    data={itineraryData}
                    removeDay={removeDay}
                    editDayTitle={editDayTitle}
                    openAddActivityModal={openAddActivityModal}
                    removeActivity={removeActivity}
                    destinationTimeZone={destinationTimeZone}
                  />
                </DragDropContext>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ItineraryPage; 