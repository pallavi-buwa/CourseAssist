import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import BrainIntro from './components/BrainIntro.jsx'

import LoginPage          from './routes/LoginPage.jsx'
import StudentHome        from './routes/StudentHome.jsx'
import StudentReadingView from './routes/StudentReadingView.jsx'
import StudentDashboard   from './routes/StudentDashboard.jsx'
import ProfessorHome      from './routes/ProfessorHome.jsx'
import ProfessorDashboard from './routes/ProfessorDashboard.jsx'
import MaterialAnalyzer   from './routes/MaterialAnalyzer.jsx'
import StudentNotes       from './routes/StudentNotes.jsx'

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  if (!introDone) {
    return <BrainIntro onEnter={() => setIntroDone(true)} />
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"                              element={<LoginPage />} />
          <Route path="/student/home"                  element={<StudentHome />} />
          <Route path="/student/reading/:moduleId"     element={<StudentReadingView />} />
          <Route path="/student/dashboard"             element={<StudentDashboard />} />
          <Route path="/professor/home"                element={<ProfessorHome />} />
          <Route path="/professor/dashboard/:courseId" element={<ProfessorDashboard />} />
          <Route path="/professor/analyzer"            element={<MaterialAnalyzer />} />
          <Route path="/student/notes"                 element={<StudentNotes />} />
          <Route path="*"                              element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
