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
  const [bowlerStats, setBowlerStats] = useState({});
  const [availableBatters, setAvailableBatters] = useState([]);
  const [showInitialDropdowns, setShowInitialDropdowns] = useState(true);
  const [showNewBatterDropdown, setShowNewBatterDropdown] = useState(false);
  const [outBatterIndex, setOutBatterIndex] = useState(null);

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
    setBowlerStats({
      overs: 0,
      economy: 0,
      wickets: 0,
      dots: 0,
    });
  };

  const handleWicket = (batterIndex) => {
    setShowNewBatterDropdown(true);
    setOutBatterIndex(batterIndex);
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
              </tr>
            </thead>
            <tbody>
              {selectedBatters.map((player, idx) =>
                player && (
                  <tr key={idx}>
                    <td>{player}</td>
                    <td>{playerStats[player]?.ballsFaced || 0}</td>
                    <td>{playerStats[player]?.score || 0}</td>
                    <td>{playerStats[player]?.fours || 0}</td>
                    <td>{playerStats[player]?.sixes || 0}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <h3>Bowler</h3>
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

          {selectedBowler && (
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
                <tr>
                  <td>{selectedBowler}</td>
                  <td>{bowlerStats.overs}</td>
                  <td>{bowlerStats.economy}</td>
                  <td>{bowlerStats.wickets}</td>
                  <td>{bowlerStats.dots}</td>
                </tr>
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default Core;
