import React, { useState, useEffect } from 'react';
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

    const handleWicketFallen = () => {
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
    window.addEventListener('wicketFallen', handleWicketFallen);
    window.addEventListener('overComplete', handleOverComplete);
    window.addEventListener('toggleStriker', handleToggleStriker);
    window.addEventListener('updateBowlerStats', handleUpdateBowlerStats);

    return () => {
      window.removeEventListener('scoreUpdate', handleScoreUpdate);
      window.removeEventListener('specialUpdate', handleSpecialUpdate);
      window.removeEventListener('wicketFallen', handleWicketFallen);
      window.removeEventListener('overComplete', handleOverComplete);
      window.removeEventListener('toggleStriker', handleToggleStriker);
      window.removeEventListener('updateBowlerStats', handleUpdateBowlerStats);
    };
  }, [selectedBatters, strikerIndex, selectedBowler]);

  const calculateStrikeRate = (score, balls) => {
    if (balls === 0) return 0;
    return ((score / balls) * 100).toFixed(2);
  };

  const calculateEconomy = (runs, balls) => {
    if (balls === 0) return 0;
    return ((runs / balls) * 6).toFixed(2);
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

    setAvailableBatters((prev) => prev.filter((p) => p !== value));

    if (updatedBatters.every(batter => batter !== '')) {
      setShowInitialDropdowns(false);
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

    setAvailableBatters((prev) => {
      const newAvailable = [...prev];
      if (oldBatter) {
        newAvailable.push(oldBatter);
      }
      return newAvailable.filter((p) => p !== newBatter);
    });

    setShowNewBatterDropdown(false);
    setOutBatterIndex(null);
  };

  const handleBowlerChange = (value) => {
    setSelectedBowler(value);
    setShowBowlerSelection(false);
  };

  return (
    <div className="core-container">
      {!battingTeamKey && (
        <select
          value={battingTeamKey}
          onChange={(e) => setBattingTeamKey(e.target.value)}
        >
          <option value="">-- Select Batting Team --</option>
          <option value="team1Data">Team 1</option>
          <option value="team2Data">Team 2</option>
        </select>
      )}

      {battingTeamKey && (
        <>
          <div style={{display:'flex',gap:'300px'}}>
            <h2>Batting Team: {battingTeamKey === 'team1Data' ? 'Team 1' : 'Team 2'}</h2>
            <h2>Bowling Team: {battingTeamKey === 'team1Data' ? 'Team 2' : 'Team 1'}</h2>
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
              {selectedBatters.map((player, idx) =>
                player && (
                  <tr key={idx} className={idx === strikerIndex ? 'striker' : ''}>
                    <td>{player}</td>
                    <td>{playerStats[player]?.ballsFaced || 0}</td>
                    <td>{playerStats[player]?.score || 0}</td>
                    <td>{playerStats[player]?.fours || 0}</td>
                    <td>{playerStats[player]?.sixes || 0}</td>
                    <td>{calculateStrikeRate(playerStats[player]?.score || 0, playerStats[player]?.ballsFaced || 0)}</td>
                  </tr>
                )
              )}
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
