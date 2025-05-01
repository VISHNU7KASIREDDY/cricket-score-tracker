import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMatch } from '../context/MatchContext'
import MatchCard from '../components/match/MatchCard'
import { formatDate } from '../utils/formatters'

function HistoryPage() {
  const { matches } = useMatch()
  const navigate = useNavigate()
  
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  useEffect(() => {
    let filtered = [...matches]
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(match => match.status === filterStatus)
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(match => 
        match.team1.toLowerCase().includes(term) || 
        match.team2.toLowerCase().includes(term) || 
        (match.location && match.location.toLowerCase().includes(term))
      )
    }
    
    // Sort by date
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    setFilteredMatches(filtered)
  }, [matches, searchTerm, filterStatus])
  
  const handleViewMatchSummary = (matchId) => {
    navigate(`/summary/${matchId}`)
  }
  
  const handleContinueScoring = (matchId) => {
    navigate(`/score/${matchId}`)
  }
  
  // Group matches by month
  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const date = new Date(match.createdAt)
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
    
    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    
    groups[monthYear].push(match)
    return groups
  }, {})
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Match History</h1>
        <p className="text-gray-600">View and manage your cricket match records</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by team or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input"
            >
              <option value="all">All Matches</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="pending">Not Started</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredMatches.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Matches Found</h2>
          <p className="text-gray-600 mb-4">
            {matches.length === 0 
              ? "You haven't created any matches yet." 
              : "No matches match your search criteria."}
          </p>
          {matches.length === 0 && (
            <button 
              onClick={() => navigate('/new-match')}
              className="btn btn-primary"
            >
              Create Match
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMatches).map(([monthYear, monthMatches]) => (
            <div key={monthYear}>
              <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
                {monthYear}
              </h2>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {monthMatches.map(match => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onAction={() => 
                      match.status === 'completed' 
                        ? handleViewMatchSummary(match.id) 
                        : handleContinueScoring(match.id)
                    } 
                    actionText={
                      match.status === 'completed' 
                        ? 'View Summary' 
                        : 'Continue Scoring'
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPage