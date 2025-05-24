import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import { LoaderProvider } from './context/LoaderContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <UserProvider>
        <LoaderProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </LoaderProvider>
      </UserProvider>
    </Router>
  </StrictMode>
);
