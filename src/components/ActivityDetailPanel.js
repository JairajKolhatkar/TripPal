import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityDetailPanel = ({ activity, onClose, onUpdate }) => {
  const [currentActivity, setCurrentActivity] = useState(activity || {
    id: '',
    content: '',
    time: '',
    type: 'attraction',
    location: '',
    notes: '',
    expenses: [],
    reminders: [],
    attachments: [],
    coordinates: { lat: null, lng: null }
  });
  
  const [activeTab, setActiveTab] = useState('details');
  const [newExpense, setNewExpense] = useState({ amount: '', description: '', currency: 'USD' });
  const [newReminder, setNewReminder] = useState({ time: '', message: '' });
  const fileInputRef = useRef(null);
  
  // Currency symbols for the expense tracker
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    INR: '₹'
  };
  
  // Handle input changes for the main activity fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle expense input changes
  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add a new expense
  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) return;
    
    const expense = {
      id: Date.now(),
      ...newExpense,
      date: new Date().toISOString()
    };
    
    setCurrentActivity(prev => ({
      ...prev,
      expenses: [...prev.expenses, expense]
    }));
    
    setNewExpense({ amount: '', description: '', currency: newExpense.currency });
    
    // Update the parent component
    if (onUpdate) {
      onUpdate({
        ...currentActivity,
        expenses: [...currentActivity.expenses, expense]
      });
    }
  };
  
  // Delete an expense
  const deleteExpense = (id) => {
    setCurrentActivity(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id)
    }));
    
    // Update the parent component
    if (onUpdate) {
      onUpdate({
        ...currentActivity,
        expenses: currentActivity.expenses.filter(expense => expense.id !== id)
      });
    }
  };
  
  // Handle reminder input changes
  const handleReminderChange = (e) => {
    const { name, value } = e.target;
    setNewReminder(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add a new reminder
  const addReminder = () => {
    if (!newReminder.time || !newReminder.message) return;
    
    const reminder = {
      id: Date.now(),
      ...newReminder,
      isActive: true
    };
    
    setCurrentActivity(prev => ({
      ...prev,
      reminders: [...prev.reminders, reminder]
    }));
    
    setNewReminder({ time: '', message: '' });
    
    // Update the parent component
    if (onUpdate) {
      onUpdate({
        ...currentActivity,
        reminders: [...currentActivity.reminders, reminder]
      });
    }
  };
  
  // Toggle a reminder's active state
  const toggleReminder = (id) => {
    setCurrentActivity(prev => ({
      ...prev,
      reminders: prev.reminders.map(reminder => 
        reminder.id === id 
          ? { ...reminder, isActive: !reminder.isActive }
          : reminder
      )
    }));
    
    // Update the parent component
    if (onUpdate) {
      onUpdate({
        ...currentActivity,
        reminders: currentActivity.reminders.map(reminder => 
          reminder.id === id 
            ? { ...reminder, isActive: !reminder.isActive }
            : reminder
        )
      });
    }
  };
  
  // Delete a reminder
  const deleteReminder = (id) => {
    setCurrentActivity(prev => ({
      ...prev,
      reminders: prev.reminders.filter(reminder => reminder.id !== id)
    }));
    
    // Update the parent component
    if (onUpdate) {
      onUpdate({
        ...currentActivity,
        reminders: currentActivity.reminders.filter(reminder => reminder.id !== id)
      });
    }
  };
  
  // Handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file
    }));
    
    setCurrentActivity(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
    
    // Update the parent component
    if (onUpdate) {
      onUpdate({
        ...currentActivity,
        attachments: [...currentActivity.attachments, ...newAttachments]
      });
    }
  };
  
  // Delete an attachment
  const deleteAttachment = (id) => {
    const attachmentToDelete = currentActivity.attachments.find(
      attachment => attachment.id === id
    );
    
    if (attachmentToDelete && attachmentToDelete.url) {
      URL.revokeObjectURL(attachmentToDelete.url);
    }
    
    setCurrentActivity(prev => ({
      ...prev,
      attachments: prev.attachments.filter(attachment => attachment.id !== id)
    }));
    
    // Update the parent component
    if (onUpdate) {
      onUpdate({
        ...currentActivity,
        attachments: currentActivity.attachments.filter(attachment => attachment.id !== id)
      });
    }
  };
  
  // Save all changes
  const saveChanges = () => {
    if (onUpdate) {
      onUpdate(currentActivity);
    }
    
    if (onClose) {
      onClose();
    }
  };
  
  // Calculate total expenses
  const calculateTotal = (currency) => {
    return currentActivity.expenses
      .filter(expense => expense.currency === currency)
      .reduce((total, expense) => total + parseFloat(expense.amount || 0), 0)
      .toFixed(2);
  };
  
  // The panel animation variants
  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { 
        duration: 0.3
      }
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white w-full max-w-md h-full overflow-y-auto"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white shadow-md">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Activity Details</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tab navigation */}
          <div className="flex border-b">
            <button 
              className={`flex-1 p-3 text-center font-medium transition-colors ${
                activeTab === 'details' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button 
              className={`flex-1 p-3 text-center font-medium transition-colors ${
                activeTab === 'expenses' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('expenses')}
            >
              Expenses
            </button>
            <button 
              className={`flex-1 p-3 text-center font-medium transition-colors ${
                activeTab === 'reminders' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('reminders')}
            >
              Reminders
            </button>
            <button 
              className={`flex-1 p-3 text-center font-medium transition-colors ${
                activeTab === 'attachments' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('attachments')}
            >
              Files
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <AnimatePresence mode="wait">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Title
                    </label>
                    <input
                      type="text"
                      name="content"
                      value={currentActivity.content}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter activity title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={currentActivity.date || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        name="time"
                        value={currentActivity.time}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., 10:00 AM"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={currentActivity.location || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={currentActivity.type}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="meal">Meal</option>
                      <option value="attraction">Attraction</option>
                      <option value="leisure">Leisure</option>
                      <option value="travel">Travel</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={currentActivity.notes || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
                      placeholder="Add notes about this activity..."
                    ></textarea>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Expenses Tab */}
            {activeTab === 'expenses' && (
              <motion.div
                key="expenses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">
                            {currencySymbols[newExpense.currency] || '$'}
                          </span>
                        </div>
                        <input
                          type="number"
                          name="amount"
                          value={newExpense.amount}
                          onChange={handleExpenseChange}
                          className="pl-8 w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={newExpense.currency}
                        onChange={handleExpenseChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="AUD">AUD</option>
                        <option value="CAD">CAD</option>
                        <option value="INR">INR</option>
                      </select>
                    </div>
                    
                    <div className="col-span-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={newExpense.description}
                        onChange={handleExpenseChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                        placeholder="What for?"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={addExpense}
                    className="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Add Expense
                  </button>
                  
                  {/* Expense Summary */}
                  {currentActivity.expenses.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">Expense Summary</h3>
                      <div className="space-y-1">
                        {Object.keys(currencySymbols).map(currency => {
                          const total = calculateTotal(currency);
                          if (total === '0.00') return null;
                          
                          return (
                            <div key={currency} className="flex justify-between">
                              <span className="text-gray-600">{currency} Total:</span>
                              <span className="font-medium">{currencySymbols[currency]}{total}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Expense List */}
                  <div className="space-y-2 mt-4">
                    <h3 className="font-medium text-gray-800">Expense List</h3>
                    
                    {currentActivity.expenses.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No expenses added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {currentActivity.expenses.map(expense => (
                          <motion.div 
                            key={expense.id}
                            className="flex justify-between items-center p-3 bg-white border rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div>
                              <div className="font-medium">
                                {currencySymbols[expense.currency]}{parseFloat(expense.amount).toFixed(2)} {expense.currency}
                              </div>
                              <div className="text-sm text-gray-600">{expense.description}</div>
                            </div>
                            <button
                              onClick={() => deleteExpense(expense.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Reminders Tab */}
            {activeTab === 'reminders' && (
              <motion.div
                key="reminders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={newReminder.time}
                        onChange={handleReminderChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <input
                        type="text"
                        name="message"
                        value={newReminder.message}
                        onChange={handleReminderChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                        placeholder="Reminder message"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={addReminder}
                    className="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Set Reminder
                  </button>
                  
                  {/* Reminders List */}
                  <div className="space-y-2 mt-4">
                    <h3 className="font-medium text-gray-800">Reminders</h3>
                    
                    {currentActivity.reminders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No reminders set</p>
                    ) : (
                      <div className="space-y-2">
                        {currentActivity.reminders.map(reminder => (
                          <motion.div 
                            key={reminder.id}
                            className={`flex justify-between items-center p-3 border rounded-lg ${
                              reminder.isActive ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={reminder.isActive}
                                onChange={() => toggleReminder(reminder.id)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3"
                              />
                              <div>
                                <div className={`font-medium ${reminder.isActive ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                                  {reminder.time}
                                </div>
                                <div className={`text-sm ${reminder.isActive ? 'text-gray-600' : 'text-gray-400 line-through'}`}>
                                  {reminder.message}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteReminder(reminder.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Attachments Tab */}
            {activeTab === 'attachments' && (
              <motion.div
                key="attachments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      Drag and drop files, or{' '}
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                        onClick={() => fileInputRef.current.click()}
                      >
                        browse
                      </button>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Photos, documents, or any other files
                    </p>
                  </div>
                  
                  {/* Attachments List */}
                  <div className="space-y-2 mt-4">
                    <h3 className="font-medium text-gray-800">Attached Files</h3>
                    
                    {currentActivity.attachments.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No files attached</p>
                    ) : (
                      <div className="space-y-2">
                        {currentActivity.attachments.map(attachment => (
                          <motion.div 
                            key={attachment.id}
                            className="flex justify-between items-center p-3 bg-white border rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center mr-3">
                                {attachment.type.startsWith('image/') ? (
                                  <img 
                                    src={attachment.url} 
                                    alt={attachment.name} 
                                    className="h-10 w-10 object-cover rounded" 
                                  />
                                ) : (
                                  <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 truncate max-w-[200px]">
                                  {attachment.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {(attachment.size / 1024).toFixed(1)} KB
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-800 mr-3"
                                download={attachment.name}
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </a>
                              <button
                                onClick={() => deleteAttachment(attachment.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Save button */}
        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
          <motion.button
            className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 transition-colors"
            onClick={saveChanges}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityDetailPanel;