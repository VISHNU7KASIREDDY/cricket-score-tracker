import { useState } from 'react'
import { useMatch } from '../context/MatchContext'
import TeamForm from '../components/team/TeamForm'
import TeamList from '../components/team/TeamList'

function TeamsPage() {
  const { teams, addTeam, updateTeam, deleteTeam } = useMatch()
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleAddTeam = () => {
    setSelectedTeam(null)
    setIsFormOpen(true)
  }

  const handleEditTeam = (team) => {
    setSelectedTeam(team)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedTeam(null)
  }

  const handleFormSubmit = (formData) => {
    if (selectedTeam) {
      updateTeam(selectedTeam.id, formData)
    } else {
      addTeam(formData)
    }
    setIsFormOpen(false)
    setSelectedTeam(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-gray-600">Manage your cricket teams and players</p>
        </div>
        <button 
          className="btn btn-primary mt-4 md:mt-0"
          onClick={handleAddTeam}
        >
          Add New Team
        </button>
      </div>
      
      {isFormOpen && (
        <TeamForm 
          team={selectedTeam}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      )}
      
      {teams.length > 0 ? (
        <TeamList 
          teams={teams} 
          onEditTeam={handleEditTeam}
          onDeleteTeam={deleteTeam}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Teams Yet</h2>
          <p className="text-gray-600 mb-4">
            Start by creating your first cricket team to begin scoring matches.
          </p>
          <button 
            className="btn btn-primary"
            onClick={handleAddTeam}
          >
            Create Team
          </button>
        </div>
      )}
    </div>
  )
}

export default TeamsPage