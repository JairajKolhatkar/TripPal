import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ItineraryPage from './pages/ItineraryPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/itinerary/:tripId" element={<ItineraryPage />} />
        {/* Redirect /itineraries to home page */}
        <Route path="/itineraries" element={<Navigate to="/" replace />} />
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 