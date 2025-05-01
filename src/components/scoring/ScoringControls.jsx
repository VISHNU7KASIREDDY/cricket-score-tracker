import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

function ScoringControls({ match, recordBall, matchId }) {
  const currentInningsIdx = match.currentInnings - 1
  const currentInnings = match.innings[currentInningsIdx]
  const battingTeamName = currentInnings.battingTeam
  const bowlingTeamName = match.team1 === battingTeamName ? match.team2 : match.team1
  
  // Find the batting and bowling teams
  const battingTeam = match.team1 === battingTeamName 
    ? match.teams?.find(t => t.name === match.team1)
    : match.teams?.find(t => t.name === match.team2)
    
  const bowlingTeam = match.team1 === bowlingTeamName
    ? match.teams?.find(t => t.name === match.team1)
    : match.teams?.find(t => t.name === match.team2)
  
  // State for batting, bowling and ball tracking
  const [striker, setStriker] = useState(null)
  const [nonStriker, setNonStriker] = useState(null)
  const [bowler, setBowler] = useState(null)
  const [runs, setRuns] = useState(0)
  const [extras, setExtras] = useState({
    wides: 0,
    noBall: false,
    byes: 0,
    legByes: 0
  })
  const [isWicket, setIsWicket] = useState(false)
  const [wicketType, setWicketType] = useState('')
  const [fielder, setFielder] = useState('')
  
  // Batsman selection modal
  const [showBatsmanModal, setShowBatsmanModal] = useState(false)
  // Bowler selection modal
  const [showBowlerModal, setShowBowlerModal] = useState(false)
  
  // Add state for batsman selection
  const [selectedStriker, setSelectedStriker] = useState('')
  const [selectedNonStriker, setSelectedNonStriker] = useState('')
  
  // Initialize batsmen and bowler at the start
  useEffect(() => {
    if (!striker && !nonStriker) {
      setShowBatsmanModal(true)
    }
    
    if (!bowler) {
      setShowBowlerModal(true)
    }
  }, [striker, nonStriker, bowler])
  
  // Reset ball state after recording
  const resetBallState = () => {
    setRuns(0)
    setExtras({
      wides: 0,
      noBall: false,
      byes: 0,
      legByes: 0
    })
    setIsWicket(false)
    setWicketType('')
    setFielder('')
  }
  
  // Handle run button clicks
  const handleRunClick = (value) => {
    setRuns(value)
  }
  
  // Handle extras
  const handleWideClick = () => {
    setExtras({
      ...extras,
      wides: extras.wides === 0 ? 1 : 0
    })
  }
  
  const handleNoBallClick = () => {
    setExtras({
      ...extras,
      noBall: !extras.noBall
    })
  }
  
  const handleByesClick = () => {
    setExtras({
      ...extras,
      byes: extras.byes === 0 ? runs : 0
    })
  }
  
  const handleLegByesClick = () => {
    setExtras({
      ...extras,
      legByes: extras.legByes === 0 ? runs : 0
    })
  }
  
  // Handle wicket
  const handleWicketClick = () => {
    setIsWicket(!isWicket)
    if (!isWicket) {
      setWicketType('Bowled')
    } else {
      setWicketType('')
      setFielder('')
    }
  }
  
  // Submit the ball
  const handleSubmitBall = () => {
    const totalExtras = extras.wides + (extras.noBall ? 1 : 0)
    
    const ballData = {
      batter: striker?.id,
      bowler: bowler?.id,
      runs: extras.byes > 0 || extras.legByes > 0 ? 0 : runs,
      extras: totalExtras,
      wides: extras.wides,
      noBall: extras.noBall,
      byes: extras.byes,
      legByes: extras.legByes,
      isWicket,
      wicketType: isWicket ? wicketType : '',
      fielder: isWicket && fielder ? fielder : '',
      dismissedBatter: isWicket ? striker?.id : '',
      isValid: !extras.wides && !extras.noBall
    }
    
    recordBall(matchId, ballData)
    
    // Handle strike rotation
    const isStrikeRotating = (runs % 2 === 1) || 
                            (extras.byes % 2 === 1) || 
                            (extras.legByes % 2 === 1)
    
    if (isStrikeRotating) {
      // Swap batsmen
      const temp = striker
      setStriker(nonStriker)
      setNonStriker(temp)
    }
    
    // Handle end of over
    const ballsInCurrentOver = currentInnings.balls % 6
    const isEndOfOver = ballsInCurrentOver === 5 && !extras.wides && !extras.noBall
    
    if (isEndOfOver) {
      // Swap batsmen at end of over
      const temp = striker
      setStriker(nonStriker)
      setNonStriker(temp)
      
      // Prompt for new bowler
      setShowBowlerModal(true)
    }
    
    // If wicket, check if innings should end
    if (isWicket) {
      const remainingBatsmen = battingTeam?.players.filter(p => 
        !currentInnings.battingScores.find(b => b.playerId === p.id && b.isOut)
      ).length

      if (remainingBatsmen <= 1) {
        // End innings
        const event = new CustomEvent('inningsComplete');
        window.dispatchEvent(event);
      } else {
        // Show new batsman selection
        setShowBatsmanModal(true)
      }
    }
    
    resetBallState()
  }
  
  // Select batsmen
  const handleSelectBatsmen = (batter1Id, batter2Id) => {
    const batter1 = battingTeam?.players.find(p => p.id === batter1Id)
    const batter2 = battingTeam?.players.find(p => p.id === batter2Id)
    
    setStriker(batter1)
    setNonStriker(batter2)
    setShowBatsmanModal(false)
    
    // Initialize batting scores if needed
    if (!currentInnings.battingScores.find(b => b.playerId === batter1Id)) {
      currentInnings.battingScores.push({
        playerId: batter1Id,
        name: batter1.name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      })
    }
    
    if (!currentInnings.battingScores.find(b => b.playerId === batter2Id)) {
      currentInnings.battingScores.push({
        playerId: batter2Id,
        name: batter2.name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      })
    }
  }
  
  // Select bowler
  const handleSelectBowler = (bowlerId) => {
    if (!bowlerId) {
      console.error('No bowler ID provided')
      return
    }

    const selectedBowler = bowlingTeam?.players.find(p => p.id === bowlerId)
    
    if (!selectedBowler) {
      console.error(`Bowler with ID ${bowlerId} not found in bowling team`)
      return
    }

    setBowler(selectedBowler)
    setShowBowlerModal(false)
    
    // Initialize bowling figures if needed
    if (!currentInnings.bowlingFigures.find(b => b.playerId === bowlerId)) {
      currentInnings.bowlingFigures.push({
        playerId: bowlerId,
        name: selectedBowler.name,
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        balls: 0
      })
    }
  }
  
  // Remove mock data and use actual teams
  const actualBattingTeam = battingTeam
  const actualBowlingTeam = bowlingTeam
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:justify-between gap-4">
        <div className="flex-1 bg-cricket-pitch p-4 rounded-lg">
          <h3 className="font-bold mb-2">Batsmen</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center bg-white p-2 rounded">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-cricket-field text-white rounded-full flex items-center justify-center text-sm mr-2">
                  *
                </span>
                <span>{striker?.name || 'Select batsman'}</span>
              </div>
              <button 
                className="text-xs bg-cricket-field text-white px-2 py-1 rounded"
                onClick={() => setShowBatsmanModal(true)}
              >
                Change
              </button>
            </div>
            <div className="flex justify-between items-center bg-white p-2 rounded">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-sm mr-2">
                  
                </span>
                <span>{nonStriker?.name || 'Select non-striker'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-cricket-pitch p-4 rounded-lg">
          <h3 className="font-bold mb-2">Bowler</h3>
          <div className="flex justify-between items-center bg-white p-2 rounded">
            <span>{bowler?.name || 'Select bowler'}</span>
            <button 
              className="text-xs bg-cricket-field text-white px-2 py-1 rounded"
              onClick={() => setShowBowlerModal(true)}
            >
              Change
            </button>
          </div>
          <div className="mt-2 text-sm">
            <p>Current over: {Math.floor(currentInnings.balls / 6)}.{currentInnings.balls % 6}</p>
            <p>This over: 
              {currentInnings.ballByBall
                .slice(-Math.min(currentInnings.balls % 6, 6))
                .map((ball, idx) => {
                  let ballDisplay = ball.runs.toString()
                  
                  if (ball.wides) ballDisplay = 'W'
                  if (ball.noBall) ballDisplay = 'N'
                  if (ball.isWicket) ballDisplay = 'W'
                  
                  return (
                    <span 
                      key={idx} 
                      className="inline-block mx-1 w-6 h-6 text-center bg-white rounded-full"
                    >
                      {ballDisplay}
                    </span>
                  )
                })
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 border border-gray-200 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[0, 1, 2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => handleRunClick(num)}
              className={`p-4 text-xl font-bold rounded-lg ${
                runs === num 
                  ? 'bg-cricket-field text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleWicketClick}
            className={`p-4 text-xl font-bold rounded-lg ${
              isWicket 
                ? 'bg-cricket-ball text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            W
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <button
            onClick={handleWideClick}
            className={`p-2 rounded-lg ${
              extras.wides > 0 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Wide
          </button>
          <button
            onClick={handleNoBallClick}
            className={`p-2 rounded-lg ${
              extras.noBall 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            No Ball
          </button>
          <button
            onClick={handleByesClick}
            disabled={runs === 0}
            className={`p-2 rounded-lg ${
              extras.byes > 0 
                ? 'bg-blue-500 text-white' 
                : runs === 0 
                  ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                  : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Byes
          </button>
          <button
            onClick={handleLegByesClick}
            disabled={runs === 0}
            className={`p-2 rounded-lg ${
              extras.legByes > 0 
                ? 'bg-blue-500 text-white' 
                : runs === 0 
                  ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                  : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Leg Byes
          </button>
        </div>
        
        {isWicket && (
          <div className="mb-6 bg-gray-50 p-3 rounded-lg">
            <div className="mb-3">
              <label className="form-label">Wicket Type</label>
              <select
                value={wicketType}
                onChange={(e) => setWicketType(e.target.value)}
                className="form-input"
              >
                <option value="Bowled">Bowled</option>
                <option value="Caught">Caught</option>
                <option value="LBW">LBW</option>
                <option value="Stumped">Stumped</option>
                <option value="Run Out">Run Out</option>
                <option value="Hit Wicket">Hit Wicket</option>
              </select>
            </div>
            
            {(wicketType === 'Caught' || wicketType === 'Run Out' || wicketType === 'Stumped') && (
              <div>
                <label className="form-label">Fielder</label>
                <select
                  value={fielder}
                  onChange={(e) => setFielder(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select fielder</option>
                  {actualBowlingTeam.players.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center">
          <button
            onClick={handleSubmitBall}
            className="btn btn-primary px-8"
            disabled={
              !striker || !nonStriker || !bowler ||
              (isWicket && (
                !wicketType || 
                ((['Caught', 'Run Out', 'Stumped'].includes(wicketType)) && !fielder)
              ))
            }
          >
            Record Ball
          </button>
        </div>
      </div>
      
      {/* Batsman Selection Modal */}
      {showBatsmanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Select Batsmen</h3>
            
            <div className="mb-4">
              <label className="form-label">Striker</label>
              <select
                value={selectedStriker}
                onChange={(e) => setSelectedStriker(e.target.value)}
                className="form-input"
              >
                <option value="">Select batsman</option>
                {actualBattingTeam?.players
                  ?.filter(player => {
                    // Filter out players who are already out
                    const battingScore = currentInnings.battingScores.find(
                      b => b.playerId === player.id
                    )
                    return !battingScore || !battingScore.isOut
                  })
                  .map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div className="mb-6">
              <label className="form-label">Non-Striker</label>
              <select
                value={selectedNonStriker}
                onChange={(e) => setSelectedNonStriker(e.target.value)}
                className="form-input"
              >
                <option value="">Select batsman</option>
                {actualBattingTeam?.players
                  ?.filter(player => {
                    // Filter out players who are already out or selected as striker
                    const battingScore = currentInnings.battingScores.find(
                      b => b.playerId === player.id
                    )
                    return (!battingScore || !battingScore.isOut) && 
                           player.id !== selectedStriker
                  })
                  .map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (selectedStriker && selectedNonStriker && selectedStriker !== selectedNonStriker) {
                    handleSelectBatsmen(selectedStriker, selectedNonStriker)
                    setSelectedStriker('')
                    setSelectedNonStriker('')
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bowler Selection Modal */}
      {showBowlerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Select Bowler</h3>
            
            <div className="mb-6">
              <label className="form-label">Bowler</label>
              <select
                id="bowlerSelect"
                className="form-input"
                defaultValue=""
                onChange={(e) => {
                  const bowlerId = e.target.value
                  if (bowlerId) {
                    handleSelectBowler(bowlerId)
                  }
                }}
              >
                <option value="">Select bowler</option>
                {actualBowlingTeam?.players?.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

ScoringControls.propTypes = {
  match: PropTypes.object.isRequired,
  recordBall: PropTypes.func.isRequired,
  matchId: PropTypes.string.isRequired
}

export default ScoringControls