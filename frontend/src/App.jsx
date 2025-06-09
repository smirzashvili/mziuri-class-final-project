import { useEffect, useState } from 'react';
import './styles/main.scss';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Sidebar, Main, Footer, TopBar, BottomBar } from './layouts';
import { About, Chat, Contact, Explore, Intro, Profile, SignIn, SignUp, Terms, ForgotPassword, ResetPassword } from './routes';
import { LoadingScreen, Notification, NavigationScreen } from './components';
import useDocumentTitle from './hooks/useDocumentTitle';
import useScrollTop from './hooks/useScrollTop';
import * as api from './api/api.js';
import { useUserData } from './context/UserContext.jsx';
import useAppScale from './hooks/useAppScale'

function App() {

  const [isNavigationScreenVisible, setIsNavigationScreenVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useDocumentTitle();
  useScrollTop();
  useAppScale()

  const { loggedIn, login } = useUserData();

  const navigate = useNavigate();
  // const location = useLocation();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const {data} = await api.getToken();
        const res = await api.getUser(data);
        if (res.data) {
          login(res.data)
          // navigate('/explore');
        }
      } catch(error) {
        console.error(error)
      }
    };
    getUserInfo();
  }, []);

  return (
    <div className={`app ${loggedIn ? 'loggedIn' : ''}`}>
      <Sidebar 
        setIsNavigationScreenVisible={setIsNavigationScreenVisible} 
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
      />
      <Main>
        <TopBar 
          setIsNavigationScreenVisible={setIsNavigationScreenVisible}
          setIsSidebarVisible={setIsSidebarVisible} 
        />
        <Routes>
          <Route
            path="/"
            element={<Intro />}
          />
          <Route
            path="/login"
            element={<SignIn />}
          />
          <Route
            path="/registration"
            element={<SignUp />}
          />
          <Route
            path="/explore"
            element={<Explore />}
          />
          <Route
            path="/chat"
            element={<Chat />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/terms"
            element={<Terms />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/contact"
            element={<Contact />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
        <BottomBar />
      </Main>
      <Footer />
      <NavigationScreen
        visible={isNavigationScreenVisible}
        setVisible={setIsNavigationScreenVisible}
      />
      <LoadingScreen />
      <Notification />
    </div>
  );
}

export default App;
