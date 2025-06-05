import React, { createContext, useContext, useState, useEffect } from 'react';

// Currency Context
const CurrencyContext = createContext();

// Currency symbols mapping
const CURRENCY_SYMBOLS = {
  usd: '$',
  gel: '₾',
  eur: '€'
};

// Currency names mapping
const CURRENCY_NAMES = {
  usd: 'USD',
  gel: 'GEL',
  eur: 'EUR'
};

// Exchange rates (you can fetch these from an API)
const EXCHANGE_RATES = {
  usd: 1,      // Base currency
  gel: 2.65,   // 1 USD = 2.65 GEL
  eur: 0.92    // 1 USD = 0.92 EUR
};

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState('usd');
  const [exchangeRates, setExchangeRates] = useState(EXCHANGE_RATES);

  // Load currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && CURRENCY_SYMBOLS[savedCurrency]) {
      setCurrentCurrency(savedCurrency);
    }
  }, []);

  // Save currency preference to localStorage
  const changeCurrency = (currency) => {
    if (CURRENCY_SYMBOLS[currency]) {
      setCurrentCurrency(currency);
      localStorage.setItem('selectedCurrency', currency);
    }
  };

  // Convert price from one currency to another
  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return price;
    
    // Convert to USD first (base currency)
    const priceInUSD = price / exchangeRates[fromCurrency];
    // Then convert to target currency
    return priceInUSD * exchangeRates[toCurrency];
  };

  // Format price with currency symbol
  const formatPrice = (price, currency = currentCurrency) => {
    const symbol = CURRENCY_SYMBOLS[currency];
    const formattedPrice = price.toFixed(2);
    
    // For GEL, put symbol after the price
    if (currency === 'gel') {
      return `${formattedPrice}${symbol}`;
    }
    
    // For USD and EUR, put symbol before the price
    return `${symbol}${formattedPrice}`;
  };

  // Get price in current currency from price object
  const getPriceInCurrentCurrency = (priceObject) => {
    if (!priceObject || typeof priceObject !== 'object') {
      // Handle legacy single price (assuming it's in USD)
      const legacyPrice = typeof priceObject === 'number' ? priceObject : 0;
      return convertPrice(legacyPrice, 'usd', currentCurrency);
    }

    // If price object has the current currency, return it
    if (priceObject[currentCurrency]) {
      return priceObject[currentCurrency];
    }

    // Otherwise, convert from USD (assumed base currency in price object)
    const basePrice = priceObject.usd || priceObject.USD || 0;
    return convertPrice(basePrice, 'usd', currentCurrency);
  };

  // Update exchange rates (you can call this from an API)
  const updateExchangeRates = (newRates) => {
    setExchangeRates(prev => ({ ...prev, ...newRates }));
  };

  const value = {
    currentCurrency,
    changeCurrency,
    exchangeRates,
    updateExchangeRates,
    convertPrice,
    formatPrice,
    getPriceInCurrentCurrency,
    currencySymbols: CURRENCY_SYMBOLS,
    currencyNames: CURRENCY_NAMES,
    availableCurrencies: Object.keys(CURRENCY_SYMBOLS)
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Hook to use currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;