import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';

const ActivityItem = ({ activity, index, removeActivity, isCurrent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Activity type icons
  const typeIcons = {
    meal: '🍽️',
    attraction: '🏛️',
    leisure: '🏖️',
    travel: '✈️',
    other: '📌'
  };
  
  const typeColors = {
    meal: 'bg-amber-100 border-amber-200 text-amber-800',
    attraction: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    leisure: 'bg-sky-100 border-sky-200 text-sky-800',
    travel: 'bg-violet-100 border-violet-200 text-violet-800',
    other: 'bg-gray-100 border-gray-200 text-gray-800'
  };
  
  const handleRemove = (e) => {
    e.stopPropagation();
    removeActivity(activity.id);
  };
  
  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Format activity time to show AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    
    let [hours, minutes] = timeStr.split(':');
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${hours}:${minutes} ${ampm}`;
  };
  
  return (
    <Draggable draggableId={activity.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 rounded-md border p-3 itinerary-item ${
            snapshot.isDragging ? 'item-dragging' : ''
          } ${typeColors[activity.type] || 'bg-gray-100'} ${
            isCurrent ? 'ring-2 ring-primary-500 ring-offset-2' : ''
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          onClick={toggleExpand}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-2">
              <div className={`flex-shrink-0 ${
                isCurrent ? 'animate-pulse text-xl' : 'text-lg'
              }`}>
                {typeIcons[activity.type] || '📌'}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">{activity.content}</h3>
                
                <div className="flex space-x-2 mt-1 text-sm">
                  {activity.time && (
                    <div className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatTime(activity.time)}</span>
                    </div>
                  )}
                  
                  {activity.location && (
                    <div className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{activity.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <motion.button
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                onClick={toggleMenu}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </motion.button>
              
              {isMenuOpen && (
                <motion.div 
                  className="absolute right-0 top-8 z-10 bg-white rounded-md shadow-lg py-1 min-w-[140px]"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      // View details action (e.g., open a modal)
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                  
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit action
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Duplicate action
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Duplicate
                  </button>
                  
                  <div className="border-t my-1"></div>
                  
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center"
                    onClick={handleRemove}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Expanded content */}
          {isExpanded && activity.notes && (
            <motion.div
              className="mt-3 pt-3 border-t border-gray-200/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <p className="text-sm">{activity.notes}</p>
              
              {activity.expenses && activity.expenses.length > 0 && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Expenses: </span>
                  {activity.expenses.map((expense, i) => (
                    <span key={i} className="inline-flex items-center mr-2">
                      {expense.currency} {expense.amount}
                      {i < activity.expenses.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          
          {/* Current activity indicator */}
          {isCurrent && (
            <motion.div 
              className="absolute -left-2 -top-2 w-4 h-4 bg-primary-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            />
          )}
        </motion.div>
      )}
    </Draggable>
  );
};

export default ActivityItem; 