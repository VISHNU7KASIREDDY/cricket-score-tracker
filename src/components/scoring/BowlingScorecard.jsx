import PropTypes from 'prop-types'

function BowlingScorecard({ match }) {
  if (!match || !match.innings || match.innings.length === 0) {
    return <div>No innings data available</div>
  }
  
  return (
    <div className="space-y-6">
      {match.innings.map((inning, index) => {
        const bowlingTeamName = match.team1 === inning.battingTeam ? match.team2 : match.team1
        
        return (
          <div key={index}>
            <h3 className="text-lg font-bold mb-3">
              {bowlingTeamName} - Bowling
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Bowler</th>
                    <th className="py-2 px-4 text-right">O</th>
                    <th className="py-2 px-4 text-right">M</th>
                    <th className="py-2 px-4 text-right">R</th>
                    <th className="py-2 px-4 text-right">W</th>
                    <th className="py-2 px-4 text-right">Econ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inning.bowlingFigures && inning.bowlingFigures.length > 0 ? (
                    inning.bowlingFigures.map((bowler, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-4">{bowler.name}</td>
                        <td className="py-2 px-4 text-right">
                          {Math.floor(bowler.balls / 6)}.{bowler.balls % 6}
                        </td>
                        <td className="py-2 px-4 text-right">{bowler.maidens || 0}</td>
                        <td className="py-2 px-4 text-right">{bowler.runs}</td>
                        <td className="py-2 px-4 text-right font-medium">{bowler.wickets}</td>
                        <td className="py-2 px-4 text-right">
                          {bowler.balls > 0 
                            ? ((bowler.runs / (bowler.balls / 6)) || 0).toFixed(2) 
                            : '0.00'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-gray-500">
                        No bowling data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

BowlingScorecard.propTypes = {
  match: PropTypes.object.isRequired
}

export default BowlingScorecard