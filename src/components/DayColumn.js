import React, { useState, useEffect } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import ActivityItem from './ActivityItem';
import EmptyDayState from './EmptyDayState';
import { motion, AnimatePresence } from 'framer-motion';

const DayColumn = ({
  day,
  activities,
  dragHandleProps,
  isDragging,
  removeDay,
  editDayTitle,
  openAddActivityModal,
  removeActivity,
  isCurrentDay = false,
  destinationTimeZone = 'UTC'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(day.title);
  const [isHovered, setIsHovered] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [weatherData, setWeatherData] = useState({
    temperature: Math.floor(Math.random() * 15) + 15, // Random temp between 15-30°C
    condition: ['☀️', '⛅', '🌧️', '❄️', '🌪️'][Math.floor(Math.random() * 5)] // Random weather condition
  });

  useEffect(() => {
    if (isCurrentDay) {
      setShowTimeline(true);
      
      // Update current time for the destination timezone
      const updateTime = () => {
        try {
          const options = { timeZone: destinationTimeZone, hour12: false };
          const timeString = new Date().toLocaleTimeString('en-US', options);
          setCurrentTime(timeString);
        } catch (e) {
          const timeString = new Date().toLocaleTimeString();
          setCurrentTime(timeString);
        }
      };
      
      updateTime();
      const timerId = setInterval(updateTime, 60000);
      
      return () => clearInterval(timerId);
    }
  }, [isCurrentDay, destinationTimeZone]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleSubmit = () => {
    editDayTitle(day.id, title);
    setIsEditing(false);
  };

  // Calculate current activity based on time
  const getCurrentActivity = () => {
    if (!currentTime) return null;
    
    const [hours, minutes] = currentTime.split(':');
    const currentHour = parseInt(hours, 10);
    const currentMinute = parseInt(minutes, 10);
    
    return activities.find(activity => {
      if (!activity.time) return false;
      
      const [actHours, actMinutes] = activity.time.split(':').map(Number);
      
      // Within 30 minutes of activity time
      return currentHour === actHours && 
             Math.abs(currentMinute - actMinutes) < 30;
    });
  };
  
  const currentActivity = getCurrentActivity();

  // Animation variants for the day column
  const dayVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.8
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    current: {
      boxShadow: "0 0 0 2px #3B82F6, 0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      y: -5,
    }
  };

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md w-80 flex-shrink-0 ${
        isDragging ? 'shadow-lg' : ''
      } ${isCurrentDay ? 'border-primary-500 border-2' : ''}`}
      variants={dayVariants}
      initial="initial"
      animate={isCurrentDay ? "current" : "animate"}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className="p-4 bg-gray-50 rounded-t-lg border-b flex items-center justify-between relative"
        {...dragHandleProps}
      >
        {isEditing ? (
          <div className="flex w-full items-center">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleSubmit}
              onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {/* Animated grip dots for drag handle */}
            <motion.div 
              className="flex flex-col space-y-1 px-1 py-2 mr-2 opacity-30"
              animate={isHovered ? { opacity: 0.8 } : { opacity: 0.3 }}
            >
              <div className="flex space-x-1">
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
              </div>
              <div className="flex space-x-1">
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
              </div>
              <div className="flex space-x-1">
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
              </div>
            </motion.div>
            
            <h2 
              className="text-lg font-semibold text-gray-800 cursor-pointer" 
              onClick={() => setIsEditing(true)}
            >
              {day.title}
            </h2>
            
            {/* Weather indicator */}
            <AnimatePresence>
              <motion.div 
                className="flex items-center ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <span className="mr-1">{weatherData.condition}</span>
                <span>{weatherData.temperature}°C</span>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        
        <div className="flex space-x-2">
          <motion.button
            onClick={() => openAddActivityModal(day.id)}
            className="text-primary-600 hover:text-primary-800 transition duration-200 bg-primary-50 hover:bg-primary-100 p-2 rounded-full"
            title="Add activity"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
          <motion.button
            onClick={() => removeDay(day.id)}
            className="text-red-500 hover:text-red-700 transition duration-200"
            title="Remove day"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Local time display when it's the current day */}
      {isCurrentDay && (
        <motion.div
          className="bg-primary-50 p-2 text-center text-sm font-medium text-primary-800 border-b border-primary-100"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          Current local time: {currentTime ? currentTime.substring(0, 5) : '--:--'}
        </motion.div>
      )}

      <Droppable droppableId={day.id} type="activity">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`p-2 min-h-[200px] transition-colors duration-200 relative ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
            style={{ maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}
          >
            {activities.length === 0 ? (
              <EmptyDayState onAddActivity={() => openAddActivityModal(day.id)} />
            ) : (
              activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  index={index}
                  removeActivity={(activityId) => removeActivity(activityId, day.id)}
                  isCurrent={currentActivity && currentActivity.id === activity.id}
                />
              ))
            )}
            {provided.placeholder}
            
            {/* Visual time marker */}
            {showTimeline && currentTime && (
              <motion.div
                className="absolute left-0 w-full h-0.5 bg-primary-500 z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{
                  top: `${(parseInt(currentTime.split(':')[0], 10) * 60 + 
                           parseInt(currentTime.split(':')[1], 10)) / 1440 * 100}%`
                }}
              >
                <div className="absolute -top-2 -right-1 w-4 h-4 rounded-full bg-primary-500"></div>
              </motion.div>
            )}
          </div>
        )}
      </Droppable>

      <motion.div 
        className="p-4 border-t"
        animate={{ opacity: 1, height: 'auto' }}
      >
        <motion.button
          onClick={() => openAddActivityModal(day.id)}
          className="w-full py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-md transition duration-200 flex items-center justify-center"
          whileHover={{ 
            scale: 1.02, 
            backgroundColor: "#E0F2FE", 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
          }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-primary-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Add Activity</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default DayColumn; 