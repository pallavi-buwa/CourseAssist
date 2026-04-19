import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RequireAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import MicroCheck from '../components/MicroCheck.jsx'
import NotesWorkspace from '../components/NotesWorkspace.jsx'
import { passage } from '../data/marketingPassage.js'
import { writeStudentAnswer } from '../firebase/realtimeSync.js'

export default function StudentReadingView() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const [answered, setAnswered] = useState({})  // sectionId → { correct }
  const [showNotes, setShowNotes] = useState(false)
  const [checkVisible, setCheckVisible] = useState({})  // sectionId → bool

  const handleAnswer = async (sectionId, { conceptId, correct }) => {
    setAnswered(prev => ({ ...prev, [sectionId]: { correct } }))
    try {
      await writeStudentAnswer({ studentId: 'demo-student', conceptId, correct })
    } catch (_) {}
  }

  const handleSectionRead = (sectionId) => {
    if (!answered[sectionId] && !checkVisible[sectionId]) {
      setCheckVisible(prev => ({ ...prev, [sectionId]: true }))
    }
  }

  return (
    <RequireAuth role="student">
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <main className="pt-14 max-w-3xl mx-auto px-5 py-10">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <button type="button" onClick={() => navigate('/student/home')} className="text-xs text-gray-600 hover:text-gray-400 mb-3">
                Back to courses
              </button>
              <h1 className="text-xl font-semibold text-white">{passage.title}</h1>
              <p className="text-gray-500 text-sm mt-1">MBA 601 · AI for Business Decisions · Week 3</p>
            </div>
            <button
              onClick={() => setShowNotes(v => !v)}
              className="flex-shrink-0 border border-claro-indigo/40 text-claro-indigo hover:bg-claro-indigo/10 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              Notes
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            {passage.sections.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border transition-colors ${
                  answered[s.id]?.correct
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : answered[s.id]
                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'bg-gray-800 border-gray-700 text-gray-500'
                }`}>
                  {answered[s.id]?.correct ? 'OK' : answered[s.id] ? '–' : i + 1}
                </div>
                {i < passage.sections.length - 1 && (
                  <div className="w-8 h-px bg-gray-800" />
                )}
              </div>
            ))}
            <span className="text-xs text-gray-600 ml-2">
              {Object.keys(answered).length}/{passage.sections.length} sections
            </span>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {passage.sections.map((section, i) => (
              <div key={section.id}>
                {/* Section number */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium text-claro-indigo bg-claro-indigo/10 border border-claro-indigo/20 rounded-full px-3 py-1">
                    Section {i + 1}
                  </span>
                </div>

                {/* Text */}
                <p className="text-gray-200 text-base leading-relaxed mb-4">
                  {section.content}
                </p>

                {/* Trigger to show micro-check */}
                {!checkVisible[section.id] && !answered[section.id] && (
                  <button
                    onClick={() => handleSectionRead(section.id)}
                    className="text-xs text-gray-600 hover:text-claro-indigo border border-gray-800 hover:border-claro-indigo/30 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    I&apos;ve read this section — check my understanding
                  </button>
                )}

                {/* MicroCheck */}
                {checkVisible[section.id] && !answered[section.id] && (
                  <MicroCheck
                    check={section.microCheck}
                    onAnswer={(result) => {
                      handleAnswer(section.id, result)
                      if (result.correct) {
                        setTimeout(() => setCheckVisible(prev => ({ ...prev, [section.id]: false })), 1600)
                      }
                    }}
                  />
                )}

                {/* Already answered — show result */}
                {answered[section.id] && (
                  <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
                    answered[section.id].correct
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {answered[section.id].correct ? 'Correct — well done.' : 'Incorrect — review and re-read this section.'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* End of reading */}
          {Object.keys(answered).length === passage.sections.length && (
            <div className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
              <h3 className="text-white font-medium text-lg mb-2">Reading complete!</h3>
              <p className="text-gray-500 text-sm mb-5">
                {Object.values(answered).filter(a => a.correct).length}/{passage.sections.length} correct
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="bg-claro-indigo hover:brightness-110 text-white rounded-xl px-5 py-2 text-sm font-medium transition-colors"
                >
                  View my knowledge graph
                </button>
                <button
                  onClick={() => navigate('/student/home')}
                  className="border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl px-5 py-2 text-sm font-medium transition-colors"
                >
                  Back to courses
                </button>
              </div>
            </div>
          )}
        </main>

        {showNotes && <NotesWorkspace onClose={() => setShowNotes(false)} />}
      </div>
    </RequireAuth>
  )
}
