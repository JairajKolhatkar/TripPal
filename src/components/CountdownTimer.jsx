import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ startDate, timeZone, showDetailed = false }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });
  
  useEffect(() => {
    // Function to calculate time left
    const calculateTimeLeft = () => {
      const now = new Date();
      const tripStart = new Date(startDate);
      
      // Time zone adjustment
      try {
        const destinationTime = new Date(new Date().toLocaleString('en-US', { timeZone }));
        const timeDiff = destinationTime.getTime() - now.getTime();
        
        // Adjust trip start by time difference
        const adjustedTripStart = new Date(tripStart.getTime() + timeDiff);
        
        // If trip is in the past
        if (tripStart < now) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
        }
        
        // Calculate the time difference in milliseconds
        const diffMs = adjustedTripStart - now;
        
        // Convert to days, hours, minutes, seconds
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds, isPast: false };
      } catch (e) {
        // Fallback if time zone is invalid
        const diffMs = tripStart - now;
        
        if (diffMs < 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
        }
        
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds, isPast: false };
      }
    };
    
    // Set initial time
    setTimeLeft(calculateTimeLeft());
    
    // Update timer at appropriate interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, showDetailed ? 1000 : 60000); // Update every second for detailed view, every minute for simple view
    
    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [startDate, timeZone, showDetailed]);
  
  if (timeLeft.isPast) {
    return <span className="text-gray-600">Past trip</span>;
  }
  
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
    return <span className="text-green-600 font-bold">Today!</span>;
  }
  
  // Detailed view with time units and seconds
  if (showDetailed) {
    return (
      <div className="flex items-center justify-center space-x-3">
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">{timeLeft.days}</div>
            <div className="text-xs uppercase">day{timeLeft.days !== 1 ? 's' : ''}</div>
          </div>
        )}
        
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-xs uppercase">hr</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs uppercase">min</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs uppercase">sec</div>
        </div>
      </div>
    );
  }
  
  // Simple view
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div className="text-sm font-medium text-primary-700">
          {timeLeft.days > 0 && (
            <span>{timeLeft.days}d </span>
          )}
          {timeLeft.hours}h 
          {timeLeft.days === 0 && (
            <span> {timeLeft.minutes}m</span>
          )}
        </div>
        <div className="text-xs text-gray-500">until trip</div>
      </div>
    </div>
  );
};

export default CountdownTimer; 