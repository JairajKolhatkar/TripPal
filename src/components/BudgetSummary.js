import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BudgetSummary = ({ tripId, days, activities }) => {
  const [budgetData, setBudgetData] = useState({
    dailyBudgets: {},
    totalBudget: 0
  });

  useEffect(() => {
    console.log('BudgetSummary - Received props:', { tripId, days, activities });
    
    const calculateBudgets = () => {
      if (!tripId || !days || !activities) {
        console.warn('Missing required props:', { tripId, days, activities });
        return;
      }

      const dailyBudgets = {};
      let totalBudget = 0;

      // Convert days to array if it's an object
      const daysArray = Array.isArray(days) ? days : Object.values(days);
      const activitiesArray = Array.isArray(activities) ? activities : Object.values(activities);

      console.log('Processing days:', daysArray);
      console.log('Processing activities:', activitiesArray);

      // Calculate daily budgets
      daysArray.forEach(day => {
        if (day.tripId === tripId) {
          const dayActivities = activitiesArray.filter(
            activity => activity.dayId === day.id && activity.tripId === tripId
          );
          
          console.log(`Activities for day ${day.id}:`, dayActivities);
          
          const dayBudget = dayActivities.reduce((sum, activity) => {
            const budget = parseFloat(activity.budget) || 0;
            console.log(`Activity ${activity.id} budget:`, budget);
            return sum + budget;
          }, 0);

          dailyBudgets[day.id] = {
            title: day.title || `Day ${day.dayNumber}`,
            budget: dayBudget
          };
          
          totalBudget += dayBudget;
        }
      });

      console.log('Calculated budget data:', { dailyBudgets, totalBudget });
      setBudgetData({
        dailyBudgets,
        totalBudget
      });
    };

    calculateBudgets();
  }, [tripId, days, activities]);

  if (!tripId || !days || !activities) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Loading budget data...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Summary</h2>
      
      {/* Daily Budgets */}
      <div className="space-y-4 mb-6">
        {Object.entries(budgetData.dailyBudgets).map(([dayId, data]) => (
          <div key={dayId} className="flex justify-between items-center">
            <span className="text-gray-600">{data.title}</span>
            <span className="font-medium text-gray-800">
              ${data.budget.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total Budget */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 font-medium">Total Budget</span>
          <span className="font-bold text-gray-800">
            ${budgetData.totalBudget.toFixed(2)}
          </span>
        </div>
        
        {/* Budget Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-primary-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (budgetData.totalBudget / 1000) * 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetSummary; 