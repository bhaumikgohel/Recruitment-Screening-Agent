import { useState } from 'react'
import './KanbanBoard.css'

const STAGES = [
  { id: 'todo', name: 'To Do', color: '#6b7280' },
  { id: 'shortlisted', name: 'Shortlisted', color: '#10b981' },
  { id: 'round1', name: 'Round 1 (Initial)', color: '#3b82f6' },
  { id: 'round2', name: 'Round 2 (Technical)', color: '#8b5cf6' },
  { id: 'round3', name: 'Round 3 (Practical)', color: '#f59e0b' },
  { id: 'round4', name: 'Round 4 (HR)', color: '#ec4899' },
  { id: 'onhold', name: 'On Hold', color: '#ef4444' },
  { id: 'onboard', name: 'Onboard', color: '#059669' }
]

const KanbanBoard = ({ 
  candidates, 
  onUpdateCandidates, 
  onViewCard, 
  onAddProfile,
  onMoveToOnboard 
}) => {
  const [draggedCard, setDraggedCard] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)
  const [showOnHoldModal, setShowOnHoldModal] = useState(false)
  const [pendingMove, setPendingMove] = useState(null)
  const [onHoldReason, setOnHoldReason] = useState('')

  const getCandidatesByStage = (stageId) => {
    return candidates.filter(c => c.stage === stageId)
  }

  const handleDragStart = (e, candidate) => {
    if (candidate.stage === 'onboard') {
      e.preventDefault()
      return
    }
    setDraggedCard(candidate)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, stageId) => {
    e.preventDefault()
    setDragOverStage(stageId)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = (e, targetStage) => {
    e.preventDefault()
    setDragOverStage(null)

    if (!draggedCard) return

    // Prevent moving from onboard
    if (draggedCard.stage === 'onboard') {
      setDraggedCard(null)
      return
    }

    // If moving to On Hold, show reason modal
    if (targetStage === 'onhold') {
      setPendingMove({ candidate: draggedCard, targetStage })
      setOnHoldReason(draggedCard.onHoldReason || '')
      setShowOnHoldModal(true)
      setDraggedCard(null)
      return
    }

    moveCard(draggedCard, targetStage)
    setDraggedCard(null)
  }

  const moveCard = (candidate, targetStage, reason = null) => {
    const updatedCandidates = candidates.map(c => {
      if (c.id === candidate.id) {
        return { 
          ...c, 
          stage: targetStage,
          ...(reason && { onHoldReason: reason }),
          updatedAt: new Date().toISOString()
        }
      }
      return c
    })
    onUpdateCandidates(updatedCandidates)
  }

  const handleOnHoldSubmit = () => {
    if (pendingMove) {
      moveCard(pendingMove.candidate, pendingMove.targetStage, onHoldReason)
      setPendingMove(null)
      setOnHoldReason('')
      setShowOnHoldModal(false)
    }
  }

  const handleCardClick = (candidate) => {
    if (candidate.stage !== 'onboard') {
      onViewCard(candidate)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="kanban-container">
      {/* Header */}
      <div className="kanban-header">
        <h2>Recruitment Pipeline</h2>
        <button className="btn btn-primary" onClick={onAddProfile}>
          + Add User Profile
        </button>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {STAGES.map(stage => (
          <div 
            key={stage.id}
            className={`kanban-column ${dragOverStage === stage.id ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Column Header */}
            <div 
              className="kanban-column-header"
              style={{ borderTopColor: stage.color }}
            >
              <span className="column-name">{stage.name}</span>
              <span className="column-count" style={{ background: stage.color }}>
                {getCandidatesByStage(stage.id).length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="kanban-column-content">
              {getCandidatesByStage(stage.id).map(candidate => (
                <div
                  key={candidate.id}
                  className={`kanban-card ${candidate.stage === 'onboard' ? 'disabled' : ''}`}
                  draggable={candidate.stage !== 'onboard'}
                  onDragStart={(e) => handleDragStart(e, candidate)}
                  onClick={() => handleCardClick(candidate)}
                >
                  <div className="card-header-row">
                    <h4 className="card-name">{candidate.name || 'Unnamed'}</h4>
                    <span className="card-score">{candidate.overallScore}%</span>
                  </div>
                  
                  <p className="card-role">{candidate.currentRole || 'Unknown Role'}</p>
                  
                  {candidate.location && (
                    <div className="card-location">
                      <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span>{candidate.location}</span>
                    </div>
                  )}
                  
                  {candidate.interviewTakenBy && (
                    <div className="card-interviewer">
                      <svg className="interviewer-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <span>Interview by: {candidate.interviewTakenBy}</span>
                    </div>
                  )}
                  
                  {candidate.onHoldReason && (
                    <div className="card-reason">
                      <span className="reason-label">On Hold:</span>
                      <span className="reason-text">{candidate.onHoldReason}</span>
                    </div>
                  )}
                  
                  <div className="card-footer-row">
                    <span className="card-date">{formatDate(candidate.createdAt)}</span>
                    {candidate.stage === 'shortlisted' && (
                      <button 
                        className="card-action-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onMoveToOnboard(candidate)
                        }}
                      >
                        Move to Onboard
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* On Hold Reason Modal */}
      {showOnHoldModal && (
        <div className="modal-overlay" onClick={() => setShowOnHoldModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Reason for On Hold</h3>
            <p>Please provide a reason for putting this candidate on hold:</p>
            <textarea
              value={onHoldReason}
              onChange={(e) => setOnHoldReason(e.target.value)}
              placeholder="Enter reason..."
              rows={4}
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowOnHoldModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleOnHoldSubmit}
                disabled={!onHoldReason.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KanbanBoard
