import './language/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoaderProvider } from './hooks/useLoader';
import { CurrencyProvider } from './context/CurrencyContext';
import { UserProvider } from './context/UserContext';
createRoot(document.getElementById('root')).render(
  <LoaderProvider>
    <UserProvider>
      <CurrencyProvider>
        <Router>
          <StrictMode>
            <App />
          </StrictMode>
        </Router>
      </CurrencyProvider>
    </UserProvider>
  </LoaderProvider>
);
