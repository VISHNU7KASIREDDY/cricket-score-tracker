import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import Body from './body'
import Footer from './Footer'
import Navbar from './Navbar'


function App() {

  return (
    <div className='app'>
      <Navbar/>
      <Body/>
      <Footer/>
    </div>
    

  )
}

export default App
