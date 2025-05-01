import { createContext, useContext, useState, useEffect } from 'react'

const MatchContext = createContext()

export function useMatch() {
  return useContext(MatchContext)
}

export function MatchProvider({ children }) {
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('cricket-teams')
    return savedTeams ? JSON.parse(savedTeams) : []
  })

  const [matches, setMatches] = useState(() => {
    const savedMatches = localStorage.getItem('cricket-matches')
    return savedMatches ? JSON.parse(savedMatches) : []
  })

  const [currentMatch, setCurrentMatch] = useState(null)

  useEffect(() => {
    localStorage.setItem('cricket-teams', JSON.stringify(teams))
  }, [teams])

  useEffect(() => {
    localStorage.setItem('cricket-matches', JSON.stringify(matches))
  }, [matches])

  // Team management
  const addTeam = (team) => {
    const newTeam = {
      id: Date.now().toString(),
      name: team.name,
      players: team.players || [],
      createdAt: new Date().toISOString(),
    }
    setTeams([...teams, newTeam])
    return newTeam
  }

  const updateTeam = (teamId, updatedTeam) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, ...updatedTeam } : team
    ))
  }

  const deleteTeam = (teamId) => {
    setTeams(teams.filter(team => team.id !== teamId))
  }

  // Match management
  const createMatch = (matchData) => {
    // Find the team objects for both teams
    const team1Data = teams.find(t => t.name === matchData.team1)
    const team2Data = teams.find(t => t.name === matchData.team2)
    
    const newMatch = {
      id: Date.now().toString(),
      ...matchData,
      teams: [team1Data, team2Data], // Include the full team data
      status: 'pending',
      innings: [],
      createdAt: new Date().toISOString(),
    }
    setMatches([...matches, newMatch])
    return newMatch
  }

  const updateMatch = (matchId, matchData) => {
    setMatches(matches.map(match => 
      match.id === matchId ? { ...match, ...matchData } : match
    ))
    
    if (currentMatch && currentMatch.id === matchId) {
      setCurrentMatch({ ...currentMatch, ...matchData })
    }
  }

  const startMatch = (matchId) => {
    const match = matches.find(m => m.id === matchId)
    if (!match) return null

    const updatedMatch = {
      ...match,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      currentInnings: 1,
      currentBatters: [],
      currentBowler: null,
      innings: [
        {
          number: 1,
          battingTeam: match.firstBattingTeam,
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          extras: {
            wides: 0,
            noBalls: 0,
            byes: 0,
            legByes: 0,
            penalty: 0,
          },
          battingScores: [],
          bowlingFigures: [],
          ballByBall: []
        }
      ]
    }

    // Ensure teams data is preserved
    if (!updatedMatch.teams) {
      const team1Data = teams.find(t => t.name === match.team1)
      const team2Data = teams.find(t => t.name === match.team2)
      updatedMatch.teams = [team1Data, team2Data]
    }

    setCurrentMatch(updatedMatch)
    updateMatch(matchId, updatedMatch)
    return updatedMatch
  }

  const endMatch = (matchId, result) => {
    updateMatch(matchId, {
      status: 'completed',
      result,
      endedAt: new Date().toISOString()
    })
    setCurrentMatch(null)
  }

  // Scoring functions
  const recordBall = (matchId, ballData) => {
    const match = matches.find(m => m.id === matchId) || currentMatch
    if (!match) return null

    const currentInningsIdx = match.currentInnings - 1
    const inning = match.innings[currentInningsIdx]
    
    const updatedInning = {
      ...inning,
      runs: inning.runs + ballData.runs + ballData.extras,
      wickets: ballData.isWicket ? inning.wickets + 1 : inning.wickets,
      balls: ballData.isValid ? inning.balls + 1 : inning.balls,
      ballByBall: [...inning.ballByBall, {
        ...ballData,
        timestamp: new Date().toISOString()
      }]
    }
    
    // Calculate overs
    updatedInning.overs = Math.floor(updatedInning.balls / 6) + (updatedInning.balls % 6) / 10
    
    // Update extras
    if (ballData.wides) updatedInning.extras.wides += ballData.wides
    if (ballData.noBall) updatedInning.extras.noBalls += 1
    if (ballData.byes) updatedInning.extras.byes += ballData.byes
    if (ballData.legByes) updatedInning.extras.legByes += ballData.legByes
    
    // Update batting scores
    const batterIndex = updatedInning.battingScores.findIndex(
      b => b.playerId === ballData.batter
    )
    
    if (batterIndex >= 0) {
      const batter = updatedInning.battingScores[batterIndex]
      updatedInning.battingScores[batterIndex] = {
        ...batter,
        runs: batter.runs + ballData.runs,
        balls: batter.balls + (ballData.isValid ? 1 : 0),
        fours: ballData.runs === 4 ? batter.fours + 1 : batter.fours,
        sixes: ballData.runs === 6 ? batter.sixes + 1 : batter.sixes,
        isOut: ballData.isWicket && ballData.dismissedBatter === batter.playerId
      }
    }
    
    // Update bowling figures
    const bowlerIndex = updatedInning.bowlingFigures.findIndex(
      b => b.playerId === ballData.bowler
    )
    
    if (bowlerIndex >= 0) {
      const bowler = updatedInning.bowlingFigures[bowlerIndex]
      const newBalls = ballData.isValid ? bowler.balls + 1 : bowler.balls
      
      updatedInning.bowlingFigures[bowlerIndex] = {
        ...bowler,
        runs: bowler.runs + ballData.runs + ballData.extras,
        wickets: ballData.isWicket ? bowler.wickets + 1 : bowler.wickets,
        balls: newBalls,
        overs: Math.floor(newBalls / 6) + (newBalls % 6) / 10
      }
    }
    
    // Update innings in match
    const updatedInnings = [...match.innings]
    updatedInnings[currentInningsIdx] = updatedInning
    
    const updatedMatch = { ...match, innings: updatedInnings }
    
    setCurrentMatch(updatedMatch)
    updateMatch(matchId, updatedMatch)
    
    return updatedMatch
  }

  const value = {
    teams,
    matches,
    currentMatch,
    addTeam,
    updateTeam,
    deleteTeam,
    createMatch,
    updateMatch,
    startMatch,
    endMatch,
    recordBall,
    setCurrentMatch
  }

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  )
}