import PropTypes from 'prop-types'

function BattingScorecard({ match }) {
  if (!match || !match.innings || match.innings.length === 0) {
    return <div>No innings data available</div>
  }
  
  return (
    <div className="space-y-6">
      {match.innings.map((inning, index) => (
        <div key={index}>
          <h3 className="text-lg font-bold mb-3">
            {inning.battingTeam} - {inning.runs}/{inning.wickets} ({inning.overs.toFixed(1)} overs)
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Batter</th>
                  <th className="py-2 px-4 text-right">Runs</th>
                  <th className="py-2 px-4 text-right">Balls</th>
                  <th className="py-2 px-4 text-right">4s</th>
                  <th className="py-2 px-4 text-right">6s</th>
                  <th className="py-2 px-4 text-right">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inning.battingScores && inning.battingScores.length > 0 ? (
                  inning.battingScores.map((batter, idx) => (
                    <tr key={idx} className={`${batter.isOut ? 'text-red-500' : ''}`}>
                      <td className="py-2 px-4">{batter.name}</td>
                      <td className="py-2 px-4 text-right font-medium">{batter.runs}</td>
                      <td className="py-2 px-4 text-right">{batter.balls}</td>
                      <td className="py-2 px-4 text-right">{batter.fours}</td>
                      <td className="py-2 px-4 text-right">{batter.sixes}</td>
                      <td className="py-2 px-4 text-right">
                        {batter.balls > 0 
                          ? ((batter.runs / batter.balls) * 100).toFixed(2) 
                          : '0.00'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                      No batting data available
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-medium">
                  <td className="py-2 px-4">Extras</td>
                  <td className="py-2 px-4 text-right">
                    {inning.extras.wides + inning.extras.noBalls + 
                     inning.extras.byes + inning.extras.legByes + 
                     inning.extras.penalty}
                  </td>
                  <td colSpan="4" className="py-2 px-4 text-left text-sm">
                    (W: {inning.extras.wides}, 
                    NB: {inning.extras.noBalls}, 
                    B: {inning.extras.byes}, 
                    LB: {inning.extras.legByes})
                  </td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="py-2 px-4">Total</td>
                  <td className="py-2 px-4 text-right">{inning.runs}</td>
                  <td colSpan="4" className="py-2 px-4">
                    ({inning.wickets} wickets, {inning.overs.toFixed(1)} overs)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

BattingScorecard.propTypes = {
  match: PropTypes.object.isRequired
}

export default BattingScorecard