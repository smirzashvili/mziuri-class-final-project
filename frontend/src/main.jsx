import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import { LoaderProvider } from './context/LoaderContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { SoundProvider } from './context/SoundContext.jsx';
// import { ChatProvider } from './context/ChatContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <UserProvider>
        <LoaderProvider>
          <NotificationProvider>
            <SocketProvider>
              <SoundProvider>
                {/* <ChatProvider> */}
                  <App />
                {/* </ChatProvider> */}
              </SoundProvider>
            </SocketProvider>
          </NotificationProvider>
        </LoaderProvider>
      </UserProvider>
    </Router>
  </StrictMode>
);
