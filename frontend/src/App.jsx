import { useEffect } from 'react';
import './styles/main.scss';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Sidebar, Main, Footer } from './layouts';
import { About, Chat, Contact, Explore, Intro, Profile, SignIn, SignUp, Terms, ForgotPassword, ResetPassword } from './routes';
import { LoadingScreen, Notification } from './components';
import useDocumentTitle from './hooks/useDocumentTitle';
import useScrollTop from './hooks/useScrollTop';
import * as api from './api/api.js';
import { useUserData } from './context/UserContext.jsx';

function App() {
  useDocumentTitle();
  useScrollTop();

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
          navigate('/explore');
        }
      } catch(error) {
        console.error(error)
      }
    };
    getUserInfo();
  }, []);

  return (
    <div className={`app ${loggedIn ? 'loggedIn' : ''}`}>
      <Sidebar />
      <Main>
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
      </Main>
      <Footer />
      <LoadingScreen />
      <Notification />
    </div>
  );
}

export default App;
