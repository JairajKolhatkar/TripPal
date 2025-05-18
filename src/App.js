import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import ItineraryBoard from './components/ItineraryBoard';
import Header from './components/Header';
import NewActivityForm from './components/NewActivityForm';
import WelcomeScreen from './components/WelcomeScreen';
import AnimatedSvgLoader from './components/AnimatedSvgLoader';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ItineraryPage from './pages/ItineraryPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import NewTripPage from './pages/NewTripPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import './styles/index.css';

// Sample initial data
const initialData = {
  days: {
    'day-1': {
      id: 'day-1',
      title: 'Day 1',
      activityIds: ['activity-1', 'activity-2', 'activity-3'],
    },
    'day-2': {
      id: 'day-2',
      title: 'Day 2',
      activityIds: ['activity-4', 'activity-5'],
    },
    'day-3': {
      id: 'day-3',
      title: 'Day 3',
      activityIds: ['activity-6'],
    },
  },
  activities: {
    'activity-1': { id: 'activity-1', content: 'Breakfast at Hotel', time: '8:00 AM', type: 'meal' },
    'activity-2': { id: 'activity-2', content: 'Visit Museum', time: '10:00 AM', type: 'attraction' },
    'activity-3': { id: 'activity-3', content: 'Lunch at Downtown', time: '1:00 PM', type: 'meal' },
    'activity-4': { id: 'activity-4', content: 'Beach Day', time: '10:00 AM', type: 'leisure' },
    'activity-5': { id: 'activity-5', content: 'Dinner Reservation', time: '7:00 PM', type: 'meal' },
    'activity-6': { id: 'activity-6', content: 'Airport Transfer', time: '2:00 PM', type: 'travel' },
  },
  dayOrder: ['day-1', 'day-2', 'day-3'],
};

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // Simulate loading and retrieve data from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedData = localStorage.getItem('itineraryData');
      setData(savedData ? JSON.parse(savedData) : initialData);
      setIsLoading(false);
      
      // Check if this is the first visit
      const hasVisited = localStorage.getItem('hasVisitedBefore');
      if (hasVisited) {
        setShowWelcome(false);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (data) {
      localStorage.setItem('itineraryData', JSON.stringify(data));
    }
  }, [data]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    // If there's no destination or the item was dropped in the same position
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If we're reordering days
    if (type === 'day') {
      const newDayOrder = Array.from(data.dayOrder);
      newDayOrder.splice(source.index, 1);
      newDayOrder.splice(destination.index, 0, draggableId);

      setData({
        ...data,
        dayOrder: newDayOrder,
      });
      return;
    }

    // Reordering activities
    const startDay = data.days[source.droppableId];
    const finishDay = data.days[destination.droppableId];

    // If reordering within the same day
    if (startDay === finishDay) {
      const newActivityIds = Array.from(startDay.activityIds);
      newActivityIds.splice(source.index, 1);
      newActivityIds.splice(destination.index, 0, draggableId);

      const newDay = {
        ...startDay,
        activityIds: newActivityIds,
      };

      setData({
        ...data,
        days: {
          ...data.days,
          [newDay.id]: newDay,
        },
      });
      return;
    }

    // Moving from one day to another
    const startActivityIds = Array.from(startDay.activityIds);
    startActivityIds.splice(source.index, 1);
    const newStartDay = {
      ...startDay,
      activityIds: startActivityIds,
    };

    const finishActivityIds = Array.from(finishDay.activityIds);
    finishActivityIds.splice(destination.index, 0, draggableId);
    const newFinishDay = {
      ...finishDay,
      activityIds: finishActivityIds,
    };

    setData({
      ...data,
      days: {
        ...data.days,
        [newStartDay.id]: newStartDay,
        [newFinishDay.id]: newFinishDay,
      },
    });
  };

  const addNewDay = () => {
    const newDayId = `day-${uuidv4()}`;
    const dayNumber = data.dayOrder.length + 1;
    
    setData({
      ...data,
      days: {
        ...data.days,
        [newDayId]: {
          id: newDayId,
          title: `Day ${dayNumber}`,
          activityIds: [],
        },
      },
      dayOrder: [...data.dayOrder, newDayId],
    });
  };

  const removeDay = (dayId) => {
    if (data.dayOrder.length <= 1) {
      alert("You can't remove the last day!");
      return;
    }

    // Remove activities of this day
    const activitiesToRemove = data.days[dayId].activityIds;
    const newActivities = { ...data.activities };
    
    activitiesToRemove.forEach(activityId => {
      delete newActivities[activityId];
    });

    // Remove the day
    const newDays = { ...data.days };
    delete newDays[dayId];
    
    // Update day order
    const newDayOrder = data.dayOrder.filter(id => id !== dayId);

    setData({
      days: newDays,
      activities: newActivities,
      dayOrder: newDayOrder,
    });
  };

  const editDayTitle = (dayId, newTitle) => {
    setData({
      ...data,
      days: {
        ...data.days,
        [dayId]: {
          ...data.days[dayId],
          title: newTitle,
        },
      },
    });
  };

  const addActivity = (dayId, activity) => {
    const newActivityId = `activity-${uuidv4()}`;
    const newActivity = {
      id: newActivityId,
      ...activity,
    };

    setData({
      ...data,
      activities: {
        ...data.activities,
        [newActivityId]: newActivity,
      },
      days: {
        ...data.days,
        [dayId]: {
          ...data.days[dayId],
          activityIds: [...data.days[dayId].activityIds, newActivityId],
        },
      },
    });

    setIsModalOpen(false);
  };

  const removeActivity = (activityId, dayId) => {
    const newActivities = { ...data.activities };
    delete newActivities[activityId];

    const newActivityIds = data.days[dayId].activityIds.filter(
      id => id !== activityId
    );

    setData({
      ...data,
      activities: newActivities,
      days: {
        ...data.days,
        [dayId]: {
          ...data.days[dayId],
          activityIds: newActivityIds,
        },
      },
    });
  };

  const openAddActivityModal = (dayId) => {
    setSelectedDay(dayId);
    setIsModalOpen(true);
  };

  const handleStartPlanning = () => {
    setShowWelcome(false);
    localStorage.setItem('hasVisitedBefore', 'true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <AnimatedSvgLoader />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BackgroundProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/itinerary/:tripId" element={<ItineraryPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activity/:activityId" element={<ActivityDetailPage />} />
            <Route path="/new-trip" element={<NewTripPage />} />
          </Routes>
        </Router>
      </BackgroundProvider>
    </ThemeProvider>
  );
}

export default App; 