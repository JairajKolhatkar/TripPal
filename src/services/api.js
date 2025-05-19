/**
 * API service for TripPal application
 * This service handles all API requests to our JSON server
 */

const API_URL = 'http://localhost:3001';

// Sample data in case the API fails (fallback)
const sampleData = {
  trips: [
    {
      id: 'trip-1',
      title: 'Goa Beach Vacation',
      location: 'Goa, India',
      startDate: '2024-04-05',
      endDate: '2024-04-12',
      type: 'leisure',
      tripType: 'leisure',
      color: '#3B82F6',
      thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
      progress: 100,
      dayCount: 7,
      mood: '😄',
      timeZone: 'Asia/Kolkata',
      weather: '☀️'
    },
    {
      id: 'trip-2',
      title: 'Rajasthan Heritage Tour',
      location: 'Jaipur, India',
      startDate: '2024-10-15',
      endDate: '2024-10-22',
      type: 'cultural',
      tripType: 'cultural',
      color: '#F59E0B',
      thumbnail: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      progress: 35,
      dayCount: 7,
      mood: '🏛️',
      timeZone: 'Asia/Kolkata',
      weather: '🌤️'
    },
    {
      id: 'trip-3',
      title: 'Business in Dubai',
      location: 'Dubai, UAE',
      startDate: '2024-07-12',
      endDate: '2024-07-18',
      type: 'business',
      tripType: 'business',
      color: '#8B5CF6',
      thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
      progress: 65,
      dayCount: 6,
      mood: '🤝',
      timeZone: 'Asia/Dubai',
      weather: '🔥'
    }
  ]
};

// Generic fetch function with error handling
const fetchData = async (endpoint, options = {}) => {
  try {
    // Properly encode the endpoint URL
    const encodedEndpoint = encodeURIComponent(endpoint).replace(/%2F/g, '/');
    const url = `${API_URL}/${encodedEndpoint}`;
    
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Failed:', error);
    
    // If it's an error that might be due to JSON Server issues,
    // return sample data as a fallback
    if (endpoint === 'trips' && !options.method) {
      console.warn('Using sample trip data as fallback');
      return sampleData.trips;
    }
    
    throw error;
  }
};

// Trip related API calls
export const tripApi = {
  // Get all trips
  getAllTrips: () => fetchData('trips'),
  
  // Get a single trip by ID
  getTripById: (id) => {
    try {
      return fetchData(`trips/${encodeURIComponent(id)}`);
    } catch (error) {
      console.error('Error fetching trip:', error);
      // Return a matching trip from sample data if available
      const sampleTrip = sampleData.trips.find(trip => trip.id === id);
      if (sampleTrip) return Promise.resolve(sampleTrip);
      throw error;
    }
  },
  
  // Create a new trip
  createTrip: (tripData) => fetchData('trips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData)
  }),
  
  // Update an existing trip
  updateTrip: (id, tripData) => fetchData(`trips/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData)
  }),
  
  // Delete a trip
  deleteTrip: (id) => fetchData(`trips/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
};

// Activity related API calls
export const activityApi = {
  // Get all activities
  getAllActivities: () => fetchData('activities'),
  
  // Get activities by trip ID
  getActivitiesByTripId: async (tripId) => {
    try {
      const activities = await fetchData('activities');
      return activities.filter(activity => activity.itineraryId === tripId);
    } catch (error) {
      console.error('Error fetching activities by trip ID:', error);
      return [];
    }
  },
  
  // Get a single activity by ID
  getActivityById: (id) => fetchData(`activities/${encodeURIComponent(id)}`),
  
  // Create a new activity
  createActivity: (activityData) => fetchData('activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData)
  }),
  
  // Update an existing activity
  updateActivity: (id, activityData) => fetchData(`activities/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData)
  }),
  
  // Delete an activity
  deleteActivity: (id) => fetchData(`activities/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
};

// Day related API calls
export const dayApi = {
  // Get all days
  getAllDays: () => fetchData('days'),
  
  // Get days by trip ID
  getDaysByTripId: async (tripId) => {
    try {
      const days = await fetchData('days');
      return days.filter(day => day.tripId === tripId);
    } catch (error) {
      console.error('Error fetching days by trip ID:', error);
      return [];
    }
  },
  
  // Get a single day by ID
  getDayById: (id) => fetchData(`days/${encodeURIComponent(id)}`),
  
  // Create a new day
  createDay: (dayData) => fetchData('days', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dayData)
  }),
  
  // Update an existing day
  updateDay: (id, dayData) => fetchData(`days/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dayData)
  }),
  
  // Delete a day
  deleteDay: (id) => fetchData(`days/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
};

// User related API calls
export const userApi = {
  // Get user profile
  getUserProfile: (id) => fetchData(`users/${encodeURIComponent(id)}`),
  
  // Update user profile
  updateUserProfile: (id, userData) => fetchData(`users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
};

// Export a default object with all API services
const api = {
  trips: tripApi,
  activities: activityApi,
  days: dayApi,
  users: userApi
};

export default api; 