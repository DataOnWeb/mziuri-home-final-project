import './language/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoaderProvider } from './hooks/useLoader';

createRoot(document.getElementById('root')).render(
  <LoaderProvider>
    <Router>
      <StrictMode>
        <App />
      </StrictMode>
    </Router>
  </LoaderProvider>
);
