import React from 'react';
import {useState} from "react";

function Team() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [players, setPlayers] = useState(['']);
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
      setIsModalOpen(false);
      setTeamName('');
      setPlayers(['']);
    };
  
    const handlePlayerChange = (index, value) => {
      const newPlayers = [...players];
      newPlayers[index] = value;
      setPlayers(newPlayers);
    };
  
    const addPlayerInput = () => {
      setPlayers([...players, '']);
    };
  
    const handleSubmit = () => {
      console.log('Team:', teamName);
      console.log('Players:', players.filter(p => p.trim() !== ''));
      closeModal();
    };
  
    return (
      <div style={{ padding: '2rem' }}>
        <button onClick={openModal}>Add Team</button>
  
        {isModalOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h2>Add New Team</h2>
              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                style={styles.input}
              />
  
              <h3>Players:</h3>
              {players.map((player, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Player ${index + 1}`}
                  value={player}
                  onChange={(e) => handlePlayerChange(index, e.target.value)}
                  style={styles.input}
                />
              ))}
  
              <button onClick={addPlayerInput} style={styles.button}>Add Player</button>
              <div style={styles.buttonRow}>
                <button onClick={handleSubmit} style={styles.submit}>Submit</button>
                <button onClick={closeModal} style={styles.cancel}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      width: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      margin: '0.5rem 0'
    },
    button: {
      margin: '0.5rem 0',
      padding: '0.5rem 1rem'
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem'
    },
    submit: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      cursor: 'pointer'
    },
    cancel: {
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      cursor: 'pointer'
    }
}

export default Team