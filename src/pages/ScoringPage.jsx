import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMatch } from '../context/MatchContext'
import ScoreboardHeader from '../components/scoring/ScoreboardHeader'
import ScoringControls from '../components/scoring/ScoringControls'
import BattingScorecard from '../components/scoring/BattingScorecard'
import BowlingScorecard from '../components/scoring/BowlingScorecard'
import BallByBallView from '../components/scoring/BallByBallView'

function ScoringPage() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { matches, currentMatch, setCurrentMatch, startMatch, recordBall, endMatch } = useMatch()
  
  const [activeTab, setActiveTab] = useState('scoring')
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const match = matches.find(m => m.id === matchId)
    
    if (!match) {
      setError('Match not found')
      return
    }
    
    if (match.status === 'pending') {
      startMatch(matchId)
    } else if (match.status === 'in_progress') {
      setCurrentMatch(match)
    } else if (match.status === 'completed') {
      navigate(`/summary/${matchId}`)
    }
  }, [matchId, matches, startMatch, setCurrentMatch, navigate])
  
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
  
  if (!currentMatch) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-cricket-field"></div>
          <div className="mt-4 text-lg">Loading match...</div>
        </div>
      </div>
    )
  }
  
  const handleEndMatch = () => {
    if (window.confirm('Are you sure you want to end this match?')) {
      // Determine the match result based on innings
      let result = 'Match Drawn'
      
      if (currentMatch.innings.length >= 2) {
        const firstInnings = currentMatch.innings[0]
        const secondInnings = currentMatch.innings[1]
        
        const team1 = firstInnings.battingTeam
        const team2 = secondInnings.battingTeam
        
        const team1Runs = firstInnings.runs
        const team2Runs = secondInnings.runs
        
        if (team1Runs > team2Runs) {
          result = `${team1} won by ${team1Runs - team2Runs} runs`
        } else if (team2Runs > team1Runs) {
          result = `${team2} won by ${10 - secondInnings.wickets} wickets`
        }
      } else if (currentMatch.innings.length === 1) {
        result = 'Match Ended (Incomplete)'
      }
      
      endMatch(matchId, result)
      navigate(`/summary/${matchId}`)
    }
  }
  
  return (
    <div className="space-y-6">
      <ScoreboardHeader match={currentMatch} onEndMatch={handleEndMatch} />
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-cricket-field text-white p-2 flex">
          <button
            className={`py-2 px-4 ${activeTab === 'scoring' ? 'bg-white text-cricket-field font-medium rounded-t-lg' : 'text-white'}`}
            onClick={() => setActiveTab('scoring')}
          >
            Scoring
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'batting' ? 'bg-white text-cricket-field font-medium rounded-t-lg' : 'text-white'}`}
            onClick={() => setActiveTab('batting')}
          >
            Batting
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'bowling' ? 'bg-white text-cricket-field font-medium rounded-t-lg' : 'text-white'}`}
            onClick={() => setActiveTab('bowling')}
          >
            Bowling
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'ball-by-ball' ? 'bg-white text-cricket-field font-medium rounded-t-lg' : 'text-white'}`}
            onClick={() => setActiveTab('ball-by-ball')}
          >
            Ball by Ball
          </button>
        </div>
        
        <div className="p-4">
          {activeTab === 'scoring' && (
            <ScoringControls 
              match={currentMatch} 
              recordBall={recordBall} 
              matchId={matchId}
            />
          )}
          
          {activeTab === 'batting' && (
            <BattingScorecard match={currentMatch} />
          )}
          
          {activeTab === 'bowling' && (
            <BowlingScorecard match={currentMatch} />
          )}
          
          {activeTab === 'ball-by-ball' && (
            <BallByBallView match={currentMatch} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ScoringPage