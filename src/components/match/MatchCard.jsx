import PropTypes from 'prop-types'
import { formatDate } from '../../utils/formatters'

function MatchCard({ match, onAction, actionText }) {
  const getMatchStatus = () => {
    switch (match.status) {
      case 'pending':
        return 'Not Started'
      case 'in_progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      default:
        return match.status
    }
  }

  const getScoreSummary = () => {
    if (!match.innings || match.innings.length === 0) {
      return 'No score data available'
    }

    return match.innings.map((inning, index) => (
      <div key={index} className="mb-1">
        <span className="font-medium">{inning.battingTeam}:</span> {inning.runs}/{inning.wickets} 
        ({inning.overs.toFixed(1)} ov)
      </div>
    ))
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="bg-cricket-field text-white py-3 px-4 flex justify-between items-center">
        <h3 className="font-semibold text-lg">{match.format} Match</h3>
        <span className="px-2 py-1 bg-white text-cricket-field text-xs font-medium rounded-full">
          {getMatchStatus()}
        </span>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="font-medium">{match.team1} vs {match.team2}</div>
          <div className="text-sm text-gray-500">{formatDate(match.createdAt)}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          {getScoreSummary()}
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <div>Overs: {match.overs}</div>
          <div>First Batting: {match.firstBattingTeam}</div>
          {match.location && <div>Venue: {match.location}</div>}
        </div>
        
        <button 
          onClick={onAction} 
          className="btn btn-primary w-full"
        >
          {actionText}
        </button>
      </div>
    </div>
  )
}

MatchCard.propTypes = {
  match: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired,
  actionText: PropTypes.string.isRequired
}

export default MatchCard