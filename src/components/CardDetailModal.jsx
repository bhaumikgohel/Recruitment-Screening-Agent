import { useState, useEffect } from 'react'
import './CardDetailModal.css'

const STAGES = [
  { id: 'todo', name: 'To Do' },
  { id: 'shortlisted', name: 'Shortlisted' },
  { id: 'round1', name: 'Round 1 (Initial)' },
  { id: 'round2', name: 'Round 2 (Technical)' },
  { id: 'round3', name: 'Round 3 (Practical)' },
  { id: 'round4', name: 'Round 4 (HR)' },
  { id: 'onhold', name: 'On Hold' },
  { id: 'onboard', name: 'Onboard' }
]

const CardDetailModal = ({ candidate, onClose, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentRole: '',
    overallScore: 0,
    stage: 'todo',
    skills: [],
    onHoldReason: '',
    notes: ''
  })
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        currentRole: candidate.currentRole || '',
        overallScore: candidate.overallScore || 0,
        stage: candidate.stage || 'todo',
        skills: candidate.skills || [],
        onHoldReason: candidate.onHoldReason || '',
        notes: candidate.notes || ''
      })
    }
  }, [candidate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate({
      ...candidate,
      ...formData,
      updatedAt: new Date().toISOString()
    })
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      onDelete(candidate.id)
      onClose()
    }
  }

  const handleStageChange = (newStage) => {
    setFormData(prev => ({ ...prev, stage: newStage }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Candidate Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Stage Selector */}
          <div className="stage-selector">
            <label>Current Stage</label>
            <div className="stage-options">
              {STAGES.map(stage => (
                <button
                  key={stage.id}
                  type="button"
                  className={`stage-option ${formData.stage === stage.id ? 'active' : ''}`}
                  onClick={() => handleStageChange(stage.id)}
                >
                  {stage.name}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Candidate name"
                />
              </div>
              <div className="form-group">
                <label>Current Role</label>
                <input
                  type="text"
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleChange}
                  placeholder="e.g. Senior Developer"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Match Score (%)</label>
              <input
                type="number"
                name="overallScore"
                min="0"
                max="100"
                value={formData.overallScore}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="form-section">
            <h3>Skills</h3>
            <div className="skills-input-row">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddSkill}>
                Add
              </button>
            </div>
            <div className="skills-tags">
              {formData.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* On Hold Reason */}
          {formData.stage === 'onhold' && (
            <div className="form-section">
              <h3>On Hold Reason</h3>
              <textarea
                name="onHoldReason"
                value={formData.onHoldReason}
                onChange={handleChange}
                placeholder="Why is this candidate on hold?"
                rows={3}
              />
            </div>
          )}

          {/* Notes */}
          <div className="form-section">
            <h3>Notes</h3>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about the candidate..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
            <div className="action-group">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CardDetailModal
