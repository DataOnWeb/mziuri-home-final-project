import './language/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoaderProvider } from './hooks/useLoader';
import { CurrencyProvider } from './context/CurrencyContext';
createRoot(document.getElementById('root')).render(
  <LoaderProvider>
    <CurrencyProvider>
      <Router>
        <StrictMode>
          <App />
        </StrictMode>
      </Router>
    </CurrencyProvider>
  </LoaderProvider>
);
