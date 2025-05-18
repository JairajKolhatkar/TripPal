import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

const NewTripPage = () => {
  const navigate = useNavigate();
  
  const [tripData, setTripData] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    timeZone: '',
    tripType: 'leisure',
    initialDayCount: 3,
    color: '#3B82F6', // Default primary color
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Time zone options
  const timeZones = [
    { value: 'America/New_York', label: 'Eastern Time (ET) - New York' },
    { value: 'America/Chicago', label: 'Central Time (CT) - Chicago' },
    { value: 'America/Denver', label: 'Mountain Time (MT) - Denver' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - Los Angeles' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT) - London' },
    { value: 'Europe/Paris', label: 'Central European Time (CET) - Paris' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST) - Tokyo' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET) - Sydney' }
  ];
  
  // Trip types with icons
  const tripTypes = [
    { value: 'leisure', label: 'Leisure', icon: '🏖️' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'romantic', label: 'Romantic', icon: '❤️' },
    { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️' }
  ];
  
  // Color theme options
  const colorOptions = [
    { value: '#3B82F6', label: 'Blue' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Amber' },
    { value: '#EF4444', label: 'Red' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#EC4899', label: 'Pink' }
  ];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!tripData.title.trim()) newErrors.title = 'Title is required';
    if (!tripData.location.trim()) newErrors.location = 'Location is required';
    if (!tripData.startDate) newErrors.startDate = 'Start date is required';
    if (!tripData.endDate) newErrors.endDate = 'End date is required';
    if (!tripData.timeZone) newErrors.timeZone = 'Time zone is required';
    
    // Validate date range
    if (tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Create new trip
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Generate new trip
    const newTripId = `trip-${uuidv4()}`;
    const days = {};
    const activities = {};
    const dayOrder = [];
    
    // Create initial days based on date range
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Use user's preferred day count or calculated day count, whichever is smaller
    const actualDayCount = Math.min(dayCount, tripData.initialDayCount);
    
    // Create days
    for (let i = 0; i < actualDayCount; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayId = `day-${uuidv4()}`;
      days[dayId] = {
        id: dayId,
        title: `Day ${i + 1} - ${currentDate.toLocaleDateString()}`,
        date: currentDate.toISOString().split('T')[0],
        activityIds: []
      };
      
      dayOrder.push(dayId);
    }
    
    const newTrip = {
      id: newTripId,
      title: tripData.title,
      location: tripData.location,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      timeZone: tripData.timeZone,
      tripType: tripData.tripType,
      color: tripData.color,
      description: tripData.description,
      days,
      activities,
      dayOrder,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    // In a real app, you would save this to your database or localStorage
    console.log('New trip created:', newTrip);
    
    // Mock saving to localStorage for demonstration
    const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
    savedTrips.push(newTrip);
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // Redirect to the new itinerary page
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/itinerary/${newTripId}`);
    }, 1000);
  };
  
  // Calculate days difference
  const calculateTripLength = () => {
    if (tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return dayDiff > 0 ? dayDiff : 0;
    }
    return 0;
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden" 
         style={{
           background: "linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%)",
           backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a3bffa' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
         }}>
      {/* Colorful blobs */}
      <div className="absolute top-0 right-0" 
           style={{
             width: "300px",
             height: "300px",
             backgroundImage: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0) 70%)"
           }}>
      </div>
      <div className="absolute bottom-0 left-0" 
           style={{
             width: "400px",
             height: "400px",
             backgroundImage: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, rgba(96,165,250,0) 70%)"
           }}>
      </div>
      
      {/* Floating emojis */}
      <div className="absolute top-1/5 right-1/4 animate-float opacity-20 text-4xl">
        🌴
      </div>
      <div className="absolute bottom-1/3 left-1/6 animate-bounce-slow opacity-20 text-4xl">
        🎒
      </div>
      
      <div className="relative z-10">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 mr-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-primary-600">✈️ TripPal</h1>
            </div>
            <nav className="flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Dashboard</Link>
              <Link to="/itineraries" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Itineraries</Link>
              <Link to="/activities" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Activities</Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto py-8 px-4 relative">
          {/* Striped diagonal pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 -z-10"
               style={{
                 backgroundImage: "linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 50%, #3b82f6 50%, #3b82f6 75%, transparent 75%, transparent)",
                 backgroundSize: "20px 20px"
               }}>
          </div>
          
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Plan a New Trip</h1>
            <p className="text-gray-600 mb-8">Fill in the details below to create your new itinerary</p>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <form onSubmit={handleSubmit} className="p-6">
                {/* Trip Title & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                      Trip Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Summer Vacation in Paris"
                      value={tripData.title}
                      onChange={handleChange}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                      Destination
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Paris, France"
                      value={tripData.location}
                      onChange={handleChange}
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                  </div>
                </div>
                
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="startDate">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                      value={tripData.startDate}
                      onChange={handleChange}
                    />
                    {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="endDate">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                      value={tripData.endDate}
                      onChange={handleChange}
                    />
                    {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                  </div>
                </div>
                
                {/* Trip Length Display */}
                {calculateTripLength() > 0 && (
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded p-3 text-center">
                      <span className="text-gray-600">Trip length: </span>
                      <span className="font-semibold">{calculateTripLength()} days</span>
                    </div>
                  </div>
                )}
                
                {/* Time Zone */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="timeZone">
                    Destination Time Zone
                  </label>
                  <select
                    id="timeZone"
                    name="timeZone"
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 ${errors.timeZone ? 'border-red-500' : 'border-gray-300'}`}
                    value={tripData.timeZone}
                    onChange={handleChange}
                  >
                    <option value="">Select a time zone</option>
                    {timeZones.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                  {errors.timeZone && <p className="mt-1 text-sm text-red-600">{errors.timeZone}</p>}
                </div>
                
                {/* Trip Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {tripTypes.map(type => (
                      <label 
                        key={type.value}
                        className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          tripData.tripType === type.value 
                            ? 'bg-primary-50 border-primary-500 text-primary-700' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tripType"
                          value={type.value}
                          checked={tripData.tripType === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="text-2xl mb-1">{type.icon}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Color Theme */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Theme
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map(color => (
                      <label 
                        key={color.value}
                        className={`relative w-8 h-8 rounded-full cursor-pointer ${
                          tripData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-500' : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        <input
                          type="radio"
                          name="color"
                          value={color.value}
                          checked={tripData.color === color.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {tripData.color === color.value && (
                          <svg className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Trip Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                    Trip Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    placeholder="Add notes or details about your trip..."
                    value={tripData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                {/* Days to Plan Initially */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="initialDayCount">
                    Number of Days to Plan Initially
                  </label>
                  <input
                    type="range"
                    id="initialDayCount"
                    name="initialDayCount"
                    min="1"
                    max={Math.max(10, calculateTripLength())}
                    step="1"
                    value={tripData.initialDayCount}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>1 day</span>
                    <span>{tripData.initialDayCount} days selected</span>
                    <span>{Math.max(10, calculateTripLength())} days</span>
                  </div>
                </div>
                
                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4">
                  <Link
                    to="/"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  
                  <motion.button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Trip...
                      </div>
                    ) : 'Create Trip'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default NewTripPage; 