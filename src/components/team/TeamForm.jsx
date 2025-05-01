import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaPlus, FaTimes, FaSort } from 'react-icons/fa'

function TeamForm({ team, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    players: []
  })

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    batting: 'Right Hand',
    bowling: 'None'
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        players: team.players || []
      })
    }
  }, [team])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handlePlayerInputChange = (e) => {
    const { name, value } = e.target
    setNewPlayer({ ...newPlayer, [name]: value })
  }

  const addPlayer = () => {
    if (!newPlayer.name.trim()) {
      return
    }

    const updatedPlayers = [
      ...formData.players,
      { ...newPlayer, id: Date.now().toString() }
    ]

    setFormData({ ...formData, players: updatedPlayers })
    setNewPlayer({
      name: '',
      batting: 'Right Hand',
      bowling: 'None'
    })
  }

  const removePlayer = (playerId) => {
    const updatedPlayers = formData.players.filter(
      player => player.id !== playerId
    )
    setFormData({ ...formData, players: updatedPlayers })
  }

  const movePlayerUp = (index) => {
    if (index === 0) return

    const updatedPlayers = [...formData.players]
    const temp = updatedPlayers[index]
    updatedPlayers[index] = updatedPlayers[index - 1]
    updatedPlayers[index - 1] = temp

    setFormData({ ...formData, players: updatedPlayers })
  }

  const movePlayerDown = (index) => {
    if (index === formData.players.length - 1) return

    const updatedPlayers = [...formData.players]
    const temp = updatedPlayers[index]
    updatedPlayers[index] = updatedPlayers[index + 1]
    updatedPlayers[index + 1] = temp

    setFormData({ ...formData, players: updatedPlayers })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required'
    }
    
    if (formData.players.length < 2) {
      newErrors.players = 'At least 2 players are required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        {team ? 'Edit Team' : 'Create New Team'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="form-label">Team Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`form-input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter team name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="form-label mb-0">Players</label>
            <span className="text-sm text-gray-500">
              {formData.players.length} players added
            </span>
          </div>
          
          {errors.players && (
            <p className="text-red-500 text-sm mb-2">{errors.players}</p>
          )}
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-12 gap-2 mb-2 font-medium text-sm text-gray-600">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Batting</div>
              <div className="col-span-3">Bowling</div>
              <div className="col-span-1"></div>
            </div>
            
            {formData.players.length > 0 ? (
              <div className="space-y-2">
                {formData.players.map((player, index) => (
                  <div key={player.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 flex items-center space-x-1">
                      <span className="font-medium">{index + 1}</span>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => movePlayerUp(index)}
                          className="text-gray-500 hover:text-gray-700 text-xs"
                          aria-label="Move player up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => movePlayerDown(index)}
                          className="text-gray-500 hover:text-gray-700 text-xs"
                          aria-label="Move player down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                    <div className="col-span-5">{player.name}</div>
                    <div className="col-span-2 text-sm">{player.batting}</div>
                    <div className="col-span-3 text-sm">{player.bowling}</div>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => removePlayer(player.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove player"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No players added yet
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-3">Add New Player</h3>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-5">
                <input
                  type="text"
                  name="name"
                  value={newPlayer.name}
                  onChange={handlePlayerInputChange}
                  className="form-input"
                  placeholder="Player name"
                />
              </div>
              
              <div className="col-span-6 md:col-span-3">
                <select
                  name="batting"
                  value={newPlayer.batting}
                  onChange={handlePlayerInputChange}
                  className="form-input"
                >
                  <option value="Right Hand">Right Hand</option>
                  <option value="Left Hand">Left Hand</option>
                </select>
              </div>
              
              <div className="col-span-6 md:col-span-3">
                <select
                  name="bowling"
                  value={newPlayer.bowling}
                  onChange={handlePlayerInputChange}
                  className="form-input"
                >
                  <option value="None">None</option>
                  <option value="Right Arm Fast">Right Arm Fast</option>
                  <option value="Right Arm Medium">Right Arm Medium</option>
                  <option value="Right Arm Spin">Right Arm Spin</option>
                  <option value="Left Arm Fast">Left Arm Fast</option>
                  <option value="Left Arm Medium">Left Arm Medium</option>
                  <option value="Left Arm Spin">Left Arm Spin</option>
                </select>
              </div>
              
              <div className="col-span-12 md:col-span-1">
                <button
                  type="button"
                  onClick={addPlayer}
                  className="btn btn-primary w-full"
                  disabled={!newPlayer.name.trim()}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            {team ? 'Update Team' : 'Create Team'}
          </button>
        </div>
      </form>
    </div>
  )
}

TeamForm.propTypes = {
  team: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default TeamForm