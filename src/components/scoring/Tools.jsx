import React, { useState, useRef, useEffect } from 'react'
import '../../App.css'
import Team1 from '../team/Team1'
import Team2 from '../team/Team2'

function Tools() {
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOvers] = useState(0);
  const [ballsInCurrentOver, setBallsInCurrentOver] = useState(0);
  const [recentScores, setRecentScores] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [runsInCurrentOver, setRunsInCurrentOver] = useState(0);
  const [isBowlerSelected, setIsBowlerSelected] = useState(false);
  const [isBatterSelected, setIsBatterSelected] = useState(true);
  const [areBattersSelected, setAreBattersSelected] = useState(false);
  const sequenceRef = useRef(null);

  useEffect(() => {
    const handleBattersSelected = () => {
      setAreBattersSelected(true);
    };

    const handleBattersNotSelected = () => {
      setAreBattersSelected(false);
    };

    const handleBatterRequired = () => {
      setIsBatterSelected(false);
    };

    const handleBatterSelected = () => {
      setIsBatterSelected(true);
    };

    window.addEventListener('battersSelected', handleBattersSelected);
    window.addEventListener('battersNotSelected', handleBattersNotSelected);
    window.addEventListener('batterRequired', handleBatterRequired);
    window.addEventListener('batterSelected', handleBatterSelected);

    return () => {
      window.removeEventListener('battersSelected', handleBattersSelected);
      window.removeEventListener('battersNotSelected', handleBattersNotSelected);
      window.removeEventListener('batterRequired', handleBatterRequired);
      window.removeEventListener('batterSelected', handleBatterSelected);
    };
  }, []);

  useEffect(() => {
    const handleBowlerSelected = () => {
      setIsBowlerSelected(true);
    };

    const handleBowlerRequired = () => {
      setIsBowlerSelected(false);
    };

    const handleBatterRequired = () => {
      setIsBatterSelected(false);
    };

    const handleBatterSelected = () => {
      setIsBatterSelected(true);
    };

    window.addEventListener('bowlerSelected', handleBowlerSelected);
    window.addEventListener('bowlerRequired', handleBowlerRequired);
    window.addEventListener('batterRequired', handleBatterRequired);
    window.addEventListener('batterSelected', handleBatterSelected);

    return () => {
      window.removeEventListener('bowlerSelected', handleBowlerSelected);
      window.removeEventListener('bowlerRequired', handleBowlerRequired);
      window.removeEventListener('batterRequired', handleBatterRequired);
      window.removeEventListener('batterSelected', handleBatterSelected);
    };
  }, []);

  const scrollToLatest = () => {
    if (sequenceRef.current) {
      sequenceRef.current.scrollLeft = sequenceRef.current.scrollWidth;
    }
  };

  useEffect(() => {
    scrollToLatest();
  }, [sequence]);

  useEffect(() => {
    // Dispatch over update whenever overs or ballsInCurrentOver changes
    const overUpdateEvent = new CustomEvent('overUpdate', {
      detail: {
        overs: `${overs}.${ballsInCurrentOver}`
      }
    });
    window.dispatchEvent(overUpdateEvent);
  }, [overs, ballsInCurrentOver]);

  const updateValidBall = () => {
    if (ballsInCurrentOver < 5) {
      setBallsInCurrentOver(prev => prev + 1);
    } else {
      setOvers(prev => prev + 1);
      setBallsInCurrentOver(0);
      setSequence(prev => [...prev, '|']);
      setRunsInCurrentOver(0);
      
      // Toggle striker after over completion
      const event = new CustomEvent('toggleStriker');
      window.dispatchEvent(event);
      
      // Wait 1 second before showing alert
      setTimeout(() => {
        alert('Please select a new bowler for the next over');
        const event = new CustomEvent('bowlerRequired');
        window.dispatchEvent(event);
      }, 1000);
    }
  };

  const validateAction = () => {
    if (!areBattersSelected) {
      alert('Please select both batters first');
      return false;
    }
    if (!isBowlerSelected) {
      alert('Please select a bowler first');
      return false;
    }
    if (!isBatterSelected) {
      alert('Please select a new batsman first');
      return false;
    }
    return true;
  };

  const handleScore = (runs) => {
    if (!validateAction()) return;
    
    setScore(prev => prev + runs);
    setRecentScores(prev => [...prev, runs]);
    setSequence(prev => [...prev, runs]);
    setRunsInCurrentOver(prev => prev + runs);
    updateValidBall();

    const event = new CustomEvent('scoreUpdate', { 
      detail: { 
        runs: runs,
        isFour: runs === 4,
        isSix: runs === 6
      } 
    });
    window.dispatchEvent(event);

    // Dispatch over update event
    const overUpdateEvent = new CustomEvent('overUpdate', {
      detail: {
        overs: overs,
        ballsInCurrentOver: ballsInCurrentOver + 1
      }
    });
    window.dispatchEvent(overUpdateEvent);

    // Update bowler's over stats
    const bowlerEvent = new CustomEvent('updateBowlerStats', {
      detail: {
        runs: runs,
        balls: 1
      }
    });
    window.dispatchEvent(bowlerEvent);
  };

  const handleSpecial = (type) => {
    if (!validateAction()) return;
    
    setScore(prev => prev + 1);
    setRecentScores(prev => [...prev, type]);
    setSequence(prev => [...prev, type]);
    
    const event = new CustomEvent('specialUpdate', { 
      detail: { type } 
    });
    window.dispatchEvent(event);

    if (type === 'LB') {
      updateValidBall();
      // Update bowler's over stats for leg byes
      const bowlerEvent = new CustomEvent('updateBowlerStats', {
        detail: {
          runs: 1,
          balls: 1
        }
      });
      window.dispatchEvent(bowlerEvent);
    }
  };

  const handleWicket = () => {
    if (!validateAction()) return;
    
    setWickets(prev => prev + 1);
    setRecentScores(prev => [...prev, 'W']);
    setSequence(prev => [...prev, 'W']);
    updateValidBall();
    
    const event = new CustomEvent('wicketFallen', { 
      detail: { wicketNumber: wickets + 1 } 
    });
    window.dispatchEvent(event);

    // Update bowler's over stats for wicket
    const bowlerEvent = new CustomEvent('updateBowlerStats', {
      detail: {
        runs: 0,
        balls: 1,
        wicket: true
      }
    });
    window.dispatchEvent(bowlerEvent);

    // Don't handle innings completion here - let Core.jsx handle it
    // Just show the new batsman selection if needed
    if (wickets + 1 < battingPlayers.length - 1) {
      setTimeout(() => {
        alert('Please select a new batsman');
        const event = new CustomEvent('batterRequired');
        window.dispatchEvent(event);
      }, 1000);
    }
  };

  const handleNoBall = () => {
    if (!validateAction()) return;
    
    setScore(prev => prev + 1);
    setRecentScores(prev => [...prev, 'NB']);
    setSequence(prev => [...prev, 'NB']);
    
    const event = new CustomEvent('specialUpdate', { 
      detail: { type: 'NB' } 
    });
    window.dispatchEvent(event);

    // Update bowler's over stats for no ball
    const bowlerEvent = new CustomEvent('updateBowlerStats', {
      detail: {
        runs: 1,
        balls: 0
      }
    });
    window.dispatchEvent(bowlerEvent);
  };

  const handleBallClick = () => {
    if (!validateAction()) return;
    
    const event = new CustomEvent('scoreUpdate', {
      detail: {
        runs: 0,
        isFour: false,
        isSix: false
      }
    });
    window.dispatchEvent(event);
    updateValidBall();

    // Update bowler's over stats for dot ball
    const bowlerEvent = new CustomEvent('updateBowlerStats', {
      detail: {
        runs: 0,
        balls: 1
      }
    });
    window.dispatchEvent(bowlerEvent);
  };

  const handleOverComplete = () => {
    const event = new CustomEvent('overComplete');
    window.dispatchEvent(event);
    alert('Please select a new bowler for the next over');
  };

  const handleTeamData = (teamKey, data) => {
    localStorage.setItem(teamKey, JSON.stringify(data));
    // Dispatch event to notify Core component
    const event = new CustomEvent('teamDataUpdated');
    window.dispatchEvent(event);
  };

  return (
    <div className="tools">
      <div className="score-board">
        <div className="score">
          <h3>Score: {score}/{wickets}</h3>
        </div>
        <div className="overs">
          <h3>Overs: {overs}.{ballsInCurrentOver}</h3>
        </div>
      </div>

      <div className="icons">
        <div className="counter-buttons">
          {[0, 1, 2, 3, 4, 6].map((run) => (
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
          <Team1 onTeamData={(data) => handleTeamData('team1Data', data)} />
        </button>
        <button className="add-team">
          <h1>Team 2</h1>
          <Team2 onTeamData={(data) => handleTeamData('team2Data', data)} />
        </button>
      </div>
    </div>
  )
}

export default Tools; 