import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaCheck, FaTimes } from 'react-icons/fa'

function ScoreboardHeader({ match, onEndMatch }) {
  const [animateScore, setAnimateScore] = useState(false)
  const [prevScore, setPrevScore] = useState(0)
  
  const currentInningsIdx = match?.currentInnings ? match.currentInnings - 1 : 0
  const currentInnings = match?.innings?.[currentInningsIdx]
  
  useEffect(() => {
    if (currentInnings && currentInnings.runs !== prevScore) {
      setPrevScore(currentInnings.runs)
      setAnimateScore(true)
      
      const timer = setTimeout(() => {
        setAnimateScore(false)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [currentInnings, prevScore])
  
  if (!match || !currentInnings) {
    return <div>Loading...</div>
  }
  
  const getRunRate = () => {
    if (currentInnings.overs === 0) return '0.00'
    return (currentInnings.runs / currentInnings.overs).toFixed(2)
  }
  
  const getRequiredRuns = () => {
    if (match.innings.length < 2) return null
    
    const firstInningsRuns = match.innings[0].runs
    const secondInningsRuns = match.innings[1].runs
    
    return firstInningsRuns - secondInningsRuns
  }
  
  const requiredRuns = getRequiredRuns()
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-cricket-field text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {match.team1} vs {match.team2}
          </h2>
          <button
            onClick={onEndMatch}
            className="btn bg-white text-cricket-field hover:bg-gray-100 text-sm"
          >
            End Match
          </button>
        </div>
        <div className="text-sm mt-1">
          {match.format} • {match.overs} overs • {match.location || 'No venue specified'}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{currentInnings.battingTeam}</h3>
              <div 
                className={`text-2xl font-bold ${animateScore ? 'score-change' : ''}`}
              >
                {currentInnings.runs}/{currentInnings.wickets}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div>Overs: {currentInnings.overs.toFixed(1)}</div>
              <div>Run Rate: {getRunRate()}</div>
            </div>
          </div>
          
          {match.innings.length > 1 && (
            <div className="flex-1 bg-gray-50 p-3 rounded-lg ml-0 md:ml-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">
                  {requiredRuns > 0 
                    ? `${requiredRuns} runs needed` 
                    : requiredRuns === 0 
                      ? 'Scores level' 
                      : `Target achieved!`}
                </h3>
                <div className="flex items-center">
                  {requiredRuns <= 0 ? (
                    <span className="text-green-600 flex items-center">
                      <FaCheck className="mr-1" /> Won
                    </span>
                  ) : currentInnings.wickets >= 10 || 
                      (currentInnings.overs >= match.overs && requiredRuns > 0) ? (
                    <span className="text-red-600 flex items-center">
                      <FaTimes className="mr-1" /> Lost
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="text-sm">
                {requiredRuns > 0 && (
                  <>
                    <div>
                      Remaining overs: {(match.overs - currentInnings.overs).toFixed(1)}
                    </div>
                    <div>
                      Required rate: {
                        currentInnings.overs >= match.overs 
                          ? 'N/A' 
                          : (requiredRuns / (match.overs - currentInnings.overs)).toFixed(2)
                      }
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ScoreboardHeader.propTypes = {
  match: PropTypes.object.isRequired,
  onEndMatch: PropTypes.func.isRequired
}

export default ScoreboardHeader