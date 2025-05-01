import { Routes, Route } from 'react-router-dom'
import { MatchProvider } from './context/MatchContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import TeamsPage from './pages/TeamsPage'
import NewMatchPage from './pages/NewMatchPage'
import ScoringPage from './pages/ScoringPage'
import MatchSummaryPage from './pages/MatchSummaryPage'
import HistoryPage from './pages/HistoryPage'

function App() {
  return (
    <MatchProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="new-match" element={<NewMatchPage />} />
          <Route path="score/:matchId" element={<ScoringPage />} />
          <Route path="summary/:matchId" element={<MatchSummaryPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </MatchProvider>
  )
}

export default App