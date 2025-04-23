import React from 'react'
import './all.css'
import Team1 from './Team1'
import Team2 from './Team2'

function Tools() {
  return (
    <div className='tools'>
      <div className='icons' >
        <div className='counter-buttons'>
          <button className='round'>1</button>
          <button className='round'>2</button>
          <button className='round'>3</button>
          <button className='round'>4</button>
          <button className='round'>6</button>
        </div>
        <div className='special-buttons'>
          <button className='round'>0</button>
          <button className='round'>WD</button>
          <button className='round'>LB</button>
          <button className='round'>W</button>
          <button className='round over'>Over</button>
        </div>
      </div>
      <div className='team'>
        <button className='add-team'>
          <h1>Team 1</h1>
          <Team1/>
        </button>
        <button className='add-team'>
        <h1>Team 2</h1>
          <Team2/>
        </button>
      </div>
    </div>
  )
}

export default Tools