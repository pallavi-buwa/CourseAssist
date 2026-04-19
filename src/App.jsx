import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const LandingPage        = lazy(() => import('./routes/LandingPage.jsx'))
const StudentHome        = lazy(() => import('./routes/StudentHome.jsx'))
const StudentReadingView = lazy(() => import('./routes/StudentReadingView.jsx'))
const StudentDashboard   = lazy(() => import('./routes/StudentDashboard.jsx'))
const StudentPreferences = lazy(() => import('./routes/StudentPreferences.jsx'))
const StudentNotes       = lazy(() => import('./routes/StudentNotes.jsx'))
const ProfessorHome      = lazy(() => import('./routes/ProfessorHome.jsx'))
const ProfessorDashboard = lazy(() => import('./routes/ProfessorDashboard.jsx'))
const MaterialAnalyzer   = lazy(() => import('./routes/MaterialAnalyzer.jsx'))
const LoginPage = lazy(() => import('./routes/LoginPage.jsx'))

function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#07070b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 14 }}>
      Loading...
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/student/home" element={<StudentHome />} />
              <Route path="/student/reading/:moduleId" element={<StudentReadingView />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/preferences" element={<StudentPreferences />} />
              <Route path="/student/notes" element={<StudentNotes />} />
              <Route path="/professor/home" element={<ProfessorHome />} />
              <Route path="/professor/dashboard/:courseId" element={<ProfessorDashboard />} />
              <Route path="/professor/analyzer" element={<MaterialAnalyzer />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}