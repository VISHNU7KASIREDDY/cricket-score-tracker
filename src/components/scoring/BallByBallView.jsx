import PropTypes from 'prop-types'

function BallByBallView({ match }) {
  if (!match || !match.innings || match.innings.length === 0) {
    return <div>No innings data available</div>
  }
  
  const getOverNumber = (ballIndex, innings) => {
    return Math.floor(ballIndex / 6) + 1
  }
  
  const getBallDisplay = (ball) => {
    if (ball.isWicket) {
      return <span className="font-bold text-cricket-ball">W</span>
    }
    
    if (ball.wides > 0) {
      return `${ball.wides + ball.runs}WD`
    }
    
    if (ball.noBall) {
      return `${ball.runs}NB`
    }
    
    if (ball.byes > 0) {
      return `${ball.byes}B`
    }
    
    if (ball.legByes > 0) {
      return `${ball.legByes}LB`
    }
    
    return ball.runs
  }
  
  return (
    <div className="space-y-6">
      {match.innings.map((inning, inningIndex) => (
        <div key={inningIndex}>
          <h3 className="text-lg font-bold mb-3">
            {inning.battingTeam} Innings
          </h3>
          
          {inning.ballByBall && inning.ballByBall.length > 0 ? (
            <div>
              {Array.from({ length: Math.ceil(inning.ballByBall.length / 6) }).map((_, overIndex) => {
                const overBalls = inning.ballByBall.slice(overIndex * 6, (overIndex + 1) * 6)
                const overRuns = overBalls.reduce((total, ball) => 
                  total + ball.runs + (ball.extras || 0), 0)
                  
                const overWickets = overBalls.filter(ball => ball.isWicket).length
                
                return (
                  <div key={overIndex} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Over {overIndex + 1}</h4>
                      <div className="text-sm">
                        {overRuns} runs, {overWickets} wicket{overWickets !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-6 gap-2">
                        {overBalls.map((ball, ballIndex) => (
                          <div
                            key={ballIndex}
                            className={`text-center p-2 rounded-md ${
                              ball.isWicket 
                                ? 'bg-cricket-ball text-white'
                                : ball.runs === 4
                                  ? 'bg-blue-500 text-white'
                                  : ball.runs === 6
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white'
                            }`}
                          >
                            {getBallDisplay(ball)}
                          </div>
                        ))}
                        
                        {/* Fill in empty slots to complete the over */}
                        {Array.from({ length: 6 - overBalls.length }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="text-center p-2 bg-gray-200 rounded-md">
                            -
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No ball-by-ball data available
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

BallByBallView.propTypes = {
  match: PropTypes.object.isRequired
}

export default BallByBallView