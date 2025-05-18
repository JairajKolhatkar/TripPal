import React, { useState } from 'react';
import { motion } from 'framer-motion';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

// Sample conversion rates (in a real app, you would fetch these from an API)
const conversionRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.42,
  JPY: 150.15,
  AUD: 1.53,
  CAD: 1.37,
  SGD: 1.35,
};

const CurrencyDisplay = ({ amount, initialCurrency = 'USD' }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const selectCurrency = (currencyCode) => {
    setSelectedCurrency(currencyCode);
    setIsDropdownOpen(false);
  };
  
  const convertAmount = (amount, targetCurrency) => {
    const inUSD = amount / conversionRates[initialCurrency];
    return inUSD * conversionRates[targetCurrency];
  };
  
  const formatAmount = (amount, currencyCode) => {
    const converted = convertAmount(amount, currencyCode);
    const currency = currencies.find(c => c.code === currencyCode);
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
    }).format(converted);
  };
  
  const selectedCurrencyObj = currencies.find(c => c.code === selectedCurrency);
  
  return (
    <div className="inline-flex relative">
      <div className="flex items-center border rounded-lg shadow-sm overflow-hidden dark:border-gray-700">
        <div className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium">
          {formatAmount(amount, selectedCurrency)}
        </div>
        <button 
          onClick={toggleDropdown}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-l dark:border-gray-600 text-gray-700 dark:text-gray-300 flex items-center"
        >
          <span className="mr-1">{selectedCurrencyObj.code}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isDropdownOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-10 py-1"
          style={{ top: '100%' }}
        >
          <div className="max-h-64 overflow-y-auto">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => selectCurrency(currency.code)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedCurrency === currency.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{currency.name}</span>
                  <span className="font-medium">{currency.symbol}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatAmount(amount, currency.code)}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CurrencyDisplay; 