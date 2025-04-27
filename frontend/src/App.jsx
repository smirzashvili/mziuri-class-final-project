import { useEffect, useState } from 'react'
import './styles/main.scss'
import { Route, Routes } from 'react-router-dom'
import { Sidebar, Main, Footer } from './layouts'
import { About, Chat, Contact, Explore, Intro, NotFound, Profile, SignIn, SignUp, Terms } from './routes'
import { LoadingScreen } from './components'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  // useEffect(() => {
  //   let timer = setTimeout(() => setLoggedIn(!loggedIn), 1000)
  // })
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
