import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RequireAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import MicroCheck from '../components/MicroCheck.jsx'
import NotesWorkspace from '../components/NotesWorkspace.jsx'
import { writeStudentAnswer } from '../firebase/realtimeSync.js'
import { studentCourses, studentReadingModules } from '../data/studentCourses.js'

function ProgressBar({ value, progressGradient }) {
  return (
    <div className="w-full h-1.5 bg-claro-midnight/70 rounded-full overflow-hidden border border-[#322D46]">
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          backgroundImage: progressGradient,
          transition: 'width 1s ease',
        }}
      />
    </div>
  )
}

export default function StudentReadingView() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const selectedCourse = studentCourses.find(course => course.moduleId === moduleId) || null
  const readingModule = moduleId ? studentReadingModules[moduleId] : null
  const [answered, setAnswered] = useState({})  // sectionId → { correct }
  const [showNotes, setShowNotes] = useState(false)
  const [checkVisible, setCheckVisible] = useState({})  // sectionId → bool
  const [activeSectionId, setActiveSectionId] = useState(null)
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  const sectionRefs = useRef({})

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

  const scrollToSection = (sectionId) => {
    setActiveSectionId(sectionId)
    setSelectedSectionId(sectionId)
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  useEffect(() => {
    if (!readingModule?.sections?.length) return

    const firstSectionId = readingModule.sections[0].id
    setActiveSectionId(firstSectionId)
    setSelectedSectionId(firstSectionId)
  }, [readingModule])

  if (!moduleId || !selectedCourse || !readingModule) {
    return (
      <RequireAuth role="student">
        <div className="min-h-screen bg-claro-midnight">
          <Navbar />
          <main className="max-w-5xl mx-auto px-5 pt-20 pb-8">
            <div className="mb-8 rounded-3xl border border-[#3A3550] bg-claro-slate/55 p-6">
              <h1 className="text-xl font-semibold text-claro-text mb-1">Courses</h1>
              <p className="text-claro-muted text-sm">Choose a course to open its reading sections and study checks.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {studentCourses.map(course => (
                <button
                  key={course.id}
                  onClick={() => navigate(`/student/reading/${course.moduleId}`)}
                  className={`w-full text-left bg-gradient-to-r ${course.color} border ${course.border} rounded-2xl p-5 flex items-center justify-between gap-6 transition-transform hover:-translate-y-0.5`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-medium ${course.accent} bg-black/10 rounded px-1.5 py-0.5`}>{course.code}</span>
                    </div>
                    <h2 className="text-claro-text font-medium text-base mb-1">{course.title}</h2>
                    <p className="text-xs text-claro-muted mb-3">Next: {course.nextModule}</p>
                    <ProgressBar value={course.progress} progressGradient={course.progressGradient} />
                    <p className={`text-[11px] ${course.accent} mt-1`}>{course.progress}% complete · {course.modules} modules</p>
                  </div>
                  <div className="flex-shrink-0 border border-[#3A3550] bg-white/10 rounded-xl px-5 py-2 text-sm font-medium text-white">
                    Open course →
                  </div>
                </button>
              ))}
            </div>
          </main>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth role="student">
      <div className="min-h-screen bg-claro-midnight">
        <Navbar />
        <main className="max-w-5xl mx-auto px-5 pt-20 pb-8">
          <div className="mb-8 rounded-3xl border border-[#3A3550] bg-claro-slate/55 p-6 flex items-start justify-between gap-4">
            <div>
              <button onClick={() => navigate('/student/reading')} className="text-xs text-claro-muted hover:text-claro-text mb-3 flex items-center gap-1 transition-colors">
                ← Back to courses
              </button>
              <h1 className="text-xl font-semibold text-claro-text">{readingModule.title}</h1>
              <p className="text-claro-muted text-sm mt-1">{readingModule.courseCode} · {readingModule.courseTitle} · {readingModule.currentWeek}</p>
            </div>
            <button
              onClick={() => setShowNotes(v => !v)}
              className="flex-shrink-0 border border-claro-indigo/40 text-claro-indigo hover:bg-claro-indigo/10 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              ✎ Notes
            </button>
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {readingModule.sections.map((section, i) => {
                const answeredSection = answered[section.id]
                const isActive = activeSectionId === section.id || selectedSectionId === section.id

                return (
                  <div key={section.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`min-w-9 h-9 px-3 rounded-full flex items-center justify-center text-xs font-medium border transition-colors ${
                        answeredSection?.correct
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : answeredSection
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : isActive
                          ? 'bg-claro-indigo/15 border-claro-indigo/40 text-claro-text'
                          : 'bg-claro-slate border-[#3A3550] text-claro-muted hover:text-claro-text hover:border-[#4A4463]'
                      }`}
                      aria-label={`Jump to section ${i + 1}`}
                    >
                      {answeredSection?.correct ? '✓' : i + 1}
                    </button>
                    {i < readingModule.sections.length - 1 && (
                      <div className="w-8 h-px bg-white/10" />
                    )}
                  </div>
                )
              })}
            </div>
            <span className="text-xs text-claro-muted">
              {Object.keys(answered).length}/{readingModule.sections.length} sections completed
            </span>
          </div>

          <div className="rounded-3xl border border-[#3A3550] bg-claro-slate/35 p-6 space-y-10">
            {readingModule.sections.map((section, i) => (
              <div
                key={section.id}
                ref={(element) => {
                  sectionRefs.current[section.id] = element
                }}
                data-section-id={section.id}
                className={`scroll-mt-24 rounded-2xl border px-4 py-4 transition-colors ${
                  selectedSectionId === section.id
                    ? 'border-claro-indigo/30 bg-claro-indigo/8'
                    : 'border-transparent bg-transparent'
                }`}
              >
                {/* Section number */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium text-claro-indigo bg-claro-indigo/10 border border-claro-indigo/20 rounded-full px-3 py-1">
                    Section {i + 1}
                  </span>
                </div>

                {/* Text */}
                <p className="text-claro-text/90 text-base leading-relaxed mb-4">
                  {section.content}
                </p>

                {/* Trigger to show micro-check */}
                {!checkVisible[section.id] && !answered[section.id] && (
                  <button
                    onClick={() => handleSectionRead(section.id)}
                    className="text-xs text-claro-muted hover:text-claro-indigo border border-[#3A3550] hover:border-claro-indigo/30 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    I've read this section → check my understanding
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
                    {answered[section.id].correct ? '✓ Correct — well done!' : '✗ Incorrect — review and re-read this section.'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* End of reading */}
          {Object.keys(answered).length === readingModule.sections.length && (
            <div className="mt-12 bg-claro-slate border border-[#3A3550] rounded-2xl p-8 text-center">
              <p className="text-2xl mb-2">
                {Object.values(answered).filter(a => a.correct).length === readingModule.sections.length ? '🎉' : '📚'}
              </p>
              <h3 className="text-claro-text font-medium text-lg mb-2">Reading complete!</h3>
              <p className="text-claro-muted text-sm mb-5">
                {Object.values(answered).filter(a => a.correct).length}/{readingModule.sections.length} correct
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="bg-claro-indigo hover:brightness-110 text-white rounded-xl px-5 py-2 text-sm font-medium transition-colors"
                >
                  View my knowledge graph →
                </button>
                <button
                  onClick={() => navigate('/student/reading')}
                  className="border border-[#3A3550] text-claro-text hover:bg-white/5 rounded-xl px-5 py-2 text-sm font-medium transition-colors"
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
