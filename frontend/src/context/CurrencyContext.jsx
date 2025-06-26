import React, { createContext, useContext, useState, useEffect } from 'react';


const CurrencyContext = createContext();


const CURRENCY_SYMBOLS = {
  usd: '$',
  gel: '₾',
  eur: '€',
};


const CURRENCY_NAMES = {
  usd: 'USD',
  gel: 'GEL',
  eur: 'EUR',
};


const EXCHANGE_RATES = {
  usd: 1, 
  gel: 2.65, 
  eur: 0.92, 
};

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState('usd');
  const [exchangeRates, setExchangeRates] = useState(EXCHANGE_RATES);


  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && CURRENCY_SYMBOLS[savedCurrency]) {
      setCurrentCurrency(savedCurrency);
    }
  }, []);

  const changeCurrency = (currency) => {
    if (CURRENCY_SYMBOLS[currency]) {
      setCurrentCurrency(currency);
      localStorage.setItem('selectedCurrency', currency);
    }
  };


  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return price;

    const priceInUSD = price / exchangeRates[fromCurrency];

    return priceInUSD * exchangeRates[toCurrency];
  };

  const formatPrice = (price, currency = currentCurrency) => {
    const symbol = CURRENCY_SYMBOLS[currency];
    const formattedPrice = price.toFixed(2);

    if (currency === 'gel') {
      return `${symbol}${formattedPrice}`;
    }

    return `${symbol}${formattedPrice}`;
  };

  const getPriceInCurrentCurrency = (priceObject) => {
    if (!priceObject || typeof priceObject !== 'object') {
      const legacyPrice = typeof priceObject === 'number' ? priceObject : 0;
      return convertPrice(legacyPrice, 'usd', currentCurrency);
    }


    if (priceObject[currentCurrency]) {
      return priceObject[currentCurrency];
    }


    const basePrice = priceObject.usd || priceObject.USD || 0;
    return convertPrice(basePrice, 'usd', currentCurrency);
  };


  const updateExchangeRates = (newRates) => {
    setExchangeRates((prev) => ({ ...prev, ...newRates }));
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
    availableCurrencies: Object.keys(CURRENCY_SYMBOLS),
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
