import React, { useEffect, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import DayColumn from './DayColumn';
import { motion, AnimatePresence } from 'framer-motion';

const ItineraryBoard = ({ 
  data, 
  removeDay, 
  editDayTitle, 
  openAddActivityModal, 
  removeActivity,
  currentTimeZone = 'local',
  tripStartDate = new Date(),
  destinationTimeZone = 'UTC'
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [history, setHistory] = useState([data]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [timeMarker, setTimeMarker] = useState(null);
  
  // Update time every minute
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timerId);
  }, []);
  
  // Calculate local and destination time
  const getDestinationTime = () => {
    try {
      return new Date().toLocaleTimeString('en-US', {
        timeZone: destinationTimeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return new Date().toLocaleTimeString();
    }
  };
  
  const getLocalTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Undo/Redo functionality
  const addToHistory = (newData) => {
    // Slice off any future states if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    // Add the new state to history
    newHistory.push(newData);
    // Limit history to 20 states to avoid memory issues
    if (newHistory.length > 20) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  
  const undo = () => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1);
      // You would need to implement a way to update your app state with history[historyIndex - 1]
    }
  };
  
  const redo = () => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1);
      // You would need to implement a way to update your app state with history[historyIndex + 1]
    }
  };
  
  // Calculate if activity is current based on the time
  const isCurrentActivity = (activity) => {
    if (!activity.time) return false;
    
    // Very simple implementation - would need to be more sophisticated in a real app
    const [hours, minutes] = activity.time.split(':').map(Number);
    const now = new Date();
    
    return now.getHours() === hours && 
           Math.abs(now.getMinutes() - minutes) < 30; // Within 30 minutes
  };
  
  return (
    <div className="relative">
      {/* Time zone display */}
      <motion.div 
        className="mb-4 flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">🏠 Local:</span>
          <span className="font-medium">{getLocalTime()}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Undo/Redo buttons */}
          <div className="flex space-x-1">
            <motion.button
              onClick={undo}
              disabled={!canUndo}
              className={`p-1 rounded-md ${canUndo ? 'text-primary-600 hover:bg-primary-50' : 'text-gray-300 cursor-not-allowed'}`}
              whileHover={canUndo ? { scale: 1.1 } : {}}
              whileTap={canUndo ? { scale: 0.9 } : {}}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </motion.button>
            
            <motion.button
              onClick={redo}
              disabled={!canRedo}
              className={`p-1 rounded-md ${canRedo ? 'text-primary-600 hover:bg-primary-50' : 'text-gray-300 cursor-not-allowed'}`}
              whileHover={canRedo ? { scale: 1.1 } : {}}
              whileTap={canRedo ? { scale: 0.9 } : {}}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">✈️ Destination:</span>
          <span className="font-medium">{getDestinationTime()}</span>
        </div>
      </motion.div>
    
      <motion.div
        className="flex overflow-x-auto pb-4 space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Droppable 
          droppableId="all-days" 
          direction="horizontal" 
          type="day"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex space-x-4"
            >
              <AnimatePresence>
                {data.dayOrder.map((dayId, index) => {
                  const day = data.days[dayId];
                  const activities = day.activityIds.map(
                    activityId => data.activities[activityId]
                  );

                  // Find if this day has any current activities
                  const hasCurrentActivity = activities.some(isCurrentActivity);

                  return (
                    <Draggable 
                      key={day.id} 
                      draggableId={day.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className={`${
                            snapshot.isDragging ? 'opacity-70' : ''
                          }`}
                        >
                          <DayColumn
                            day={day}
                            activities={activities}
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            removeDay={removeDay}
                            editDayTitle={editDayTitle}
                            openAddActivityModal={openAddActivityModal}
                            removeActivity={removeActivity}
                            isCurrentDay={hasCurrentActivity}
                            destinationTimeZone={destinationTimeZone}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </motion.div>
      
      {/* Visual time marker that shows current time in the schedule */}
      {timeMarker && (
        <motion.div 
          className="absolute left-0 right-0 h-0.5 bg-primary-500 z-10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ top: timeMarker.top }}
        />
      )}
    </div>
  );
};

export default ItineraryBoard; 