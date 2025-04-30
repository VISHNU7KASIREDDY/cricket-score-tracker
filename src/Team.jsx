// Team.js
import React, { useState, useEffect } from 'react';

function Team({ teamKey, onTeamData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState(['']);
  const [submittedTeam, setSubmittedTeam] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedTeam = localStorage.getItem(teamKey);
    if (savedTeam) {
      const parsed = JSON.parse(savedTeam);
      setSubmittedTeam(parsed);
    }
  }, [teamKey]);

  useEffect(() => {
    if (submittedTeam) {
      localStorage.setItem(teamKey, JSON.stringify(submittedTeam));
      onTeamData(submittedTeam);
    }
  }, [submittedTeam, teamKey, onTeamData]);

  const openModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTeamName('');
    setPlayers(['']);
    setError('');
  };

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
    setError('');
  };

  const addPlayerInput = () => {
    const trimmedPlayers = players.map(p => p.trim());
    const hasEmpty = trimmedPlayers.some(p => p === '');
    const uniquePlayers = new Set(trimmedPlayers);

    if (hasEmpty) {
      setError('All player names must be filled before adding a new one.');
      return;
    }

    if (uniquePlayers.size !== trimmedPlayers.length) {
      setError('Player names must be unique before adding a new one.');
      return;
    }

    if (players.length >= 11) {
      setError('You can add at most 11 players.');
      return;
    }

    setPlayers([...players, '']);
    setError('');
  };

  const handleSubmit = () => {
    const trimmedPlayers = players.map(p => p.trim());
    const hasEmpty = trimmedPlayers.some(p => p === '');
    const uniquePlayers = new Set(trimmedPlayers);

    if (teamName.trim() === '') {
      setError('Team name cannot be empty.');
      return;
    }

    if (hasEmpty) {
      setError('All player names must be filled.');
      return;
    }

    if (uniquePlayers.size !== trimmedPlayers.length) {
      setError('Player names must be unique.');
      return;
    }

    const cleanPlayers = trimmedPlayers.filter(name => name !== '');
    setSubmittedTeam({ teamName: teamName.trim(), players: cleanPlayers });
    closeModal();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPlayerInput();
    }
  };

  const removePlayer = (index) => {
    const updated = [...players];
    updated.splice(index, 1);
    setPlayers(updated);
  };

  const handleEditTeam = () => {
    if (submittedTeam) {
      setTeamName(submittedTeam.teamName);
      setPlayers(submittedTeam.players);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  return (
    <div style={styles.container}>
      {!submittedTeam && (
        <button onClick={openModal} style={styles.mainButton}>Add Team</button>
      )}

      {submittedTeam && (
        <div style={styles.teamCard}>
          <h2>Team: {submittedTeam.teamName}</h2>
          <div style={styles.playerButtonWrap}>
            {submittedTeam.players.map((p, index) => (
              <button key={index} style={styles.playerButton}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={handleEditTeam} style={styles.editButton}>Edit Team</button>
        </div>
      )}

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>{isEditMode ? 'Edit Team' : 'Add New Team'}</h2>
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={styles.input}
            />

            <h3>Players:</h3>
            <div style={styles.playersWrap}>
              {players.map((player, index) => (
                <div key={index} style={styles.playerRow}>
                  <span style={styles.playerNumber}>{index + 1}.</span>
                  <input
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    value={player}
                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={styles.inputField}
                  />
                  {players.length > 1 && (
                    <button onClick={() => removePlayer(index)} style={styles.removeBtn}>✕</button>
                  )}
                </div>
              ))}
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            <button
              onClick={addPlayerInput}
              style={styles.button}
              disabled={players.length >= 11}
            >
              Add Player
            </button>

            <div style={styles.buttonRow}>
              <button onClick={handleSubmit} style={styles.submit}>Submit</button>
              <button onClick={closeModal} style={styles.cancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '100vw',
    overflowX: 'hidden'
  },
  mainButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%'
  },
  teamCard: {
    background: '#f1f1f1',
    padding: '1rem',
    borderRadius: '8px',
    maxWidth: '400px'
  },
  playerButtonWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  playerButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e0e0e0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'default',
    width: '100%'
  },
  editButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    width: '100%'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
    padding: '1rem',
    boxSizing: 'border-box'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '500px',
    height: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    margin: '0.5rem 0',
    boxSizing: 'border-box'
  },
  playersWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  playerRow: {
    display: 'flex',
    alignItems: 'center'
  },
  playerNumber: {
    marginRight: '0.5rem',
    fontWeight: 'bold'
  },
  inputField: {
    flex: 1,
    padding: '0.5rem'
  },
  removeBtn: {
    marginLeft: '0.5rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    padding: '0.3rem 0.5rem'
  },
  errorText: {
    color: 'red',
    margin: '0.5rem 0'
  },
  button: {
    margin: '0.5rem 0',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    width: '100%'
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  submit: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    width: '100%'
  },
  cancel: {
    backgroundColor: '#777',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    width: '100%'
  }
};

export default Team;
