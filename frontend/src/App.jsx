import { useEffect, useState } from 'react'
import './styles/main.scss'
import Sidebar from './layouts/Sidebar'
import Footer from './layouts/Footer'
import Main from './layouts/Main'
import { Link, Route, Routes, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import About from './routes/About'
import Intro from './routes/Intro'
import Contact from './routes/Contact'
import Loading from './components/Loading'
import { useLoader } from './hooks/useLoader'

function App() {

  return (
    <div className={`app`}>
      <Sidebar />
      <Main>
        <Routes>
          <Route path='/' element={<Intro />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </Main>
      <Footer />
      <Loading />
    </div>
  )
}

export default App
