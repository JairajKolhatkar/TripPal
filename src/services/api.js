/**
 * API service for TripPal application
 * This service handles all API requests to our JSON server
 */

const API_URL = 'http://localhost:3001';

// Sample data for fallback
const sampleData = {
  trips: [
    {
      id: 'trip-1',
      title: 'Goa Beach Vacation',
      location: 'Goa, India',
      startDate: '2024-04-05',
      endDate: '2024-04-12',
      type: 'leisure',
      timeZone: 'Asia/Kolkata',
      createdAt: new Date().toISOString()
    }
  ],
  days: [
    {
      id: 'day-1',
      tripId: 'trip-1',
      title: 'Day 1',
      date: '2024-04-05',
      activityIds: ['activity-1']
    }
  ],
  activities: [
    {
      id: 'activity-1',
      tripId: 'trip-1',
      dayId: 'day-1',
      content: 'Beach Visit',
      time: '10:00',
      type: 'leisure',
      location: 'Calangute Beach'
    }
  ]
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Generic fetch function with error handling and fallback
const fetchData = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}/${endpoint}`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Failed:', error);
    
    // Return fallback data for GET requests
    if (!options.method || options.method === 'GET') {
      console.warn('Using fallback data');
      if (endpoint.startsWith('trips/')) {
        const id = endpoint.split('/')[1];
        return sampleData.trips.find(trip => trip.id === id);
      }
      if (endpoint === 'trips') return sampleData.trips;
      if (endpoint === 'days') return sampleData.days;
      if (endpoint === 'activities') return sampleData.activities;
    }
    
    throw error;
  }
};

// Trip related API calls
const tripApi = {
  // Get all trips
  getAllTrips: () => fetchData('trips'),
  
  // Get a single trip by ID
  getTripById: async (tripId) => {
    console.log('Fetching trip:', tripId);
    const response = await fetch(`${API_URL}/trips/${tripId}`);
    return handleResponse(response);
  },
  
  // Create a new trip
  createTrip: async (tripData) => {
    const response = await fetch(`${API_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    return handleResponse(response);
  },
  
  // Update an existing trip
  updateTrip: async (tripId, tripData) => {
    const response = await fetch(`${API_URL}/trips/${tripId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    return handleResponse(response);
  },
  
  // Delete a trip
  deleteTrip: async (tripId) => {
    const response = await fetch(`${API_URL}/trips/${tripId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
  
  updateBudget: async (tripId, budgetUpdate) => {
    return fetchData(`/trips/${tripId}/budget`, {
      method: 'PATCH',
      body: JSON.stringify(budgetUpdate)
    });
  }
};

// Activity related API calls
const activityApi = {
  // Get all activities
  getAllActivities: () => fetchData('activities'),
  
  // Get activities by trip ID
  getActivitiesByTripId: async (tripId) => {
    console.log('Fetching activities for trip:', tripId);
    const response = await fetch(`${API_URL}/activities?tripId=${tripId}`);
    return handleResponse(response);
  },
  
  // Get a single activity by ID
  getActivityById: (id) => fetchData(`activities/${encodeURIComponent(id)}`),
  
  // Create a new activity
  createActivity: async (activityData) => {
    const response = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });
    return handleResponse(response);
  },
  
  // Update an existing activity
  updateActivity: async (activityId, activityData) => {
    const response = await fetch(`${API_URL}/activities/${activityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });
    return handleResponse(response);
  },
  
  // Delete an activity
  deleteActivity: async (activityId) => {
    const response = await fetch(`${API_URL}/activities/${activityId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};

// Day related API calls
const dayApi = {
  // Get all days
  getAllDays: () => fetchData('days'),
  
  // Get days by trip ID
  getDaysByTripId: async (tripId) => {
    console.log('Fetching days for trip:', tripId);
    const response = await fetch(`${API_URL}/days?tripId=${tripId}`);
    return handleResponse(response);
  },
  
  // Get a single day by ID
  getDayById: (id) => fetchData(`days/${encodeURIComponent(id)}`),
  
  // Create a new day
  createDay: async (dayData) => {
    const response = await fetch(`${API_URL}/days`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dayData),
    });
    return handleResponse(response);
  },
  
  // Update an existing day
  updateDay: async (dayId, dayData) => {
    const response = await fetch(`${API_URL}/days/${dayId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dayData),
    });
    return handleResponse(response);
  },
  
  // Delete a day
  deleteDay: async (dayId) => {
    const response = await fetch(`${API_URL}/days/${dayId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};

// User related API calls
const userApi = {
  // Get user profile
  getUserProfile: (id) => fetchData(`users/${encodeURIComponent(id)}`),
  
  // Update user profile
  updateUserProfile: (id, userData) => fetchData(`users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
};

// Expenses related API calls
const expensesApi = {
  createExpense: async (expenseData) => {
    return fetchData('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    });
  },
  
  getExpensesByTripId: async (tripId) => {
    return fetchData(`/expenses?tripId=${tripId}`);
  }
};

// Export a default object with all API services
const api = {
  trips: tripApi,
  activities: activityApi,
  days: dayApi,
  users: userApi,
  expenses: expensesApi
};

export default api; 