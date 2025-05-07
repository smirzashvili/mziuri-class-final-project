import { useEffect, useState } from 'react'
import './styles/main.scss'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Sidebar, Main, Footer } from './layouts'
import { About, Chat, Contact, Explore, Intro, NotFound, Profile, SignIn, SignUp, Terms } from './routes'
import { LoadingScreen } from './components'
import useDocumentTitle from './hooks/useDocumentTitle'
import useScrollTop from './hooks/useScrollTop'
import * as api from './api/api.js'
import { useUserData } from './context/UserContext.jsx'

function App() {

  useDocumentTitle()
  useScrollTop()

  const { loggedIn, setLoggedIn } = useUserData() 

  const navigate = useNavigate()

  useEffect(() => {    
    const getUserInfo = async () => {
      const res = await api.getToken()
      if(res.data.token) {
        const res2 = await api.getUser(res.data.token)
        if(res2.data) {
          setLoggedIn(true)
          navigate('/explore')
        }
      }
    }
    getUserInfo()
}, []);

  return (
    <div className={`app ${loggedIn ? 'loggedIn' : ''}`}>
      <Sidebar />
      <Main>
        <Routes>
          <Route path='/' element={<Intro />} />
          <Route path="/login" element={<SignIn />}/>
          <Route path="/registration" element={<SignUp /> }/>
          <Route path="/explore" element={<Explore /> }/>
          <Route path="/chat" element={<Chat /> }/>
          <Route path="/profile" element={<Profile /> } />
          <Route path="/terms" element={<Terms /> }/>
          <Route path="/about" element={<About />}/>
          <Route path='/contact' element={<Contact />} />
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </Main>
      <Footer />
      <LoadingScreen />
    </div>
  )
}

export default App
