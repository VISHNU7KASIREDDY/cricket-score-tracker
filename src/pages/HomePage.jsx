import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMatch } from '../context/MatchContext'
import MatchCard from '../components/match/MatchCard'

function HomePage() {
  const { matches, currentMatch } = useMatch()
  const [activeMatches, setActiveMatches] = useState([])
  const [recentMatches, setRecentMatches] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Filter active and recent matches
    const active = matches.filter(match => match.status === 'in_progress')
    const recent = matches
      .filter(match => match.status === 'completed')
      .sort((a, b) => new Date(b.endedAt) - new Date(a.endedAt))
      .slice(0, 3)
    
    setActiveMatches(active)
    setRecentMatches(recent)
  }, [matches])

  // Continue scoring an active match
  const continueMatch = (matchId) => {
    navigate(`/score/${matchId}`)
  }

  // View a completed match summary
  const viewMatchSummary = (matchId) => {
    navigate(`/summary/${matchId}`)
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-cricket-field to-green-700 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Cricket Scoring Made Easy</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Track matches, manage teams, and record every ball with our professional cricket scoring app.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/new-match" className="btn bg-white text-cricket-field hover:bg-gray-100">
            Start New Match
          </Link>
          <Link to="/teams" className="btn bg-green-600 text-white hover:bg-green-700">
            Manage Teams
          </Link>
        </div>
      </section>

      {activeMatches.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Active Matches</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {activeMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onAction={() => continueMatch(match.id)} 
                actionText="Continue Scoring"
              />
            ))}
          </div>
        </section>
      )}

      {recentMatches.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Recent Matches</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recentMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onAction={() => viewMatchSummary(match.id)} 
                actionText="View Summary"
              />
            ))}
          </div>
          {matches.filter(match => match.status === 'completed').length > 3 && (
            <div className="text-center mt-6">
              <Link to="/history" className="btn btn-secondary">
                View All Matches
              </Link>
            </div>
          )}
        </section>
      )}

      {activeMatches.length === 0 && recentMatches.length === 0 && (
        <section className="text-center py-12">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Welcome to CricScore!</h2>
            <p className="mb-6">
              Looks like you haven't started any matches yet. Create a team and start your first match to get going.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/teams" className="btn btn-primary">
                Create Teams
              </Link>
              <Link to="/new-match" className="btn btn-secondary">
                Start Match
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage