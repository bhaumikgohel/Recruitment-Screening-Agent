import { useState, useRef, useCallback, useEffect } from 'react'
import { extractTextFromPDF } from './utils/pdfParser'
import { extractTextFromDOCX, extractTextFromTXT } from './utils/docxParser'
import KanbanBoard from './components/KanbanBoard'
import CardDetailModal from './components/CardDetailModal'
import AddProfileModal from './components/AddProfileModal'
import './index.css'

// Initial state for the form
const initialFormState = {
  jobDescription: '',
  resumeText: '',
  uploadedFileName: null
}

// Views
const VIEWS = {
  SCREENING: 'screening',
  KANBAN: 'kanban'
}

function App() {
  // Navigation
  const [currentView, setCurrentView] = useState(VIEWS.SCREENING)

  // Form state
  const [formData, setFormData] = useState(initialFormState)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Kanban state
  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem('kanbanCandidates')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showCardDetail, setShowCardDetail] = useState(false)
  const [showAddProfile, setShowAddProfile] = useState(false)

  // Persist candidates to localStorage
  useEffect(() => {
    localStorage.setItem('kanbanCandidates', JSON.stringify(candidates))
  }, [candidates])

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const clearData = () => {
    setFormData(initialFormState)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // File upload handlers
  const processFile = async (file) => {
    const fileName = file.name.toLowerCase()
    let extractedText = ''

    setUploadLoading(true)
    setError(null)

    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File is too large. Maximum size is 10MB.')
      }

      if (fileName.endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file)
      } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        extractedText = await extractTextFromDOCX(file)
      } else if (fileName.endsWith('.txt') || fileName.endsWith('.rtf')) {
        extractedText = await extractTextFromTXT(file)
      } else {
        throw new Error('Unsupported file format.')
      }

      if (!extractedText || extractedText.length < 50) {
        throw new Error('The file appears to be empty.')
      }

      setFormData(prev => ({
        ...prev,
        resumeText: extractedText,
        uploadedFileName: file.name
      }))
      setResult(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) processFile(file)
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }, [])

  const onButtonClick = () => fileInputRef.current?.click()

  // Evaluation logic
  const evaluateCandidate = async () => {
    if (!formData.jobDescription.trim() || !formData.resumeText.trim()) {
      setError('Please provide both Job Description and Resume text')
      return
    }

    // Validate job description has meaningful content (at least 20 characters)
    if (formData.jobDescription.trim().length < 20) {
      setError('Job description is too short. Please provide a detailed job description with required skills and qualifications.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const evaluationResult = performEvaluation(formData.jobDescription, formData.resumeText)
      setResult(evaluationResult)
    } catch (err) {
      setError('An error occurred during evaluation.')
    } finally {
      setLoading(false)
    }
  }

  const performEvaluation = (jd, resume) => {
    const resumeLower = resume.toLowerCase()
    const jdLower = jd.toLowerCase()

    const nameMatch = resume.match(/^[A-Za-z\s]+/m)
    const emailMatch = resume.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    const phoneRegex = /(?:\+\d{1,4}[-.\s]?)?(?:\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g
    const phoneMatches = resume.match(phoneRegex)
    const validPhone = phoneMatches?.find(p => {
      const digitsOnly = p.replace(/\D/g, '')
      return digitsOnly.length >= 10 && digitsOnly.length <= 15
    })
    const experienceMatch = resume.match(/(\d+)\+?\s*years?\s*of\s*experience/i)

    // Extract skills with word boundary matching
    const extractSkillsFromText = (text) => {
      const skillsFound = new Set()
      const skillPatterns = [
        { name: 'JavaScript', pattern: /\bjavascript\b|\bjs\b/gi },
        { name: 'React', pattern: /\breact\b(?!\s*native)/gi },
        { name: 'React Native', pattern: /\breact\s*native\b/gi },
        { name: 'Node.js', pattern: /\bnode\.?js\b|\bnode\b/gi },
        { name: 'Python', pattern: /\bpython\b/gi },
        { name: 'Java', pattern: /\bjava\b(?!\s*script)/gi },
        { name: 'TypeScript', pattern: /\btypescript\b|\bts\b/gi },
        { name: 'AWS', pattern: /\baws\b|\bamazon\s*web\s*services\b/gi },
        { name: 'GCP', pattern: /\bgcp\b|\bgoogle\s*cloud\b/gi },
        { name: 'Azure', pattern: /\bazure\b/gi },
        { name: 'Docker', pattern: /\bdocker\b/gi },
        { name: 'Kubernetes', pattern: /\bkubernetes\b|\bk8s\b/gi },
        { name: 'SQL', pattern: /\bsql\b/gi },
        { name: 'MongoDB', pattern: /\bmongo(db)?\b/gi },
        { name: 'PostgreSQL', pattern: /\bpostgres(ql)?\b/gi },
        { name: 'MySQL', pattern: /\bmysql\b/gi },
        { name: 'CI/CD', pattern: /\bci\/cd\b|\bcicd\b/gi },
        { name: 'Git', pattern: /\bgit\b/gi },
        { name: 'Agile', pattern: /\bagile\b/gi },
        { name: 'REST API', pattern: /\brest\s*(api)?\b|\brestful\b/gi },
        { name: 'GraphQL', pattern: /\bgraphql\b/gi },
        { name: 'Microservices', pattern: /\bmicroservices\b/gi },
        { name: 'HTML', pattern: /\bhtml(5)?\b/gi },
        { name: 'CSS', pattern: /\bcss(3)?\b/gi },
        { name: 'Express', pattern: /\bexpress\.?js\b|\bexpress\b/gi },
        { name: 'Redis', pattern: /\bredis\b/gi },
        { name: 'Kafka', pattern: /\bkafka\b/gi },
        { name: 'Angular', pattern: /\bangular\b/gi },
        { name: 'Vue', pattern: /\bvue\.?js\b|\bvue\b/gi },
        { name: 'Spring', pattern: /\bspring\s*(boot)?\b/gi },
        { name: 'Django', pattern: /\bdjango\b/gi },
        { name: 'Flask', pattern: /\bflask\b/gi },
        { name: 'PHP', pattern: /\bphp\b/gi },
        { name: 'Laravel', pattern: /\blaravel\b/gi },
        { name: 'Go', pattern: /\bgo\s*(lang)?\b/gi },
        { name: 'Rust', pattern: /\brust\b/gi },
        { name: 'Swift', pattern: /\bswift\b/gi },
        { name: 'Kotlin', pattern: /\bkotlin\b/gi },
        { name: 'C++', pattern: /\bc\+\+\b/gi },
        { name: 'C#', pattern: /\bc#\b/gi },
        { name: '.NET', pattern: /\b\.net\b/gi },
        { name: 'TensorFlow', pattern: /\btensorflow\b/gi },
        { name: 'PyTorch', pattern: /\bpytorch\b/gi },
        { name: 'Machine Learning', pattern: /\bmachine\s*learning\b/gi },
        { name: 'Deep Learning', pattern: /\bdeep\s*learning\b/gi },
        { name: 'AI', pattern: /\bai\b|\bartificial\s*intelligence\b/gi },
        { name: 'Data Science', pattern: /\bdata\s*science\b/gi },
        { name: 'Tableau', pattern: /\btableau\b/gi },
        { name: 'Power BI', pattern: /\bpower\s*bi\b/gi },
        { name: 'Excel', pattern: /\bexcel\b/gi },
        { name: 'Jenkins', pattern: /\bjenkins\b/gi },
        { name: 'GitHub Actions', pattern: /\bgithub\s*actions\b/gi },
        { name: 'Terraform', pattern: /\bterraform\b/gi },
        { name: 'Ansible', pattern: /\bansible\b/gi },
        { name: 'Linux', pattern: /\blinux\b/gi },
        { name: 'jQuery', pattern: /\bjquery\b/gi },
        { name: 'Bootstrap', pattern: /\bbootstrap\b/gi },
        { name: 'Tailwind CSS', pattern: /\btailwind\b/gi }
      ]

      skillPatterns.forEach(({ name, pattern }) => {
        pattern.lastIndex = 0
        if (pattern.test(text)) skillsFound.add(name)
      })

      return Array.from(skillsFound)
    }

    const candidateSkills = extractSkillsFromText(resumeLower)
    const jdSkills = extractSkillsFromText(jdLower)

    const matchedSkills = candidateSkills.filter(skill =>
      jdSkills.some(jdSkill => jdSkill.includes(skill) || skill.includes(jdSkill))
    )
    const missingSkills = jdSkills.filter(skill =>
      !candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
    )
    const allSkills = [...new Set([...candidateSkills, ...jdSkills])].sort()

    const skillScore = jdSkills.length > 0
      ? Math.round((matchedSkills.length / jdSkills.length) * 100)
      : 50
    const requiredSkillsScore = Math.min(skillScore, 100)

    const requiredYears = jd.match(/(\d+)\+?\s*years?/)?.[1] || 3
    const candidateYears = experienceMatch ? parseInt(experienceMatch[1]) : 0
    const experienceScore = candidateYears >= parseInt(requiredYears)
      ? 100
      : Math.round((candidateYears / parseInt(requiredYears)) * 100)

    const hasDegree = resumeLower.includes('bachelor') || resumeLower.includes('master') ||
                      resumeLower.includes('degree') || resumeLower.includes('computer science')
    const educationScore = hasDegree ? 100 : 50

    const industryScore = 80
    const locationScore = 100
    const bonusScore = Math.min(candidateSkills.length * 20, 100)

    const overallScore = Math.round(
      (requiredSkillsScore * 0.40) +
      (experienceScore * 0.25) +
      (industryScore * 0.10) +
      (educationScore * 0.10) +
      (locationScore * 0.05) +
      (bonusScore * 0.10)
    )

    // Determine match level
    let matchLevel = 'Weak Fit'
    if (overallScore >= 80) matchLevel = 'Strong Fit'
    else if (overallScore >= 60) matchLevel = 'Moderate Fit'

    // Determine decision and confidence
    let decision = 'Reject'
    let confidenceLevel = 'Low'

    // Only shortlist if ALL of the following are true:
    // 1. Overall score >= 60
    // 2. Missing skills <= 3
    // 3. JD has at least one required skill (to ensure meaningful comparison)
    if (overallScore >= 60 && missingSkills.length <= 3 && jdSkills.length > 0) {
      decision = 'Shortlist'
      confidenceLevel = overallScore >= 80 ? 'High' : 'Medium'
    }

    // Build reasoning summary
    const strengths = []
    if (candidateYears >= parseInt(requiredYears)) strengths.push(`Has ${candidateYears}+ years of experience`)
    if (matchedSkills.length > 0) strengths.push(`Strong skill match: ${matchedSkills.slice(0, 3).join(', ')}`)
    if (hasDegree) strengths.push('Relevant educational background')

    const riskFlags = []
    if (missingSkills.length > 0) riskFlags.push(`Missing key skills: ${missingSkills.slice(0, 3).join(', ')}`)
    if (candidateYears < parseInt(requiredYears)) riskFlags.push('Experience below requirement')

    let reasoningSummary = ''
    if (decision === 'Shortlist') {
      reasoningSummary = `Shortlisted candidate with ${overallScore}% match. `
    } else {
      reasoningSummary = `Rejected candidate with ${overallScore}% match. `
    }
    reasoningSummary += `${strengths.length > 0 ? 'Strengths: ' + strengths.join('; ') + '. ' : ''}`
    reasoningSummary += `${riskFlags.length > 0 ? 'Concerns: ' + riskFlags.join('; ') + '.' : ''}`

    return {
      candidate_profile: {
        name: nameMatch ? nameMatch[0].trim() : null,
        email: emailMatch ? emailMatch[0] : null,
        phone: validPhone || null,
        total_experience_years: candidateYears,
        skills: candidateSkills
      },
      evaluation: {
        required_skills_score: requiredSkillsScore,
        experience_score: experienceScore,
        industry_score: industryScore,
        education_score: educationScore,
        location_score: locationScore,
        bonus_score: bonusScore,
        overall_score: overallScore,
        match_level: matchLevel,
        matched_skills: matchedSkills,
        missing_critical_skills: missingSkills,
        all_skills: allSkills
      },
      final_decision: {
        decision: decision,
        confidence_level: confidenceLevel,
        reasoning_summary: reasoningSummary
      }
    }
  }

  // Kanban handlers
  const handleUpdateCandidates = (updatedCandidates) => {
    setCandidates(updatedCandidates)
  }

  const handleViewCard = (candidate) => {
    setSelectedCandidate(candidate)
    setShowCardDetail(true)
  }

  const handleUpdateCard = (updatedCandidate) => {
    setCandidates(prev => prev.map(c =>
      c.id === updatedCandidate.id ? updatedCandidate : c
    ))
  }

  const handleDeleteCard = (candidateId) => {
    setCandidates(prev => prev.filter(c => c.id !== candidateId))
  }

  const handleAddProfile = (newCandidate) => {
    setCandidates(prev => [...prev, newCandidate])
  }

  const handleMoveToOnboard = (candidate) => {
    setCandidates(prev => prev.map(c =>
      c.id === candidate.id
        ? { ...c, stage: 'onboard', updatedAt: new Date().toISOString() }
        : c
    ))
  }

  const handleMoveToKanban = () => {
    if (!result) return

    const newCandidate = {
      id: Date.now().toString(),
      name: result.candidate_profile.name || 'Unnamed Candidate',
      email: result.candidate_profile.email,
      phone: result.candidate_profile.phone,
      currentRole: result.candidate_profile.current_role,
      overallScore: result.evaluation.overall_score,
      skills: result.candidate_profile.skills || [],
      stage: result.final_decision.decision === 'Shortlist' ? 'shortlisted' : 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setCandidates(prev => [...prev, newCandidate])
    setCurrentView(VIEWS.KANBAN)
  }

  const getDecisionClass = (decision) => {
    switch (decision) {
      case 'Shortlist': return 'decision-shortlist'
      case 'Manual Review': return 'decision-manual'
      case 'Reject': return 'decision-reject'
      default: return ''
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">AI</div>
              <div>
                <h1>Recruitment Screening Agent</h1>
                <p>AI-Powered Candidate Evaluation</p>
              </div>
            </div>
            <nav className="nav-tabs">
              <button
                className={`nav-tab ${currentView === VIEWS.SCREENING ? 'active' : ''}`}
                onClick={() => setCurrentView(VIEWS.SCREENING)}
              >
                Screening
              </button>
              <button
                className={`nav-tab ${currentView === VIEWS.KANBAN ? 'active' : ''}`}
                onClick={() => setCurrentView(VIEWS.KANBAN)}
              >
                Kanban Board
                {candidates.length > 0 && (
                  <span className="nav-badge">{candidates.length}</span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Screening View */}
      {currentView === VIEWS.SCREENING && (
        <main className="container">
          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* Results Section */}
          {result && (
            <div className="results-section">
              <div className="results-header">
                <h2>Evaluation Results</h2>
                {result.final_decision.decision === 'Shortlist' && (
                  <div className="action-buttons">
                    <button
                      className="btn btn-success"
                      onClick={handleMoveToKanban}
                    >
                      Move to Kanban
                    </button>
                  </div>
                )}
              </div>

              <div className="score-card">
                <div className="score-value">{result.evaluation.overall_score}</div>
                <div className="score-label">Overall Match Score</div>
              </div>

              <div className="results-grid">
                {/* Final Decision */}
                <div className="section-card">
                  <h3>Final Decision</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <span className={`decision-badge ${getDecisionClass(result.final_decision.decision)}`}>
                      {result.final_decision.decision}
                    </span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Confidence Level</span>
                    <span className="profile-value">{result.final_decision.confidence_level}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Match Level</span>
                    <span className={`match-level ${result.evaluation.match_level === 'Strong Fit' ? 'match-strong' : result.evaluation.match_level === 'Moderate Fit' ? 'match-moderate' : 'match-weak'}`}>
                      {result.evaluation.match_level}
                    </span>
                  </div>
                  {result.final_decision.reasoning_summary && (
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: '1.5' }}>
                      {result.final_decision.reasoning_summary}
                    </p>
                  )}
                  
                  {/* Send Email & WhatsApp Buttons for Shortlisted */}
                  {result.final_decision.decision === 'Shortlist' && (
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <a
                        href={result.candidate_profile.phone 
                          ? `https://wa.me/${result.candidate_profile.phone.replace(/\D/g, '')}?text=Congratulations! You have been shortlisted for the position.`
                          : `https://wa.me/?text=Congratulations! You have been shortlisted for the position.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                      >
                        <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </a>
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                        onClick={() => {
                          const email = result.candidate_profile.email
                          if (email) {
                            window.location.href = `mailto:${email}?subject=Congratulations! You have been shortlisted&body=Dear ${result.candidate_profile.name || 'Candidate'},%0D%0A%0D%0ACongratulations! You have been shortlisted for the position.%0D%0A%0D%0ABest regards,%0D%0AHR Team`
                          } else {
                            alert('Candidate email not available')
                          }
                        }}
                      >
                        📧 Send Email
                      </button>
                    </div>
                  )}
                </div>

                {/* Score Breakdown */}
                <div className="section-card">
                  <h3>Score Breakdown</h3>
                  <div className="scores-list">
                    <div className="score-item">
                      <span className="score-item-label">Required Skills (40%)</span>
                      <div className="score-item-bar">
                        <div className="score-item-fill" style={{ width: `${result.evaluation.required_skills_score}%` }} />
                      </div>
                      <span className="score-item-value">{result.evaluation.required_skills_score}</span>
                    </div>
                    <div className="score-item">
                      <span className="score-item-label">Experience (25%)</span>
                      <div className="score-item-bar">
                        <div className="score-item-fill" style={{ width: `${result.evaluation.experience_score}%` }} />
                      </div>
                      <span className="score-item-value">{result.evaluation.experience_score}</span>
                    </div>
                    <div className="score-item">
                      <span className="score-item-label">Industry (10%)</span>
                      <div className="score-item-bar">
                        <div className="score-item-fill" style={{ width: `${result.evaluation.industry_score}%` }} />
                      </div>
                      <span className="score-item-value">{result.evaluation.industry_score}</span>
                    </div>
                    <div className="score-item">
                      <span className="score-item-label">Education (10%)</span>
                      <div className="score-item-bar">
                        <div className="score-item-fill" style={{ width: `${result.evaluation.education_score}%` }} />
                      </div>
                      <span className="score-item-value">{result.evaluation.education_score}</span>
                    </div>
                    <div className="score-item">
                      <span className="score-item-label">Location (5%)</span>
                      <div className="score-item-bar">
                        <div className="score-item-fill" style={{ width: `${result.evaluation.location_score}%` }} />
                      </div>
                      <span className="score-item-value">{result.evaluation.location_score}</span>
                    </div>
                    <div className="score-item">
                      <span className="score-item-label">Bonus Skills (10%)</span>
                      <div className="score-item-bar">
                        <div className="score-item-fill" style={{ width: `${result.evaluation.bonus_score}%` }} />
                      </div>
                      <span className="score-item-value">{result.evaluation.bonus_score}</span>
                    </div>
                  </div>
                </div>

                {/* Candidate Profile */}
                <div className="section-card">
                  <h3>Candidate Profile</h3>
                  <div className="profile-info">
                    <div className="profile-row">
                      <span className="profile-label">Name</span>
                      <span className="profile-value">{result.candidate_profile.name || 'N/A'}</span>
                    </div>
                    <div className="profile-row">
                      <span className="profile-label">Email</span>
                      {result.candidate_profile.email ? (
                        <a href={`mailto:${result.candidate_profile.email}`} className="profile-link">
                          {result.candidate_profile.email}
                        </a>
                      ) : <span className="profile-value">N/A</span>}
                    </div>
                    <div className="profile-row">
                      <span className="profile-label">Contact</span>
                      {result.candidate_profile.phone ? (
                        <a href={`tel:${result.candidate_profile.phone.replace(/\D/g, '')}`} className="profile-link">
                          {result.candidate_profile.phone}
                        </a>
                      ) : <span className="profile-value">N/A</span>}
                    </div>
                    <div className="profile-row">
                      <span className="profile-label">Experience</span>
                      <span className="profile-value">{result.candidate_profile.total_experience_years || 0} years</span>
                    </div>
                  </div>
                </div>

                {/* Matched Skills */}
                {result.evaluation.matched_skills && result.evaluation.matched_skills.length > 0 && (
                  <div className="section-card" style={{ borderColor: '#10b981', background: '#f0fdf4' }}>
                    <h3 style={{ color: '#065f46', borderColor: '#bbf7d0' }}>
                      ✅ Matched Skills ({result.evaluation.matched_skills.length})
                    </h3>
                    <div className="skills-list">
                      {result.evaluation.matched_skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag" style={{ 
                          background: '#d1fae5', 
                          borderColor: '#a7f3d0', 
                          color: '#065f46',
                          fontWeight: 600 
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Skills */}
                <div className="section-card">
                  <h3>All Skills ({result.evaluation.all_skills?.length || result.candidate_profile.skills.length})</h3>
                  <div className="skills-list">
                    {(result.evaluation.all_skills || result.candidate_profile.skills).map((skill, idx) => {
                      const isMatched = result.evaluation.matched_skills?.includes(skill)
                      const isMissing = result.evaluation.missing_critical_skills?.includes(skill)
                      return (
                        <span 
                          key={idx} 
                          className="skill-tag"
                          style={{
                            background: isMatched ? '#d1fae5' : isMissing ? '#fee2e2' : '#f3f4f6',
                            borderColor: isMatched ? '#a7f3d0' : isMissing ? '#fecaca' : '#e5e7eb',
                            color: isMatched ? '#065f46' : isMissing ? '#991b1b' : '#374151'
                          }}
                        >
                          {skill}
                          {isMatched && ' ✓'}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Missing Skills */}
                {result.evaluation.missing_critical_skills && result.evaluation.missing_critical_skills.length > 0 && (
                  <div className="section-card" style={{ borderColor: '#ef4444', background: '#fef2f2' }}>
                    <h3 style={{ color: '#991b1b', borderColor: '#fecaca' }}>
                      ❌ Missing Skills ({result.evaluation.missing_critical_skills.length})
                    </h3>
                    <div className="skills-list">
                      {result.evaluation.missing_critical_skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag skill-missing">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input Grid */}
          <div className="main-grid">
            <div className="card">
              <div className="card-header"><h2>Job Description</h2></div>
              <div className="card-body">
                <textarea
                  name="jobDescription"
                  placeholder="Paste the job description here..."
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h2>Candidate Resume</h2></div>
              <div className="card-body">
                <div
                  className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${uploadLoading ? 'uploading' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.rtf"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  {uploadLoading ? (
                    <div className="upload-loading">
                      <span className="spinner" />
                      <p>Extracting text...</p>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">📁</div>
                      <p className="upload-text">
                        <strong>Drag & drop</strong> or{' '}
                        <span className="upload-link" onClick={onButtonClick}>browse</span>
                      </p>
                      <p className="upload-hint">PDF, DOCX, TXT (Max 10MB)</p>
                      {formData.uploadedFileName && (
                        <div className="uploaded-file">
                          <span className="file-icon">✅</span>
                          <span className="file-name">{formData.uploadedFileName}</span>
                          <button
                            className="file-remove"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFormData(prev => ({ ...prev, uploadedFileName: null, resumeText: '' }))
                            }}
                          >×</button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="form-divider"><span>OR paste text</span></div>

                <textarea
                  name="resumeText"
                  placeholder="Paste resume text here..."
                  value={formData.resumeText}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="action-bar">
            <button className="btn btn-secondary" onClick={clearData}>Clear</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={evaluateCandidate}
              disabled={loading}
            >
              {loading ? <><span className="spinner" />Evaluating...</> : <>Evaluate</>}
            </button>
          </div>

          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>Ready to Evaluate</h3>
              <p>Upload a resume and enter a job description to get started.</p>
            </div>
          )}
        </main>
      )}

      {/* Kanban View */}
      {currentView === VIEWS.KANBAN && (
        <KanbanBoard
          candidates={candidates}
          onUpdateCandidates={handleUpdateCandidates}
          onViewCard={handleViewCard}
          onAddProfile={() => setShowAddProfile(true)}
          onMoveToOnboard={handleMoveToOnboard}
        />
      )}

      {/* Modals */}
      {showCardDetail && selectedCandidate && (
        <CardDetailModal
          candidate={selectedCandidate}
          onClose={() => setShowCardDetail(false)}
          onUpdate={handleUpdateCard}
          onDelete={handleDeleteCard}
        />
      )}

      {showAddProfile && (
        <AddProfileModal
          onClose={() => setShowAddProfile(false)}
          onAdd={handleAddProfile}
        />
      )}

      <footer className="footer">
        <p>AI Recruitment Screening Agent • Built with React</p>
      </footer>
    </div>
  )
}

export default App
