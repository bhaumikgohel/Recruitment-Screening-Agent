# AI Recruitment Screening Agent

An intelligent recruitment screening application built with React that evaluates candidates against job descriptions using AI-powered analysis. Features include resume parsing, weighted scoring, kanban pipeline management, communication tools, and comprehensive interview tracking.

![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.3.1-purple.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🚀 Features

### 1. AI-Powered Candidate Screening
- **Resume Parsing**: Extract text from PDF, DOCX, DOC, and TXT files
- **Smart Skill Matching**: Identifies matching, missing, and additional skills (50+ tech skills supported)
- **Location Extraction**: Automatically detects candidate location from resume
- **Weighted Scoring System**:
  - Required Skills Match: 40%
  - Experience Match: 25%
  - Industry Relevance: 10%
  - Education Match: 10%
  - Location Match: 5%
  - Bonus Skills: 10%
- **Strict Decision Logic**: Automatic shortlisting based on score thresholds AND matched skills count

### 2. Job Description Lock Feature
- **Lock JD**: Prevent accidental changes to job description during multiple screenings
- **Persistent**: Locked JD stays saved even after clearing data or page refresh
- **Visual Indicator**: Lock icon shows JD status (locked/unlocked)
- **One-click Toggle**: Easy lock/unlock with a single click

### 3. Interactive Results Dashboard
- Overall match score with visual progress bars
- Detailed breakdown of all 6 scoring criteria
- Match level indicator (Strong Fit / Moderate Fit / Weak Fit)
- Decision badge with confidence level (High / Medium / Low)
- Reasoning summary with strengths and risk flags
- Color-coded skill display (matched/missing/all)

### 4. Communication Tools
- **Email**: One-click compose email to candidate from card detail view
- **WhatsApp**: Direct WhatsApp message with candidate's phone number
- **In-Card Access**: WhatsApp and Email icons available in candidate detail modal
- **Popup Email Composer**: Custom subject and message before sending

### 5. Kanban Board Pipeline
Manage candidates through 8 stages:
- 📋 **To Do** - New candidates awaiting review
- ✅ **Shortlisted** - Passed initial screening
- 🔵 **Round 1 (Initial)** - First interview
- 🟣 **Round 2 (Technical)** - Technical interview
- 🟠 **Round 3 (Practical)** - Practical assessment
- 🩷 **Round 4 (HR)** - HR final interview
- 🔴 **On Hold** - Paused (with reason tracking)
- 🟢 **Onboard** - Successfully hired

### 6. Duplicate Detection
- **Automatic Check**: Prevents adding same candidate twice
- **Matching Criteria**: Detects duplicates by email or phone number
- **Error Message**: Clear notification when duplicate is detected
- **Data Integrity**: Ensures clean candidate database

### 7. Pipeline Management
- **Drag & Drop**: Move cards between stages
- **Card Details**: Click any card to view/edit comprehensive candidate info
- **On-Hold Reasons**: Required reason when moving to "On Hold"
- **Onboard Protection**: Completed candidates are locked (disabled)
- **Manual Entry**: Add candidates manually with "+ Add User Profile"
- **Local Persistence**: All data saved to localStorage
- **Custom Delete Modal**: Beautiful confirmation modal instead of browser popup

### 8. Interview Tracking
Track interview details in card view:
- **Interview Taken By**: Record interviewer name
- **Interviewer Comment**: Store detailed feedback and observations
- **Visible on Card**: Interviewer name displayed on kanban card
- **Editable**: Update anytime through card detail modal

### 9. Resume Management
- **File Display**: Shows uploaded resume filename in card detail
- **Content Preview**: View full resume text with proper formatting
- **Persistent**: Resume travels with candidate to kanban board
- **Scrollable**: Long resumes displayed in scrollable area

---

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **PDF Parsing**: pdfjs-dist 4.0.379
- **DOCX Parsing**: mammoth
- **Styling**: Pure CSS (no frameworks)
- **Storage**: LocalStorage API

---

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd ai-recruitment-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🎯 Usage Guide

### Screening a Candidate

1. **Enter Job Description**
   - Paste the job description in the left text area
   - Include required skills, experience, and qualifications
   - Click the 🔒 lock icon to lock JD for multiple screenings

2. **Upload Resume**
   - Drag & drop a PDF/DOCX/TXT file, or
   - Click "browse" to select a file, or
   - Paste resume text directly in the right text area

3. **Evaluate**
   - Click the "Evaluate" button
   - Wait for AI analysis (1-2 seconds)

4. **Review Results**
   - View overall match score
   - Check detailed score breakdown (6 criteria)
   - Review matched/missing skills
   - See final decision with confidence level
   - **Note**: Matched skills must be > 3 for shortlisting

5. **Shortlisted?**
   - WhatsApp and Email buttons appear automatically
   - Click "Move to Kanban" to add to pipeline
   - Duplicate candidates will be rejected with error message

### Managing Pipeline (Kanban)

1. **Navigate to Kanban Board**
   - Click "Kanban Board" tab in the header

2. **View Candidate Info**
   - Name, Role, Location, Score displayed on card
   - Interviewer name shown if available
   - Date added shown at bottom

3. **Move Candidates**
   - Drag and drop cards between stages
   - Or click a card to edit and change stage

4. **View/Edit Card Details**
   - Click any card (except Onboard) to open details
   - Edit candidate information (name, email, phone, role, location)
   - Update stage, skills, notes
   - View resume filename and content
   - **Contact**: Click WhatsApp or Email icons to reach candidate
   - **Interview Details**: Add interviewer name and comments
   - **Delete**: Click Delete button for custom confirmation modal

5. **On Hold**
   - When moving to "On Hold", system asks for reason
   - Reason is displayed on the card

6. **Add Manual Profile**
   - Click "+ Add User Profile" button
   - Fill in candidate details
   - New profile appears in "To Do" stage

7. **Complete Hiring**
   - Move card to "Onboard" stage
   - Card becomes locked (disabled)

---

## 📊 Scoring Algorithm

### Decision Matrix
| Condition | Decision | Confidence |
|-----------|----------|------------|
| Matched Skills ≤ 3 | **Reject** | Low |
| Overall Score ≥ 80 AND Matched Skills > 3 | **Shortlist** | High |
| Overall Score 60-79 AND Matched Skills > 3 | **Shortlist** | Medium |
| Overall Score < 60 | **Reject** | Low |

### Match Levels
| Overall Score | Match Level | Badge Color |
|---------------|-------------|-------------|
| ≥ 80 | Strong Fit | Green |
| 60-79 | Moderate Fit | Yellow |
| < 60 | Weak Fit | Red |

### Scoring Weights
| Criteria | Weight |
|----------|--------|
| Required Skills Match | 40% |
| Experience Match | 25% |
| Industry Relevance | 10% |
| Education Match | 10% |
| Location Match | 5% |
| Bonus Skills | 10% |

---

## 🎨 UI Components

### Color Scheme
- **Primary Blue**: #2563eb (buttons, links, active states)
- **Success Green**: #10b981 (shortlisted, onboard, WhatsApp)
- **Warning Yellow**: #f59e0b (manual review, On Hold)
- **Danger Red**: #ef4444 (reject, delete button)
- **WhatsApp Green**: #25d366 (WhatsApp button)

### Responsive Design
- **Desktop**: Side-by-side layout, full kanban board
- **Tablet**: Stacked layout, scrollable columns
- **Mobile**: Single column, optimized touch targets, full-width modals

---

## 🔧 File Structure

```
ai-recruitment-app/
├── src/
│   ├── components/
│   │   ├── KanbanBoard.jsx      # Kanban board with drag-drop
│   │   ├── KanbanBoard.css      # Kanban styles
│   │   ├── CardDetailModal.jsx  # Card edit with interview tracking
│   │   ├── CardDetailModal.css  # Modal styles
│   │   ├── AddProfileModal.jsx  # Add candidate modal
│   │   └── AddProfileModal.css  # Modal styles
│   ├── utils/
│   │   ├── pdfParser.js         # PDF text extraction
│   │   └── docxParser.js        # DOCX text extraction
│   ├── App.jsx                  # Main application logic
│   ├── App.css                  # App styles
│   ├── index.css                # Global styles & CSS variables
│   └── main.jsx                 # Entry point
├── public/
│   └── pdf.worker.mjs           # PDF.js worker
├── dist/                        # Production build
└── package.json
```

---

## 💡 Key Features Explained

### Job Description Lock
When screening multiple candidates for the same position:
1. Enter the job description
2. Click the 🔒 lock icon
3. JD is now protected - clearing data won't remove it
4. Upload and evaluate multiple resumes with same JD
5. Click 🔓 to unlock when you need to change the JD

### Duplicate Detection
The system prevents adding the same candidate twice:
- Compares email addresses (case-insensitive)
- Compares phone numbers (digits only)
- Shows error: "This candidate already exists in the Kanban board"

### Interview Tracking
Track who interviewed the candidate and their feedback:
1. Open card detail view
2. Scroll to "Interview Details" section
3. Enter interviewer name
4. Add detailed comments/feedback
5. Save changes - interviewer name appears on kanban card

### Resume Content View
View the full resume text from kanban board:
1. Open card detail view
2. Scroll to "Resume" section
3. See uploaded filename
4. Resume content displayed in formatted text area
5. Full content visible with scroll if needed

### Communication from Kanban
Contact candidates directly from the pipeline:
1. Open any candidate card
2. Click "WhatsApp" button → Opens WhatsApp with candidate's number
3. Click "Email" button → Opens email composer popup
4. Enter subject and message
5. Click Send → Opens default mail client

---

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## 📝 License

MIT License - feel free to use for personal or commercial projects.

---

## 🙏 Credits

- Built with [React](https://react.dev)
- PDF parsing by [PDF.js](https://mozilla.github.io/pdf.js/)
- DOCX parsing by [Mammoth](https://github.com/mwilliamson/mammoth.js)
- Icons via SVG and Unicode emoji

---

**Developed by**: Bhaumik Gohel  
**Version**: 2.0.0  
**Last Updated**: February 2026
