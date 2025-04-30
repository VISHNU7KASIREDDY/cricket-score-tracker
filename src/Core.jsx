import React, { useState, useEffect, useRef } from 'react';
import './all.css';
import './core.css';

function Core() {
  const [battingTeamKey, setBattingTeamKey] = useState('');
  const [bowlingTeamKey, setBowlingTeamKey] = useState('');
  const [battingPlayers, setBattingPlayers] = useState([]);
  const [bowlingPlayers, setBowlingPlayers] = useState([]);
  const [selectedBatters, setSelectedBatters] = useState(['', '']);
  const [selectedBowler, setSelectedBowler] = useState('');
  const [playerStats, setPlayerStats] = useState({});
  const [allBowlerStats, setAllBowlerStats] = useState({});
  const [availableBatters, setAvailableBatters] = useState([]);
  const [showInitialDropdowns, setShowInitialDropdowns] = useState(true);
  const [showNewBatterDropdown, setShowNewBatterDropdown] = useState(false);
  const [outBatterIndex, setOutBatterIndex] = useState(null);
  const [strikerIndex, setStrikerIndex] = useState(0);
  const [showBowlerSelection, setShowBowlerSelection] = useState(false);
  const [ballsBowled, setBallsBowled] = useState(0);
  const [team1Data, setTeam1Data] = useState(JSON.parse(localStorage.getItem('team1Data')) || {});
  const [team2Data, setTeam2Data] = useState(JSON.parse(localStorage.getItem('team2Data')) || {});
  const [hasStartedBatting, setHasStartedBatting] = useState(false);
  const initialAlertShown = useRef(false);
  const [wickets, setWickets] = useState(0);

  useEffect(() => {
    if (!initialAlertShown.current && !battingTeamKey && (team1Data.players?.length > 0 || team2Data.players?.length > 0)) {
      alert('Please select the batting team first');
      initialAlertShown.current = true;
    }
  }, [team1Data, team2Data, battingTeamKey]);

  useEffect(() => {
    if (battingTeamKey) {
      const battingTeam = JSON.parse(localStorage.getItem(battingTeamKey));
      const bowlingTeam = battingTeamKey === 'team1Data'
        ? JSON.parse(localStorage.getItem('team2Data'))
        : JSON.parse(localStorage.getItem('team1Data'));

      setBowlingTeamKey(battingTeamKey === 'team1Data' ? 'team2Data' : 'team1Data');
      setBattingPlayers(battingTeam?.players || []);
      setBowlingPlayers(bowlingTeam?.players || []);
      setAvailableBatters(battingTeam?.players || []);
    }
  }, [battingTeamKey]);

  useEffect(() => {
    const handleScoreUpdate = (e) => {
      const { runs, isFour, isSix } = e.detail;
      const striker = selectedBatters[strikerIndex];
      
      if (striker) {
        setPlayerStats(prev => ({
          ...prev,
          [striker]: {
            ...prev[striker],
            score: (prev[striker]?.score || 0) + runs,
            ballsFaced: (prev[striker]?.ballsFaced || 0) + 1,
            fours: (prev[striker]?.fours || 0) + (isFour ? 1 : 0),
            sixes: (prev[striker]?.sixes || 0) + (isSix ? 1 : 0)
          }
        }));
      }

      if (selectedBowler) {
        setAllBowlerStats(prev => ({
          ...prev,
          [selectedBowler]: {
            ...prev[selectedBowler],
            dots: prev[selectedBowler]?.dots + (runs === 0 ? 1 : 0),
            runsGiven: (prev[selectedBowler]?.runsGiven || 0) + runs
          }
        }));
      }

      if (runs % 2 !== 0) {
        setStrikerIndex(prev => (prev === 0 ? 1 : 0));
      }
    };

    const handleSpecialUpdate = (e) => {
      const { type } = e.detail;
      
      if (selectedBowler) {
        setAllBowlerStats(prev => ({
          ...prev,
          [selectedBowler]: {
            ...prev[selectedBowler],
            dots: type === 'WD' || type === 'NB' ? prev[selectedBowler]?.dots : prev[selectedBowler]?.dots + 1,
            runsGiven: (prev[selectedBowler]?.runsGiven || 0) + 1
          }
        }));
      }
    };

    const handleCheckAvailableBatsmen = () => {
      // Get list of available batsmen (players not yet out)
      const availableBatsmen = battingPlayers.filter(player => {
        const stats = playerStats[player];
        return !stats || stats.ballsFaced === 0;
      });

      if (availableBatsmen.length === 0) {
        // No batsmen left, end innings
        setTimeout(() => {
          alert('First innings completed! Now the other team will bat.');
          // Switch teams
          const newBattingTeamKey = battingTeamKey === 'team1Data' ? 'team2Data' : 'team1Data';
          const newBowlingTeamKey = newBattingTeamKey === 'team1Data' ? 'team2Data' : 'team1Data';
          
          setBattingTeamKey(newBattingTeamKey);
          setBowlingTeamKey(newBowlingTeamKey);
          setBattingPlayers(newBattingTeamKey === 'team1Data' ? team1Data.players : team2Data.players);
          setBowlingPlayers(newBowlingTeamKey === 'team1Data' ? team1Data.players : team2Data.players);
          
          // Reset all stats for the new innings
          setSelectedBatters(['', '']);
          setSelectedBowler('');
          setPlayerStats({});
          setAllBowlerStats({});
          setAvailableBatters(newBattingTeamKey === 'team1Data' ? team1Data.players : team2Data.players);
          setShowInitialDropdowns(true);
          setShowNewBatterDropdown(false);
          setOutBatterIndex(null);
          setStrikerIndex(0);
          setShowBowlerSelection(false);
          setBallsBowled(0);
          setHasStartedBatting(false);

          // Dispatch events to reset the game state
          const event = new CustomEvent('battersNotSelected');
          window.dispatchEvent(event);
          const bowlerEvent = new CustomEvent('bowlerRequired');
          window.dispatchEvent(bowlerEvent);
        }, 5000);
      } else {
        // Show alert to select new batsman
        alert('Please select a new batsman');
        const event = new CustomEvent('batterRequired');
        window.dispatchEvent(event);
      }
    };

    const handleWicketFallen = (e) => {
      const outBatter = selectedBatters[strikerIndex];
      if (outBatter) {
        setOutBatterIndex(strikerIndex);
        setShowNewBatterDropdown(true);
      }

      if (selectedBowler) {
        setAllBowlerStats(prev => ({
          ...prev,
          [selectedBowler]: {
            ...prev[selectedBowler],
            wickets: (prev[selectedBowler]?.wickets || 0) + 1
          }
        }));
      }

      // Check if this was the last wicket of the innings
      if (wickets >= battingPlayers.length - 2) {
        // First update UI
        const newBattingTeamKey = battingTeamKey === 'team1Data' ? 'team2Data' : 'team1Data';
        const newBowlingTeamKey = newBattingTeamKey === 'team1Data' ? 'team2Data' : 'team1Data';
        
        setBattingTeamKey(newBattingTeamKey);
        setBowlingTeamKey(newBowlingTeamKey);
        setBattingPlayers(newBattingTeamKey === 'team1Data' ? team1Data.players : team2Data.players);
        setBowlingPlayers(newBowlingTeamKey === 'team1Data' ? team1Data.players : team2Data.players);
        
        // Reset all stats for the new innings
        setSelectedBatters(['', '']);
        setSelectedBowler('');
        setPlayerStats({});
        setAllBowlerStats({});
        setAvailableBatters(newBattingTeamKey === 'team1Data' ? team1Data.players : team2Data.players);
        setShowInitialDropdowns(true);
        setShowNewBatterDropdown(false);
        setOutBatterIndex(null);
        setStrikerIndex(0);
        setShowBowlerSelection(false);
        setBallsBowled(0);
        setHasStartedBatting(false);

        // Then show alert after UI update
        setTimeout(() => {
          const currentScore = Object.values(playerStats).reduce((sum, stats) => sum + (stats.score || 0), 0);
          alert(`First innings completed! Target is ${currentScore + 1}`);
          
          // Dispatch events to reset the game state
          const event = new CustomEvent('battersNotSelected');
          window.dispatchEvent(event);
          const bowlerEvent = new CustomEvent('bowlerRequired');
          window.dispatchEvent(bowlerEvent);
        }, 100);
      }
    };

    const handleOverComplete = () => {
      setShowBowlerSelection(true);
      setBallsBowled(0);
    };

    const handleToggleStriker = () => {
      setStrikerIndex(prev => (prev === 0 ? 1 : 0));
    };

    const handleUpdateBowlerStats = (e) => {
      const { runs, balls, wicket } = e.detail;
      if (selectedBowler) {
        setAllBowlerStats(prev => ({
          ...prev,
          [selectedBowler]: {
            ...prev[selectedBowler],
            runsGiven: (prev[selectedBowler]?.runsGiven || 0) + runs,
            ballsBowled: (prev[selectedBowler]?.ballsBowled || 0) + balls,
            wickets: (prev[selectedBowler]?.wickets || 0) + (wicket ? 1 : 0),
            dots: (prev[selectedBowler]?.dots || 0) + (runs === 0 && balls === 1 ? 1 : 0)
          }
        }));
      }
    };

    window.addEventListener('scoreUpdate', handleScoreUpdate);
    window.addEventListener('specialUpdate', handleSpecialUpdate);
    window.addEventListener('checkAvailableBatsmen', handleCheckAvailableBatsmen);
    window.addEventListener('wicketFallen', handleWicketFallen);
    window.addEventListener('overComplete', handleOverComplete);
    window.addEventListener('toggleStriker', handleToggleStriker);
    window.addEventListener('updateBowlerStats', handleUpdateBowlerStats);

    return () => {
      window.removeEventListener('scoreUpdate', handleScoreUpdate);
      window.removeEventListener('specialUpdate', handleSpecialUpdate);
      window.removeEventListener('checkAvailableBatsmen', handleCheckAvailableBatsmen);
      window.removeEventListener('wicketFallen', handleWicketFallen);
      window.removeEventListener('overComplete', handleOverComplete);
      window.removeEventListener('toggleStriker', handleToggleStriker);
      window.removeEventListener('updateBowlerStats', handleUpdateBowlerStats);
    };
  }, [selectedBatters, strikerIndex, selectedBowler, wickets, battingPlayers.length, battingTeamKey, team1Data, team2Data]);

  useEffect(() => {
    // Listen for team data updates
    const handleTeamDataUpdate = () => {
      setTeam1Data(JSON.parse(localStorage.getItem('team1Data')) || {});
      setTeam2Data(JSON.parse(localStorage.getItem('team2Data')) || {});
    };

    window.addEventListener('teamDataUpdated', handleTeamDataUpdate);
    return () => window.removeEventListener('teamDataUpdated', handleTeamDataUpdate);
  }, []);

  const calculateStrikeRate = (score, balls) => {
    if (balls === 0) return 0;
    return ((score / balls) * 100).toFixed(2);
  };

  const calculateEconomy = (runs, balls) => {
    if (balls === 0) return 0;
    const overs = Math.floor(balls / 6) + (balls % 6) / 10;
    return (runs / overs / 2).toFixed(2);
  };

  const formatOvers = (balls) => {
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return `${overs}.${remainingBalls}`;
  };

  const handleBatterChange = (index, value) => {
    const updatedBatters = [...selectedBatters];
    updatedBatters[index] = value;
    setSelectedBatters(updatedBatters);

    setPlayerStats((prev) => ({
      ...prev,
      [value]: prev[value] || {
        ballsFaced: 0,
        score: 0,
        fours: 0,
        sixes: 0,
      },
    }));

    // Remove selected batter from available batters
    setAvailableBatters((prev) => prev.filter((p) => p !== value));

    if (updatedBatters.every(batter => batter !== '')) {
      setShowInitialDropdowns(false);
      // Dispatch event when both batters are selected
      const event = new CustomEvent('battersSelected');
      window.dispatchEvent(event);
    } else {
      // Dispatch event when batters are not fully selected
      const event = new CustomEvent('battersNotSelected');
      window.dispatchEvent(event);
    }
  };

  const handleNewBatterSelection = (newBatter) => {
    if (outBatterIndex === null) return;

    const updatedBatters = [...selectedBatters];
    const oldBatter = updatedBatters[outBatterIndex];
    updatedBatters[outBatterIndex] = newBatter;
    setSelectedBatters(updatedBatters);

    setPlayerStats((prev) => ({
      ...prev,
      [newBatter]: prev[newBatter] || {
        ballsFaced: 0,
        score: 0,
        fours: 0,
        sixes: 0,
      },
    }));

    // Remove new batter from available batters
    setAvailableBatters((prev) => prev.filter((p) => p !== newBatter));

    setShowNewBatterDropdown(false);
    setOutBatterIndex(null);

    // Dispatch event when new batter is selected
    const event = new CustomEvent('battersSelected');
    window.dispatchEvent(event);
  };

  const handleBowlerChange = (value) => {
    setSelectedBowler(value);
    setShowBowlerSelection(false);
    
    // Initialize bowler stats if not exists
    setAllBowlerStats(prev => ({
      ...prev,
      [value]: prev[value] || {
        runsGiven: 0,
        ballsBowled: 0,
        wickets: 0,
        dots: 0
      }
    }));

    // Notify that bowler is selected
    const event = new CustomEvent('bowlerSelected');
    window.dispatchEvent(event);
  };

  const handleTeamSwitch = () => {
    if (wickets >= battingPlayers.length - 2) {
      // Switch teams
      const newBattingTeamKey = battingTeamKey === 'team1Data' ? 'team2Data' : 'team1Data';
      const newBowlingTeamKey = newBattingTeamKey === 'team1Data' ? 'team2Data' : 'team1Data';
      
      setBattingTeamKey(newBattingTeamKey);
      setBowlingTeamKey(newBowlingTeamKey);
      setBattingPlayers(newBattingTeamKey === 'team1Data' ? team1Data.players : team2Data.players);
      setBowlingPlayers(newBowlingTeamKey === 'team1Data' ? team1Data.players : team2Data.players);
      
      // Reset all stats for the new innings
      setSelectedBatters(['', '']);
      setSelectedBowler('');
      setPlayerStats({});
      setAllBowlerStats({});
      setAvailableBatters(newBattingTeamKey === 'team1Data' ? team1Data.players : team2Data.players);
      setShowInitialDropdowns(true);
      setShowNewBatterDropdown(false);
      setOutBatterIndex(null);
      setStrikerIndex(0);
      setShowBowlerSelection(false);
      setBallsBowled(0);
    }
  };

  return (
    <div className="core-container">
      <div className="team-headers">
        <button 
          className={`team-button ${battingTeamKey === 'team1Data' ? 'active' : ''}`}
          onClick={() => {
            if (battingTeamKey === 'team2Data') {
              alert('Team 1 is yet to bat');
              return;
            }
            if (!battingTeamKey) {
              setBattingTeamKey('team1Data');
              setBowlingTeamKey('team2Data');
              setBattingPlayers(team1Data.players || []);
              setBowlingPlayers(team2Data.players || []);
              setAvailableBatters(team1Data.players || []);
            }
          }}
        >
          <h1>{team1Data.teamName || 'Team 1'}</h1>
        </button>
        <button 
          className={`team-button ${battingTeamKey === 'team2Data' ? 'active' : ''}`}
          onClick={() => {
            if (battingTeamKey === 'team1Data') {
              alert('Team 2 is yet to bat');
              return;
            }
            if (!battingTeamKey) {
              setBattingTeamKey('team2Data');
              setBowlingTeamKey('team1Data');
              setBattingPlayers(team2Data.players || []);
              setBowlingPlayers(team1Data.players || []);
              setAvailableBatters(team2Data.players || []);
            }
          }}
        >
          <h1>{team2Data.teamName || 'Team 2'}</h1>
        </button>
      </div>

      {battingTeamKey && (
        <>
          <div style={{display:'flex',gap:'300px'}}>
            <h2>Batting Team: {battingTeamKey === 'team1Data' ? team1Data.teamName || 'Team 1' : team2Data.teamName || 'Team 2'}</h2>
            <h2>Bowling Team: {battingTeamKey === 'team1Data' ? team2Data.teamName || 'Team 2' : team1Data.teamName || 'Team 1'}</h2>
          </div>
          
          <h3>Batters</h3>
          {showInitialDropdowns && (
            <div className="dropdowns">
              {[0, 1].map((i) => (
                <select
                  key={i}
                  value={selectedBatters[i]}
                  onChange={(e) => handleBatterChange(i, e.target.value)}
                >
                  <option value="">-- Select Batter {i + 1} --</option>
                  {battingPlayers
                    .filter(
                      (player) =>
                        !selectedBatters.includes(player) || selectedBatters[i] === player
                    )
                    .map((player, idx) => (
                      <option key={idx} value={player}>
                        {player}
                      </option>
                    ))}
                </select>
              ))}
            </div>
          )}

          {showNewBatterDropdown && (
            <div className="new-batter-dropdown">
              <select
                onChange={(e) => handleNewBatterSelection(e.target.value)}
              >
                <option value="">-- Select New Batter --</option>
                {availableBatters.map((batter, index) => (
                  <option key={index} value={batter}>
                    {batter}
                  </option>
                ))}
              </select>
            </div>
          )}

          <h3>Batting Stats</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Balls Faced</th>
                <th>Score</th>
                <th>4s</th>
                <th>6s</th>
                <th>Strike Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(playerStats).map(([player, stats]) => {
                const isCurrentBatter = selectedBatters.includes(player);
                const isStriker = selectedBatters[strikerIndex] === player;
                const isOut = !isCurrentBatter && stats.ballsFaced > 0;
                
                return (
                  <tr 
                    key={player} 
                    className={`
                      ${isCurrentBatter ? 'active-batter' : ''} 
                      ${isStriker ? 'striker' : ''}
                      ${isOut ? 'out-batter' : ''}
                    `}
                  >
                    <td>{player}</td>
                    <td>{stats.ballsFaced || 0}</td>
                    <td>{stats.score || 0}</td>
                    <td>{stats.fours || 0}</td>
                    <td>{stats.sixes || 0}</td>
                    <td>{calculateStrikeRate(stats.score || 0, stats.ballsFaced || 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3>Bowler</h3>
          {showBowlerSelection ? (
            <select
              value={selectedBowler}
              onChange={(e) => handleBowlerChange(e.target.value)}
            >
              <option value="">-- Select New Bowler --</option>
              {bowlingPlayers
                .filter(player => player !== selectedBowler)
                .map((player, idx) => (
                  <option key={idx} value={player}>
                    {player}
                  </option>
                ))}
            </select>
          ) : (
            <select
              value={selectedBowler}
              onChange={(e) => handleBowlerChange(e.target.value)}
            >
              <option value="">-- Select Bowler --</option>
              {bowlingPlayers.map((player, idx) => (
                <option key={idx} value={player}>
                  {player}
                </option>
              ))}
            </select>
          )}

          <h3>Bowling Stats</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Bowler Name</th>
                <th>Overs</th>
                <th>Economy</th>
                <th>Wickets</th>
                <th>Dots</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(allBowlerStats).map(([bowler, stats]) => (
                <tr key={bowler} className={bowler === selectedBowler ? 'active-bowler' : ''}>
                  <td>{bowler}</td>
                  <td>{formatOvers(stats.ballsBowled || 0)}</td>
                  <td>{calculateEconomy(stats.runsGiven || 0, stats.ballsBowled || 0)}</td>
                  <td>{stats.wickets || 0}</td>
                  <td>{stats.dots || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Core;
