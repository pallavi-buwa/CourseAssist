# Claro — Inclusive learning intelligence

**Canvas gives you the grade. We give you the why.**

Professors already see quiz results—but usually as a number: *"Marcus got 45%."* Claro turns that into a **diagnosis**: which concept is missing, how many students share the **same root cause**, and how an upcoming assessment (e.g. midterm Question 4) intersects with that cohort. We don't make feedback faster—we make it **useful**. A score is a number; Claro maps it to *why* and *what to do next*.

---



\## Problem



In large university classrooms (50–200+ students), a significant portion of students struggle silently.



\- They do not ask questions  

\- They do not attend office hours  

\- They do not self-identify confusion  



By the time professors detect issues (e.g., midterms), intervention is often too late.



\*\*Root Issue:\*\*  

The system depends on student self-disclosure, but the students who need help the most are the least likely to speak up.



\---



\## Solution



We built a real-time comprehension sensing system that detects learning gaps before they become failures.



\### Core Idea



\- Students read course content on the platform  

\- Lightweight micro-checks capture understanding in seconds  

\- AI constructs a knowledge graph of concepts and dependencies  

\- Professors gain visibility into cohort-level comprehension  

\- Students gain visibility into their own understanding across courses  



\---



\## Features



\### Student Reading Experience

\- Minimal, distraction-free interface  

\- 2–3 micro-checks per section  

\- No grading or pressure (approximately 3 seconds per check)  

\- Immediate nudges for incorrect responses  

\- Live updates to system state  



\---



\### Knowledge Graph (Core System)



A dynamic concept map:



\- \*\*Nodes\*\* represent concepts  

\- \*\*Edges\*\* represent dependencies  

\- \*\*Colors\*\* represent comprehension levels  

&#x20; - Green: understood  

&#x20; - Yellow: partial understanding  

&#x20; - Red: learning gap  



\#### Two Modes:

\- \*\*Professor View\*\*: cohort-level insights  

\- \*\*Student View\*\*: individual understanding across courses  



\---



\### Professor Dashboard



\- Real-time visibility into student comprehension  

\- Drill-down capabilities:

&#x20; - Misconceptions  

&#x20; - Affected students  

&#x20; - Root causes  



\- Includes:

&#x20; - Cohort pattern alerts  

&#x20; - Drift detection  

&#x20; - Micro-check accuracy heatmaps  

&#x20; - AI-generated intervention suggestions  



\---



\### AI Capabilities



\#### 1. Material Inclusivity Analyzer (Live)

\- Input: assignment or syllabus text  

\- Output:

&#x20; - Ambiguous phrasing  

&#x20; - Cultural assumptions  

&#x20; - Missing prerequisites  

&#x20; - Suggested rephrases  



\---



\#### 2. Micro-Check Generator

\- Generates conceptual questions (not recall-based)  

\- Each incorrect option maps to a specific misconception  



\---



\#### 3. Knowledge Graph Generator

\- Extracts:

&#x20; - Concepts (nodes)  

&#x20; - Dependencies (edges)  

\- Builds the graph progressively as course content is uploaded  



\---



\#### 4. Intervention Suggester

\- Analyzes cohort patterns  

\- Produces actionable teaching recommendations  



Example:  

“Clarify the difference between argumentative and descriptive writing. A subset of students demonstrates task clarity confusion rather than content gaps.”



\---



\## Product Flow



1\. Professor uploads weekly material  

2\. AI:

&#x20;  - Analyzes content  

&#x20;  - Generates micro-checks  

&#x20;  - Updates the knowledge graph  



3\. Students:

&#x20;  - Read content  

&#x20;  - Respond to micro-checks  



4\. System:

&#x20;  - Detects misconceptions  

&#x20;  - Updates the graph in real time  



5\. Professor:

&#x20;  - Reviews dashboard prior to lecture  

&#x20;  - Applies targeted interventions  



\---



\## Demo Scope



\### Real (Live AI)

\- Material Inclusivity Analyzer  

\- Micro-Check Generator  

\- Knowledge Graph Generator  

\- Live student-to-graph updates  



\### Mocked

\- Cohort pattern alerts  

\- Intervention suggestions  

\- Cross-course student graph  



\---



\## Tech Stack (Suggested)



\- Frontend: React, Tailwind CSS  

\- Graph Visualization: D3.js or react-force-graph  

\- Backend: Node.js or Firebase  

\- Realtime Communication: WebSockets or Firebase Realtime Database  

\- AI Integration: Claude API or OpenAI  



\---



\## Metrics



\### North Star Metric

\- Number of AI-triggered professor interventions per week  



\### Leading Indicators

\- Micro-check completion rate  

\- Dashboard usage prior to lectures  

\- Material analyzer usage  



\### Lagging Indicators

\- Student comprehension improvement  

\- Assignment completion rates  

\- Course satisfaction metrics  



\---



\## Target Users



\### Primary

\- Professors teaching large, diverse classes  

\- Particularly in public universities and introductory courses  



\### Secondary

\- Students managing multiple courses  

&#x20; - International students  

&#x20; - First-generation students  

&#x20; - Neurodivergent learners  



\### Buyer

\- Deans, department heads, and provosts  



\---



\## Architecture Philosophy



\- Focus on analytical AI rather than conversational AI  

\- AI operates at specific trigger points:

&#x20; - Material upload  

&#x20; - Dashboard analysis  



No continuous chatbot layer is required  



\---



\## Competitive Positioning



\- Learning Management Systems track engagement but not comprehension  

\- AI tutors support individual learners but lack cohort visibility  

\- This platform provides system-level insight into understanding across a class  



\---



\## Moat



\- Real-time comprehension data that decays quickly and is difficult to replicate  

\- Cross-course knowledge graph  

\- Cohort-level pattern detection  

\- Accumulated institutional insights over time  



\---



\## Risks



\### Primary Risk

\- Behavioral signals may not accurately represent comprehension  



\### Mitigation Strategy

\- Validate predictions against assessment outcomes  

\- Maintain independent value through the material analyzer  



\---



\## Future Work



\- Integration with LMS platforms (e.g., Canvas, Blackboard)  

\- Longitudinal student learning profiles  

\- Accessibility-driven personalization  

\- Predictive academic risk detection  

\- Cross-institution benchmarking  



\---



\## Summary



\- Existing systems measure activity  

\- AI tutors assist individuals  

\- This platform identifies comprehension gaps at the system level in real time  



\---



\## Team



Built for JHU Product Hackathon 2026 — Round 2 :contentReference\[oaicite:0]{index=0}



\---



\## License



MIT (or hackathon default)



\---

