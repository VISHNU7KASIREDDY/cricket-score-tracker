import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMatch } from '../context/MatchContext'
import { FaTrophy, FaArrowLeft } from 'react-icons/fa'
import BattingScorecard from '../components/scoring/BattingScorecard'
import BowlingScorecard from '../components/scoring/BowlingScorecard'

function MatchSummaryPage() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { matches } = useMatch()
  
  const [match, setMatch] = useState(null)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const matchData = matches.find(m => m.id === matchId)
    
    if (!matchData) {
      setError('Match not found')
      return
    }
    
    if (matchData.status !== 'completed') {
      navigate(`/score/${matchId}`)
    }
    
    setMatch(matchData)
  }, [matchId, matches, navigate])
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Back to Home
        </button>
      </div>
    )
  }
  
  if (!match) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-cricket-field"></div>
          <div className="mt-4 text-lg">Loading match summary...</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-cricket-field hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to Home
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-cricket-field text-white p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {match.team1} vs {match.team2}
          </h1>
          <p className="text-lg mb-4">
            {match.format} Match • {match.overs} overs • {match.location || 'No venue'}
          </p>
          <div className="flex items-center justify-center">
            <FaTrophy className="text-yellow-400 mr-2 text-xl" />
            <span className="text-xl">{match.result || 'Match Completed'}</span>
          </div>
        </div>
        
        {match.innings.length > 0 && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {match.innings.map((inning, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <h3 className="font-bold text-lg mb-2">{inning.battingTeam}</h3>
                  <div className="text-3xl font-bold mb-2">
                    {inning.runs}/{inning.wickets}
                  </div>
                  <div className="text-gray-600">
                    {inning.overs.toFixed(1)} overs • Run Rate: {
                      inning.overs > 0 
                        ? (inning.runs / inning.overs).toFixed(2) 
                        : '0.00'
                    }
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
                  Batting Statistics
                </h2>
                <BattingScorecard match={match} />
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
                  Bowling Statistics
                </h2>
                <BowlingScorecard match={match} />
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
                  Match Information
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Match Date:</strong> {new Date(match.createdAt).toLocaleDateString()}</p>
                      <p><strong>Venue:</strong> {match.location || 'Not specified'}</p>
                      <p><strong>Format:</strong> {match.format}</p>
                    </div>
                    <div>
                      <p><strong>Started:</strong> {new Date(match.startedAt).toLocaleTimeString()}</p>
                      <p><strong>Ended:</strong> {new Date(match.endedAt).toLocaleTimeString()}</p>
                      <p>
                        <strong>Duration:</strong> {
                          Math.round((new Date(match.endedAt) - new Date(match.startedAt)) / (1000 * 60))
                        } minutes
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchSummaryPage