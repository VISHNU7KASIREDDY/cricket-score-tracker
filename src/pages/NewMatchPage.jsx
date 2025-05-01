import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMatch } from '../context/MatchContext'

function NewMatchPage() {
  const { teams, createMatch, startMatch } = useMatch()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    format: 'T20',
    overs: 20,
    location: '',
    firstBattingTeam: '',
  })
  
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)
  
  useEffect(() => {
    if (teams.length < 2) {
      setErrors({
        teams: 'You need at least 2 teams to create a match. Please create teams first.'
      })
    }
  }, [teams])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
    
    // Set first batting team default when teams are selected
    if (name === 'team1' && !formData.firstBattingTeam) {
      setFormData(prev => ({ ...prev, firstBattingTeam: value }))
    }
  }
  
  const validateStep1 = () => {
    const newErrors = {}
    
    if (!formData.team1) {
      newErrors.team1 = 'Please select Team 1'
    }
    
    if (!formData.team2) {
      newErrors.team2 = 'Please select Team 2'
    }
    
    if (formData.team1 && formData.team2 && formData.team1 === formData.team2) {
      newErrors.team2 = 'Team 2 must be different from Team 1'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const validateStep2 = () => {
    const newErrors = {}
    
    if (!formData.format) {
      newErrors.format = 'Please select a match format'
    }
    
    if (!formData.overs || formData.overs < 1) {
      newErrors.overs = 'Overs must be at least 1'
    }
    
    if (!formData.firstBattingTeam) {
      newErrors.firstBattingTeam = 'Please select which team bats first'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }
  
  const handlePrevStep = () => {
    setStep(1)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateStep2()) {
      try {
        const newMatch = createMatch(formData)
        navigate(`/score/${newMatch.id}`)
      } catch (error) {
        console.error('Error creating match:', error)
        setErrors({ submit: 'Failed to create match. Please try again.' })
      }
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Match</h1>
      
      {errors.teams ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-red-500 mb-4">{errors.teams}</p>
          <button 
            onClick={() => navigate('/teams')}
            className="btn btn-primary"
          >
            Create Teams
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-cricket-field text-white p-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Match Details</h2>
              <div className="text-sm">
                Step {step} of 2
              </div>
            </div>
            <div className="mt-2 bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="team1" className="form-label">Team 1</label>
                  <select
                    id="team1"
                    name="team1"
                    value={formData.team1}
                    onChange={handleInputChange}
                    className={`form-input ${errors.team1 ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Team 1</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {errors.team1 && (
                    <p className="text-red-500 text-sm mt-1">{errors.team1}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="team2" className="form-label">Team 2</label>
                  <select
                    id="team2"
                    name="team2"
                    value={formData.team2}
                    onChange={handleInputChange}
                    className={`form-input ${errors.team2 ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Team 2</option>
                    {teams
                      .filter(team => team.name !== formData.team1)
                      .map(team => (
                        <option key={team.id} value={team.name}>
                          {team.name}
                        </option>
                      ))
                    }
                  </select>
                  {errors.team2 && (
                    <p className="text-red-500 text-sm mt-1">{errors.team2}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="location" className="form-label">Venue (optional)</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Match location"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary w-full"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="format" className="form-label">Match Format</label>
                  <select
                    id="format"
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className={`form-input ${errors.format ? 'border-red-500' : ''}`}
                  >
                    <option value="T20">T20</option>
                    <option value="ODI">ODI</option>
                    <option value="Test">Test</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {errors.format && (
                    <p className="text-red-500 text-sm mt-1">{errors.format}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="overs" className="form-label">
                    Number of Overs {formData.format === 'Custom' ? '' : '(pre-set based on format)'}
                  </label>
                  <input
                    type="number"
                    id="overs"
                    name="overs"
                    value={formData.overs}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    className={`form-input ${errors.overs ? 'border-red-500' : ''}`}
                    readOnly={formData.format !== 'Custom'}
                  />
                  {errors.overs && (
                    <p className="text-red-500 text-sm mt-1">{errors.overs}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="firstBattingTeam" className="form-label">Team Batting First</label>
                  <select
                    id="firstBattingTeam"
                    name="firstBattingTeam"
                    value={formData.firstBattingTeam}
                    onChange={handleInputChange}
                    className={`form-input ${errors.firstBattingTeam ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select team to bat first</option>
                    {formData.team1 && (
                      <option value={formData.team1}>{formData.team1}</option>
                    )}
                    {formData.team2 && (
                      <option value={formData.team2}>{formData.team2}</option>
                    )}
                  </select>
                  {errors.firstBattingTeam && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstBattingTeam}</p>
                  )}
                </div>
                
                {errors.submit && (
                  <p className="text-red-500 text-center">{errors.submit}</p>
                )}
                
                <div className="pt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Start Match
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  )
}

export default NewMatchPage