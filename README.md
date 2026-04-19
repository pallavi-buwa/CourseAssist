# Claro.

> Your LMS gives you the grade. We make it clear.

---

## Problem

In large university classrooms (50–200+ students), a significant portion of students struggle silently.

- They do not ask questions
- They do not attend office hours
- They do not self-identify confusion

By the time professors detect issues (e.g., midterms), intervention is often too late — eight weeks of silent confusion.

**Root cause:** The system depends on student self-disclosure. The students who need help most are the least likely to speak up.

---

## Solution

Claro is an AI comprehension layer that turns raw quiz scores into diagnoses — prerequisite gaps, language barriers, and predicted exam outcomes — so professors can intervene before students fail.

It runs on assessment data that already exists in every LMS. No new student behavior. No new professor habits.

### What changes

- **Today:** Professor sees "Marcus scored 45%."
- **With Claro:** Professor sees "Marcus scored 45% because of a Week 3 prerequisite gap, not Week 7 content. 14 students share the same root cause. Question phrasing is filtering non-native speakers."

---

## Product

### Professor View

Three tabs on one page:

**Knowledge Graph** — Professor pastes their syllabus. AI extracts concepts and maps dependencies as a force-directed graph. Import quiz/exam results from the LMS — nodes light up green (understood), yellow (shaky), or red (gap) based on cohort comprehension. Click a red node to see:
- The specific misconception
- Whether it's a language barrier, concept gap, or prerequisite failure
- Which earlier concept is the root cause
- A concrete 5-minute intervention

Prediction mode: professor pastes an upcoming midterm. The graph re-colors showing predicted outcomes — which questions will fail, why, and how to fix them before students sit down.

**Cohort Insights** — Patterns across the class: language filters creating score gaps, prerequisite cascades, at-risk student profiles with root causes.

**Material Analyzer** — Professor pastes assignment text or exam questions. Live AI flags phrases that create comprehension barriers — academic jargon, cultural assumptions, unstated prerequisites, vague assessment criteria. Each flag includes a concrete rephrase.

### Student View

Personal 3D knowledge graph across enrolled courses. Nodes colored by individual performance. Cross-course connections show where the same concept appears in multiple classes. Opt-in, pull-based — like checking Spotify Wrapped.

---

## AI Architecture

Analytical, not conversational. No chatbot. No tutor. AI operates at specific trigger points:

1. **Comprehension Decomposition** — Decomposes quiz scores into root causes: concept gap vs language filter vs prerequisite failure vs format confusion.
2. **Material Analysis** (live) — Reads exam questions and flags phrasing that creates invisible barriers for non-native speakers, first-gen students, and neurodivergent learners.
3. **Knowledge Graph Generator** — Extracts concepts and dependencies from syllabus text. Builds the graph in seconds.
4. **Exam Prediction** — Takes an upcoming assessment and predicts outcomes based on current comprehension data.

---

## Product Flow

1. Professor pastes syllabus → knowledge graph builds itself
2. Professor imports quiz/exam results from LMS → nodes light up by comprehension
3. Professor clicks a red node → diagnosis panel: misconception, root cause, language filter, intervention
4. Professor pastes upcoming midterm → prediction mode shows expected outcomes
5. Professor adjusts lecture or rephrases exam → students benefit without ever self-disclosing

Students change nothing. They take exams like they always do. Claro works on data they already generate.

---

## Demo Scope

### Live AI
- Material Inclusivity Analyzer
- Knowledge Graph Generator
- Micro-Check Generator

### Mocked (with realistic data)
- Cohort comprehension overlay on graph
- Node diagnostic panels
- Prediction mode
- Cohort pattern alerts
- Cross-course student graph

---

## Moat (7 Powers Framework)

**Counter-Positioning** — LMS platforms sell to IT procurement. Claro sells to the provost. They must stay neutral; Claro is opinionated. They can't add diagnostic AI without alienating their existing buyers.

**Data Network Effects with Fast Decay** — Comprehension data decays fast (like Waze traffic data). Every quiz recalibrates. A new entrant starts at zero. Claro has semesters of accumulated patterns. Cross-course deployment creates indirect network effects.

**Switching Costs** — After two semesters, the professor's knowledge graph is calibrated to their course. Predictions are tuned to their teaching style. Intervention history tracks what worked. None of it transfers.

---

## Metrics

### North Star Metric
- Professor interventions triggered by Claro per week

### Leading Indicators
- Dashboard opens before lecture
- Material analyzer usage
- Prediction mode activations

### Lagging Indicators
- Student comprehension improvement (pre/post)
- Course satisfaction delta
- Failure rate reduction

---

## Target Users

### User
- Professors teaching large, diverse classes (50–200+ students)
- Particularly in public universities and introductory courses

### Buyer
- Deans, department heads, provosts
- Cares about: retention, equity metrics, accreditation

### Beneficiary
- International students, first-gen students, neurodivergent learners
- They benefit without needing to self-identify

---

## Go-To-Market

1. **Land** with the free material analyzer — professor pastes an exam, gets flags, zero commitment
2. **Pilot** one department — dean with worst retention mandates a one-semester trial
3. **Prove** with outcomes — comprehension delta, failure rate reduction, intervention count
4. **Expand** across the university — dean becomes internal champion, cross-course graph unlocks new value

---

## Tech Stack

- **Frontend:** React 18, Tailwind CSS, Vite
- **Graph:** react-force-graph (2D professor view), react-force-graph-3d + Three.js (3D student view)
- **Backend:** Firebase (auth, realtime sync)
- **AI:** Claude API (Anthropic) via direct browser access
- **Deployment:** Vercel

---

## Risks

### Riskiest Assumption
Quiz decomposition accurately identifies root causes.

### Mitigation
Validate against actual exam outcomes in a one-semester pilot. Material analyzer delivers value regardless — it works even if decomposition needs tuning.

---

## Team

Built for JHU Product Hackathon 2026 — Round 2.

---

## License

MIT
