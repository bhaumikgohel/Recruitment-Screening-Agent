# AI Recruitment Screening Agent

An intelligent recruitment screening application built with React that evaluates candidates against job descriptions using AI-powered analysis. Features include resume parsing, weighted scoring, kanban pipeline management, and communication tools.

![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.3.1-purple.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🚀 Features

### 1. AI-Powered Candidate Screening
- **Resume Parsing**: Extract text from PDF, DOCX, DOC, and TXT files
- **Smart Skill Matching**: Identifies matching, missing, and additional skills
- **Weighted Scoring System**:
  - Required Skills Match: 40%
  - Experience Match: 25%
  - Industry Relevance: 10%
  - Education Match: 10%
  - Location Match: 5%
  - Bonus Skills: 10%
- **Decision Logic**: Automatic shortlisting based on score thresholds

### 2. Interactive Results Dashboard
- Overall match score with visual progress bars
- Detailed breakdown of all 6 scoring criteria
- Match level indicator (Strong Fit / Moderate Fit / Weak Fit)
- Reasoning summary with strengths and risk flags
- Color-coded skill display (matched/missing/all)

### 3. Communication Tools (Auto-enabled for Shortlisted)
- **Email**: One-click compose email to candidate
- **WhatsApp**: Direct WhatsApp message with pre-filled text
- Contact information with clickable links (email + phone)

### 4. Kanban Board Pipeline
Manage candidates through 8 stages:
- 📋 **To Do** - New candidates awaiting review
- ✅ **Shortlisted** - Passed initial screening
- 🔵 **Round 1 (Initial)** - First interview
- 🟣 **Round 2 (Technical)** - Technical interview
- 🟠 **Round 3 (Practical)** - Practical assessment
- 🩷 **Round 4 (HR)** - HR final interview
- 🔴 **On Hold** - Paused (with reason tracking)
- 🟢 **Onboard** - Successfully hired

### 5. Pipeline Management
- **Drag & Drop**: Move cards between stages
- **Card Details**: Click any card to view/edit candidate info
- **On-Hold Reasons**: Required reason when moving to "On Hold"
- **Onboard Protection**: Completed candidates are locked (disabled)
- **Manual Entry**: Add candidates manually with "+ Add User Profile"
- **Local Persistence**: All data saved to localStorage

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **PDF Parsing**: pdfjs-dist 4.0.379
- **DOCX Parsing**: mammoth
- **Styling**: Pure CSS (no frameworks)
- **Storage**: LocalStorage API

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

## 🎯 Usage Guide

### Screening a Candidate

1. **Enter Job Description**
   - Paste the job description in the left text area
   - Include required skills, experience, and qualifications

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
   - See final decision and reasoning

5. **Shortlisted?**
   - WhatsApp and Email buttons appear automatically
   - Click "Move to Kanban" to add to pipeline

### Managing Pipeline (Kanban)

1. **Navigate to Kanban Board**
   - Click "Kanban Board" tab in the header

2. **Move Candidates**
   - Drag and drop cards between stages
   - Or click a card to edit and change stage

3. **View/Edit Card**
   - Click any card (except Onboard) to open details
   - Edit candidate information
   - Update stage, skills, notes

4. **On Hold**
   - When moving to "On Hold", system asks for reason
   - Reason is displayed on the card

5. **Add Manual Profile**
   - Click "+ Add User Profile" button
   - Fill in candidate details
   - New profile appears in "To Do" stage

6. **Complete Hiring**
   - Move card to "Onboard" stage
   - Card becomes locked (disabled)

## 📊 Scoring Algorithm

### Decision Matrix
| Score Range | Decision | Confidence |
|-------------|----------|------------|
| ≥ 80 | Shortlist | High |
| 60-79 | Shortlist | Medium |
| < 60 | Reject | Low |

*Alternative: Candidates with ≤ 3 missing skills are also shortlisted*

### Match Levels
| Overall Score | Match Level | Badge Color |
|---------------|-------------|-------------|
| ≥ 80 | Strong Fit | Green |
| 60-79 | Moderate Fit | Yellow |
| < 60 | Weak Fit | Red |

## 🎨 UI Components

### Color Scheme
- **Primary Blue**: #2563eb (buttons, links)
- **Success Green**: #10b981 (shortlisted, onboard)
- **Warning Yellow**: #f59e0b (manual review)
- **Danger Red**: #ef4444 (reject, on hold)
- **WhatsApp Green**: #25d366 (WhatsApp button)

### Responsive Design
- Desktop: Side-by-side layout
- Tablet: Stacked layout
- Mobile: Optimized touch targets

## 🔧 File Structure

```
ai-recruitment-app/
├── src/
│   ├── components/
│   │   ├── KanbanBoard.jsx      # Kanban board component
│   │   ├── KanbanBoard.css      # Kanban styles
│   │   ├── CardDetailModal.jsx  # Card edit modal
│   │   ├── CardDetailModal.css  # Modal styles
│   │   ├── AddProfileModal.jsx  # Add candidate modal
│   │   └── AddProfileModal.css  # Modal styles
│   ├── utils/
│   │   ├── pdfParser.js         # PDF text extraction
│   │   └── docxParser.js        # DOCX text extraction
│   ├── App.jsx                  # Main application
│   ├── App.css                  # App styles
│   ├── index.css                # Global styles
│   └── main.jsx                 # Entry point
├── public/
│   └── pdf.worker.mjs           # PDF.js worker
├── dist/                        # Production build
└── package.json
```

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

- Built with [React](https://react.dev)
- PDF parsing by [PDF.js](https://mozilla.github.io/pdf.js/)
- DOCX parsing by [Mammoth](https://github.com/mwilliamson/mammoth.js)
- Icons via Unicode emoji

---

**Developed by**: Bhaumik Gohel  
**Version**: 1.0.0  
**Last Updated**: February 2026
