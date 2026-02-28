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
    location: '',
    overallScore: 0,
    stage: 'todo',
    skills: [],
    onHoldReason: '',
    notes: '',
    resumeFileName: '',
    resumeText: '',
    interviewTakenBy: '',
    interviewerComment: ''
  })
  const [skillInput, setSkillInput] = useState('')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: ''
  })

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        currentRole: candidate.currentRole || '',
        location: candidate.location || '',
        overallScore: candidate.overallScore || 0,
        stage: candidate.stage || 'todo',
        skills: candidate.skills || [],
        onHoldReason: candidate.onHoldReason || '',
        notes: candidate.notes || '',
        resumeFileName: candidate.resumeFileName || '',
        resumeText: candidate.resumeText || '',
        interviewTakenBy: candidate.interviewTakenBy || '',
        interviewerComment: candidate.interviewerComment || ''
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

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    onDelete(candidate.id)
    setShowDeleteModal(false)
    onClose()
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  const handleStageChange = (newStage) => {
    setFormData(prev => ({ ...prev, stage: newStage }))
  }

  const handleWhatsAppClick = () => {
    const phone = formData.phone?.replace(/\D/g, '')
    if (phone) {
      const message = encodeURIComponent(`Hi ${formData.name},`)
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    } else {
      alert('Candidate phone number not available')
    }
  }

  const handleEmailClick = () => {
    if (formData.email) {
      setShowEmailModal(true)
    } else {
      alert('Candidate email not available')
    }
  }

  const handleEmailSend = () => {
    const { subject, message } = emailForm
    const mailtoLink = `mailto:${formData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    window.location.href = mailtoLink
    setShowEmailModal(false)
    setEmailForm({ subject: '', message: '' })
  }

  const handleEmailFormChange = (e) => {
    const { name, value } = e.target
    setEmailForm(prev => ({ ...prev, [name]: value }))
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

          {/* Contact Actions */}
          <div className="form-section">
            <h3>Contact</h3>
            <div className="contact-actions">
              <button
                type="button"
                className="contact-btn whatsapp-btn"
                onClick={handleWhatsAppClick}
                disabled={!formData.phone}
                title={formData.phone ? 'Send WhatsApp message' : 'Phone number not available'}
              >
                <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>
              <button
                type="button"
                className="contact-btn email-btn"
                onClick={handleEmailClick}
                disabled={!formData.email}
                title={formData.email ? 'Send Email' : 'Email not available'}
              >
                <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Email
              </button>
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

          {/* Resume Link */}
          {formData.resumeFileName && (
            <div className="form-section">
              <h3>Resume</h3>
              <div className="resume-link-container">
                <div className="resume-file-info">
                  <svg className="resume-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  <span className="resume-file-name">{formData.resumeFileName}</span>
                </div>
                {formData.resumeText && (
                  <div className="resume-content-preview">
                    <details open>
                      <summary>View Resume Content</summary>
                      <div className="resume-text-content">
                        {formData.resumeText}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          )}

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

          {/* Interview Details */}
          <div className="form-section">
            <h3>Interview Details</h3>
            <div className="form-group">
              <label>Interview Taken By</label>
              <input
                type="text"
                name="interviewTakenBy"
                value={formData.interviewTakenBy}
                onChange={handleChange}
                placeholder="Enter interviewer name..."
              />
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Interviewer Comment</label>
              <textarea
                name="interviewerComment"
                value={formData.interviewerComment}
                onChange={handleChange}
                placeholder="Enter interviewer feedback and comments..."
                rows={4}
              />
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

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-danger" onClick={handleDeleteClick}>
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

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay email-modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content email-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Send Email</h2>
              <button className="close-btn" onClick={() => setShowEmailModal(false)}>×</button>
            </div>
            <div className="email-form">
              <div className="form-group">
                <label>To</label>
                <input type="email" value={formData.email} disabled />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={emailForm.subject}
                  onChange={handleEmailFormChange}
                  placeholder="Enter email subject..."
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={emailForm.message}
                  onChange={handleEmailFormChange}
                  placeholder="Enter your message..."
                  rows={6}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEmailModal(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEmailSend}
                  disabled={!emailForm.subject.trim() || !emailForm.message.trim()}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay delete-modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3>Delete Candidate</h3>
            <p>Are you sure you want to delete <strong>{candidate?.name || 'this candidate'}</strong>?</p>
            <p className="delete-warning">This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CardDetailModal
