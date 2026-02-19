import { useState } from 'react'
import './AddProfileModal.css'

const INITIAL_STAGE = 'todo'

const AddProfileModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentRole: '',
    overallScore: '',
    skills: [],
    notes: ''
  })
  const [skillInput, setSkillInput] = useState('')

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
    
    if (!formData.name.trim()) {
      alert('Please enter candidate name')
      return
    }

    const newCandidate = {
      id: Date.now().toString(),
      ...formData,
      overallScore: parseInt(formData.overallScore) || 0,
      stage: INITIAL_STAGE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onAdd(newCandidate)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-profile-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Candidate</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group required">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Candidate name"
                  required
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
                placeholder="0-100"
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

          {/* Info */}
          <div className="info-box">
            <p>The candidate will be added to <strong>To Do</strong> stage.</p>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProfileModal
