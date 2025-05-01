import { useState } from 'react'
import PropTypes from 'prop-types'
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { formatDate } from '../../utils/formatters'

function TeamList({ teams, onEditTeam, onDeleteTeam }) {
  const [expandedTeam, setExpandedTeam] = useState(null)

  const toggleExpand = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId)
  }

  const confirmDelete = (team) => {
    if (window.confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
      onDeleteTeam(team.id)
    }
  }

  return (
    <div className="space-y-4">
      {teams.map(team => (
        <div key={team.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div 
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={() => toggleExpand(team.id)}
          >
            <div>
              <h3 className="font-bold text-lg">{team.name}</h3>
              <div className="text-sm text-gray-500">
                {team.players?.length || 0} players • Created {formatDate(team.createdAt)}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onEditTeam(team)
                }}
                className="text-blue-600 hover:text-blue-800 p-1"
                aria-label={`Edit ${team.name}`}
              >
                <FaEdit />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  confirmDelete(team)
                }}
                className="text-red-600 hover:text-red-800 p-1"
                aria-label={`Delete ${team.name}`}
              >
                <FaTrash />
              </button>
              
              {expandedTeam === team.id ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
          </div>
          
          {expandedTeam === team.id && team.players?.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <h4 className="font-medium mb-2">Players:</h4>
              <div className="bg-gray-50 rounded-md">
                <div className="grid grid-cols-12 gap-2 p-3 font-medium text-sm border-b border-gray-200">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Name</div>
                  <div className="col-span-3">Batting</div>
                  <div className="col-span-3">Bowling</div>
                </div>
                
                {team.players.map((player, index) => (
                  <div 
                    key={player.id} 
                    className={`grid grid-cols-12 gap-2 p-3 text-sm ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-5">{player.name}</div>
                    <div className="col-span-3">{player.batting}</div>
                    <div className="col-span-3">{player.bowling || 'None'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

TeamList.propTypes = {
  teams: PropTypes.array.isRequired,
  onEditTeam: PropTypes.func.isRequired,
  onDeleteTeam: PropTypes.func.isRequired
}

export default TeamList