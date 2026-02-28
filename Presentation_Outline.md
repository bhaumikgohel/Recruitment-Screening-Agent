# AI Recruitment System - Presentation Outline
## Copy this content into PowerPoint slides

---

## SLIDE 1: Title Slide

**Title:** AI Recruitment Screening Agent

**Subtitle:** Smart Hiring Made Simple

**Tagline:** "Transforming Recruitment with AI-Powered Screening"

**Presenter:** [Your Name]
**Date:** [Today's Date]

---

## SLIDE 2: Current Problems HR Faces

**Title:** Challenges in Traditional Recruitment

**Content:**

❌ **Time Consuming**
- HR spends 20-30 minutes per resume review
- Manual skill matching is tedious
- Tracking candidates across stages is difficult

❌ **Inconsistent Screening**
- Different HRs evaluate differently
- Subjective decision making
- No standardized scoring system

❌ **Poor Candidate Management**
- Resumes lost in email threads
- No visibility of pipeline status
- Difficult to track interview feedback

❌ **Communication Gaps**
- Switching between apps to contact candidates
- No centralized candidate information
- Hard to share feedback with team

---

## SLIDE 3: Example Scenario (Before)

**Title:** A Day in HR Without Our System

**Story:**
Meet Priya, an HR Manager at Tech Solutions Ltd.

**Morning:**
- Receives 50+ resumes for "Senior Developer" position
- Opens first resume (PDF) - reads manually
- Tries to match skills with job description
- Takes 15 minutes to decide: "Maybe suitable"

**Afternoon:**
- Can't remember which resumes were shortlisted
- Emails candidate for interview - wrong email thread
- Team asks: "Who interviewed this candidate?" - No record
- Candidate calls back - no information available

**Result:**
- 3 candidates lost in process
- Wrong candidate got shortlisted
- 4 hours wasted on manual work

---

## SLIDE 4: Purpose of This System

**Title:** Why We Built This Solution

**Purpose Statement:**
To automate and streamline the recruitment process using AI, ensuring fair, fast, and trackable candidate screening.

**Key Goals:**

✅ **Save Time**
- Evaluate candidate in 2 seconds (vs 20 minutes manually)

✅ **Ensure Consistency**
- Same scoring criteria for every candidate
- No human bias in initial screening

✅ **Better Organization**
- Visual kanban board for pipeline management
- All candidate info in one place

✅ **Easy Communication**
- One-click WhatsApp and Email
- Interview feedback tracking

✅ **Prevent Mistakes**
- Duplicate detection
- Locked job descriptions
- Delete confirmation

---

## SLIDE 5: How It Works - Screening

**Title:** Step-by-Step Screening Process

**Step 1:** Enter Job Description
- Paste job requirements
- Lock JD for multiple screenings 🔒

**Step 2:** Upload Resume
- Drag & drop PDF/DOCX/TXT
- Or paste text directly

**Step 3:** AI Evaluation
- System extracts: Name, Email, Phone, Location, Skills
- Calculates score (0-100) based on 6 criteria
- Checks: Matched Skills > 3 AND Score ≥ 60

**Step 4:** View Results
- Overall score with color badge
- Matched vs Missing skills
- Decision: Shortlist or Reject
- Confidence level: High/Medium/Low

**Step 5:** Move to Kanban
- Click "Move to Kanban" button
- Candidate appears in "To Do" or "Shortlisted" column

---

## SLIDE 6: How It Works - Pipeline Management

**Title:** Kanban Board - Track Candidates Visually

**The 8 Stages:**

📋 **To Do** → New candidates waiting for review

✅ **Shortlisted** → Passed AI screening

🔵 **Round 1** → Initial interview scheduled

🟣 **Round 2** → Technical interview

🟠 **Round 3** → Practical test/assignment

🩷 **Round 4** → HR final round

🔴 **On Hold** → Paused (must add reason)

🟢 **Onboard** → Hired! (locked stage)

**Actions:**
- Drag & drop cards between stages
- Click card to view full details
- Add interviewer name and comments
- Contact via WhatsApp/Email from card view

---

## SLIDE 7: Key Features

**Title:** Powerful Features for Modern HR

**Feature 1: Smart Scoring (Strict Criteria)**
- Matched Skills > 3 required
- Score ≥ 60 required for shortlisting
- 6 weighted criteria for fair evaluation

**Feature 2: Duplicate Detection**
- Prevents adding same candidate twice
- Checks email and phone number
- Error message if duplicate found

**Feature 3: JD Lock**
- Lock job description during bulk screening
- Persists after clearing data
- One-click lock/unlock

**Feature 4: Interview Tracking**
- Record "Interview Taken By" name
- Add detailed interviewer comments
- Visible on kanban card

**Feature 5: Resume Viewer**
- See uploaded filename
- View full resume content in card detail
- Preserved when moving to kanban

**Feature 6: Communication Hub**
- WhatsApp button → Opens chat with candidate
- Email button → Compose and send email
- Both available in card detail view

---

## SLIDE 8: The Solution - Benefits

**Title:** What Our System Solves

| Problem | Our Solution | Benefit |
|---------|--------------|---------|
| Slow screening | AI evaluation in 2 seconds | Save 90% time |
| Inconsistent decisions | Standardized scoring | Fair hiring |
| Lost resumes | Kanban board with all data | Organized pipeline |
| No interview records | Interview tracking fields | Better feedback |
| Duplicate entries | Auto duplicate detection | Clean database |
| App switching | Built-in WhatsApp/Email | Faster communication |
| Changing JD by mistake | JD Lock feature | Accurate screening |

---

## SLIDE 9: Decision Criteria

**Title:** How Our AI Makes Decisions

**Strict Shortlisting Rules:**

**REJECT if:**
- Matched Skills ≤ 3
- Overall Score < 60

**SHORTLIST if:**
- Matched Skills > 3 AND
- Overall Score ≥ 60

**Confidence Levels:**
- **High Confidence:** Score ≥ 80
- **Medium Confidence:** Score 60-79
- **Low Confidence:** Score < 60

**Match Levels:**
- 🟢 **Strong Fit:** Score ≥ 80
- 🟡 **Moderate Fit:** Score 60-79
- 🔴 **Weak Fit:** Score < 60

---

## SLIDE 10: Demo Screenshots

**Title:** System in Action

**(Insert screenshots here)**

1. **Screening Page**
   - Job description textarea with lock icon
   - Resume upload area
   - Evaluate button

2. **Results Dashboard**
   - Score card with percentage
   - Skills comparison
   - Decision badge

3. **Kanban Board**
   - 8 columns with colored headers
   - Candidate cards with info
   - Drag and drop interface

4. **Card Detail View**
   - Contact buttons (WhatsApp/Email)
   - Interview details section
   - Resume content viewer
   - Delete confirmation modal

---

## SLIDE 11: Technical Overview

**Title:** Built with Modern Technology

**Frontend:**
- React 19.2.0 - UI components
- Vite 7.3.1 - Fast build tool
- Pure CSS - Custom styling

**Parsing:**
- PDF.js - Extract text from PDFs
- Mammoth - Extract text from DOCX

**Storage:**
- LocalStorage - Save data in browser
- No server required - runs entirely client-side

**Key Files:**
- `App.jsx` - Main logic and evaluation
- `KanbanBoard.jsx` - Pipeline management
- `CardDetailModal.jsx` - Candidate editing

---

## SLIDE 12: Conclusion

**Title:** Transform Your Hiring Process Today

**Summary:**
✅ Save time with AI screening (2 seconds vs 20 minutes)
✅ Ensure fair decisions with standardized scoring
✅ Stay organized with visual kanban board
✅ Track interviews with built-in feedback system
✅ Communicate faster with integrated WhatsApp/Email

**Call to Action:**
"Ready to modernize your recruitment?"

**Questions?**

**Thank You!**

---

## SPEAKER NOTES

### Slide 2 - Problems:
- Emphasize the pain points HR teams face daily
- Ask audience: "How many of you face these issues?"

### Slide 3 - Example:
- Tell the story in relatable way
- Make it personal - "We've all been there"

### Slide 5-6 - How It Works:
- Walk through the actual process
- Mention it's simple and intuitive

### Slide 7 - Features:
- Highlight the strict criteria (matched skills > 3)
- Emphasize duplicate detection prevents mistakes

### Slide 9 - Decision Criteria:
- This is important - explains WHY candidates get shortlisted
- Mention it's transparent and fair

### Slide 12 - Conclusion:
- End with confidence
- Invite questions
