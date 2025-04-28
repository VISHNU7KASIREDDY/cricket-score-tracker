import React, { useState, useRef, useEffect } from 'react'
import './all.css'
import Team1 from './Team1'
import Team2 from './Team2'

function Tools() {
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOvers] = useState(0);
  const [ballsInCurrentOver, setBallsInCurrentOver] = useState(0);
  const [recentScores, setRecentScores] = useState([]);
  const [sequence, setSequence] = useState([]);
  const sequenceRef = useRef(null);

  const scrollToLatest = () => {
    if (sequenceRef.current) {
      sequenceRef.current.scrollLeft = sequenceRef.current.scrollWidth;
    }
  };

  useEffect(() => {
    scrollToLatest();
  }, [sequence]);

  const updateValidBall = () => {
    if (ballsInCurrentOver < 5) {
      setBallsInCurrentOver(prev => prev + 1);
    } else {
      setOvers(prev => prev + 1);
      setBallsInCurrentOver(0);
      setSequence(prev => [...prev, '|']);
    }
  };

  const handleScore = (runs) => {
    setScore(prev => prev + runs);
    setRecentScores(prev => [...prev, runs]);
    setSequence(prev => [...prev, runs]);
    updateValidBall();
  };

  const handleSpecial = (type) => {
    setScore(prev => prev + 1);
    setRecentScores(prev => [...prev, type]);
    setSequence(prev => [...prev, type]);
    if (type === 'LB') {
      updateValidBall();
    }
  };

  const handleWicket = () => {
    setWickets(prev => prev + 1);
    setRecentScores(prev => [...prev, 'W']);
    setSequence(prev => [...prev, 'W']);
    updateValidBall();
  };

  const handleNoBall = () => {
    setScore(prev => prev + 1);
    setRecentScores(prev => [...prev, 'NB']);
    setSequence(prev => [...prev, 'NB']);
  };

  return (
    <div className="tools">
      <div className="score-board">
        <div className="score">
          <h3>Score: {score}-{wickets}</h3>
        </div>
        <div className="overs">
          <h3>Overs: {overs}.{ballsInCurrentOver}</h3>
        </div>
      </div>

      <div className="icons">
        <div className="counter-buttons">
          {[1, 2, 3, 4, 6].map((run) => (
            <button key={run} className="round" onClick={() => handleScore(run)}>
              {run}
            </button>
          ))}
        </div>

        <div className="special-buttons">
          <button className="round" onClick={() => handleSpecial('WD')}>WD</button>
          <button className="round" onClick={() => handleSpecial('LB')}>LB</button>
          <button className="round" onClick={handleWicket}>W</button>
          <button className="round nb" onClick={handleNoBall}>NB</button>
        </div>
      </div>

      <div className="sequence-display">
        <div className="sequence" ref={sequenceRef}>
          {sequence.map((item, idx) => (
            <span 
              key={idx} 
              className={`sequence-item ${item === '|' ? 'over-separator' : ''}`}
              data-type={typeof item === 'string' && ['WD', 'LB', 'W', 'NB'].includes(item) ? item : undefined}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="recent-scores">
        {recentScores.slice(-6).map((item, idx) => (
          <div key={idx} className={`score-circle ${item === 'WD' || item === 'NB' || item === 'LB' ? 'special' : ''}`}>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="team">
        <button className="add-team">
          <h1>Team 1</h1>
          <Team1 />
        </button>
        <button className="add-team">
          <h1>Team 2</h1>
          <Team2 />
        </button>
      </div>
    </div>
  )
}

export default Tools;
