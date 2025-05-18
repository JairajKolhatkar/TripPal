import React, { useState } from 'react';
import { motion } from 'framer-motion';

const activityTypes = [
  { 
    id: 'meal', 
    label: 'Meal', 
    color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 1.007.07 1.532.249 1.912.13.36.302.634.504.826.156.148.34.256.52.317.182.061.36.091.515.091h4.425c.156 0 .334-.03.516-.09.18-.062.363-.17.52-.318.202-.192.373-.466.504-.826.178-.38.248-.905.248-1.912 0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V5z" clipRule="evenodd" />
      </svg>
    ) 
  },
  { 
    id: 'attraction', 
    label: 'Attraction', 
    color: 'bg-blue-100 border-blue-500 text-blue-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    )
  },
  { 
    id: 'leisure', 
    label: 'Leisure', 
    color: 'bg-green-100 border-green-500 text-green-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
    )
  },
  { 
    id: 'travel', 
    label: 'Travel', 
    color: 'bg-red-100 border-red-500 text-red-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a2.5 2.5 0 014.9 0H17a1 1 0 001-1v-5.99c0-.53-.21-1.04-.59-1.41l-4-4C13 3.2 12.48 3 12 3H4a1 1 0 00-1 1z" />
      </svg>
    )
  },
  { 
    id: 'other', 
    label: 'Other', 
    color: 'bg-gray-100 border-gray-500 text-gray-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    )
  },
];

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 1
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  }
};

const NewActivityForm = ({ onClose, onAddActivity }) => {
  const [formData, setFormData] = useState({
    content: '',
    time: '',
    type: 'attraction',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;
    
    onAddActivity({
      content: formData.content,
      time: formData.time,
      type: formData.type,
    });
  };

  // Get the icon for the selected activity type
  const selectedIcon = activityTypes.find(type => type.id === formData.type)?.icon;

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        variants={formVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Background GIF for the header */}
          <div className="h-32 overflow-hidden relative">
            <img 
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDYwbnZ2cXYwbzk2YzdhaHZ0Z24yczBsYzNsMnVrNmN1Y29lcXZuaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUPGcIUXIYlsYKWsG4/giphy.gif" 
              alt="Form background" 
              className="w-full h-full object-cover opacity-40"
            />
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-600/80 to-primary-700/90"></div>
            
            <div className="absolute inset-0 flex items-center justify-between px-5">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Add New Activity
                </h2>
                <p className="text-primary-100 text-sm">
                  Create a new activity for your itinerary
                </p>
              </div>
              
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
              >
                {React.cloneElement(selectedIcon, { 
                  className: "h-8 w-8 text-white" 
                })}
              </motion.div>
            </div>
          </div>

          <motion.button
            className="absolute top-3 right-3 text-white rounded-full p-1 hover:bg-white/20 transition-colors"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Activity Description
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
              </div>
              <input
                type="text"
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Visit Eiffel Tower"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <input
                type="text"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 10:00 AM"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {activityTypes.map((type) => (
                <motion.div 
                  key={type.id}
                  className={`cursor-pointer border rounded-md p-3 text-center flex flex-col items-center justify-center space-y-1 ${
                    formData.type === type.id 
                      ? `${type.color} border-2 shadow-sm` 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {type.icon}
                  <span className="text-sm font-medium">{type.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
              whileHover={{ scale: 1.02, backgroundColor: "#F9FAFB" }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm"
              whileHover={{ scale: 1.02, backgroundColor: "#0284c7" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Add Activity
              </div>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NewActivityForm;