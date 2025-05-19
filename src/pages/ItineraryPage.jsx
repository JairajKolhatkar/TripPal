import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import ItineraryBoard from '../components/ItineraryBoard';
import { motion } from 'framer-motion';
import BackgroundSlider from '../components/BackgroundSlider';
import { useTheme } from '../contexts/ThemeContext';
import { useBackground } from '../contexts/BackgroundContext';
import api from '../services/api';
import NewActivityForm from '../components/NewActivityForm';

const ItineraryPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { backgroundImages } = useBackground();
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [destinationTimeZone, setDestinationTimeZone] = useState('UTC');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [isNewTrip, setIsNewTrip] = useState(false);
  
  // Fetch trip data from API
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        
        // Fetch the trip
        const trip = await api.trips.getTripById(tripId);
        if (!trip) {
          setError(`Trip with ID ${tripId} not found`);
          setLoading(false);
          return;
        }
        
        // Check if this is a new trip (created within the last minute)
        const tripCreationTime = new Date(trip.createdAt);
        const now = new Date();
        const isNew = (now - tripCreationTime) < 60000; // 60000ms = 1 minute
        setIsNewTrip(isNew);
        
        // Set time zone from trip data
        setDestinationTimeZone(trip.timeZone || 'UTC');
        
        // Fetch days for this trip
        const daysData = await api.days.getDaysByTripId(tripId);
        
        // Fetch activities for this trip
        const activitiesData = await api.activities.getActivitiesByTripId(tripId);
        
        // Transform the data into the structure needed by ItineraryBoard
        const days = {};
        const dayOrder = [];
        const activities = {};
        
        // Organize days
        daysData.forEach(day => {
          days[day.id] = {
            id: day.id,
            title: day.title,
            activityIds: day.activityIds || []
          };
          dayOrder.push(day.id);
        });
        
        // Sort dayOrder by date if needed
        dayOrder.sort((a, b) => {
          const dateA = new Date(days[a].date || '');
          const dateB = new Date(days[b].date || '');
          return dateA - dateB;
        });
        
        // Organize activities
        activitiesData.forEach(activity => {
          activities[activity.id] = {
            id: activity.id,
            content: activity.content,
            time: activity.time,
            type: activity.type,
            location: activity.location,
            notes: activity.notes
          };
        });
        
        // Create the final data structure
        setItineraryData({
          ...trip,
          days,
          dayOrder,
          activities
        });
        
        // If this is a new trip, open the Add Activity modal for the first day
        if (isNew && daysData.length > 0) {
          setSelectedDayId(daysData[0].id);
          setIsModalOpen(true);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trip data:', err);
        setError('Failed to load trip data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTripData();
  }, [tripId]);
  
  const handleDragEnd = (result) => {
    // Implement drag handling logic for activities and days
    console.log('Drag ended:', result);
    // In a real app, you would update the state based on the drag result
    // and then save changes to the API
  };
  
  const removeDay = async (dayId) => {
    if (!itineraryData) return;
    
    try {
      // Delete the day from the API
      await api.days.deleteDay(dayId);
      
      // Update local state
      const newDayOrder = itineraryData.dayOrder.filter(id => id !== dayId);
      const newDays = { ...itineraryData.days };
      delete newDays[dayId];
      
      // Update the state
      setItineraryData({
        ...itineraryData,
        days: newDays,
        dayOrder: newDayOrder
      });
    } catch (err) {
      console.error('Error removing day:', err);
      // Handle error (show notification, etc.)
    }
  };
  
  const editDayTitle = async (dayId, newTitle) => {
    if (!itineraryData) return;
    
    try {
      const updatedDay = {
        ...itineraryData.days[dayId],
        title: newTitle
      };
      
      // Update the day in the API
      await api.days.updateDay(dayId, updatedDay);
      
      // Update local state
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
    } catch (err) {
      console.error('Error updating day title:', err);
      // Handle error (show notification, etc.)
    }
  };
  
  const openAddActivityModal = (dayId) => {
    setSelectedDayId(dayId);
    setIsModalOpen(true);
  };
  
  const addActivity = async (activityData) => {
    if (!itineraryData || !selectedDayId) return;
    
    try {
      // Create the new activity
      const newActivity = await api.activities.createActivity({
        ...activityData,
        itineraryId: tripId,
        date: itineraryData.days[selectedDayId].date
      });
      
      // Update the day to include the new activity
      const day = itineraryData.days[selectedDayId];
      const updatedDay = {
        ...day,
        activityIds: [...day.activityIds, newActivity.id]
      };
      
      await api.days.updateDay(selectedDayId, updatedDay);
      
      // Update local state
      setItineraryData({
        ...itineraryData,
        activities: {
          ...itineraryData.activities,
          [newActivity.id]: newActivity
        },
        days: {
          ...itineraryData.days,
          [selectedDayId]: updatedDay
        }
      });
      
      setIsModalOpen(false);
      setSelectedDayId(null);
    } catch (err) {
      console.error('Error adding activity:', err);
      // Handle error (show notification, etc.)
    }
  };
  
  const removeActivity = async (activityId, dayId) => {
    if (!itineraryData) return;
    
    try {
      // First update the day to remove the activity reference
      const day = itineraryData.days[dayId];
      const newActivityIds = day.activityIds.filter(id => id !== activityId);
      
      const updatedDay = {
        ...day,
        activityIds: newActivityIds
      };
      
      await api.days.updateDay(dayId, updatedDay);
      
      // Then delete the activity itself
      await api.activities.deleteActivity(activityId);
      
      // Update local state
      const newActivities = { ...itineraryData.activities };
      delete newActivities[activityId];
      
      setItineraryData({
        ...itineraryData,
        activities: newActivities,
        days: {
          ...itineraryData.days,
          [dayId]: {
            ...day,
            activityIds: newActivityIds
          }
        }
      });
    } catch (err) {
      console.error('Error removing activity:', err);
      // Handle error (show notification, etc.)
    }
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
          ) : error ? (
            <div className="backdrop-blur-sm bg-white/70 p-6 rounded-xl shadow-lg">
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Error</h3>
                <p>{error}</p>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Return to Dashboard
                </button>
              </div>
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

      {isModalOpen && (
        <NewActivityForm
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDayId(null);
          }}
          onAddActivity={addActivity}
        />
      )}
    </div>
  );
};

export default ItineraryPage; 