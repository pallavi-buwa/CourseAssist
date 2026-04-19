import { useState, useMemo, useEffect } from 'react'
import { RequireAuth, useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import { generateStudyGuide } from '../api/openai.js'
import {
  getStudentGraphSnapshot,
  uniqueSubjectsFromGraph,
  compactSubjectLabel,
} from '../utils/studentGraphSnapshot.js'
import { resolvePersona } from '../data/personas.js'
import PersonaContentHub from '../components/PersonaContentHub.jsx'

const CONTENT_TAB_ID = 'content'

function courseForNodeLabel(graphData, label) {
  const n = graphData?.nodes?.find(x => x.label === label)
  return n?.course ? String(n.course) : ''
}

// ─── Initial mock notes (course used for subject-tab filtering) ───────────────
const INITIAL_NOTES = [
  { id: 1, title: 'Decision Frameworks', text: 'Decision Frameworks are key for both AI and strategy courses — strong cross-course link!', node: 'Decision Frameworks', course: 'AI for Business Decisions', timestamp: '2 days ago', color: '#818cf8' },
  { id: 2, title: 'Risk Assessment', text: 'Review the difference between qualitative and quantitative risk methods. Qualitative = likelihood × impact matrix. Quantitative = Monte Carlo, expected value.', node: 'Risk Assessment', course: 'Strategic Management', timestamp: '1 week ago', color: '#67e8f9' },
  { id: 3, title: 'Market Segmentation', text: 'STP: Segment → Target → Position. Geographic, demographic, psychographic, behavioral.', node: 'Market Segmentation', course: 'Entrepreneurship', timestamp: '3 days ago', color: '#fbbf24' },
]

const BRANCH_COLORS = ['#818cf8', '#67e8f9', '#fbbf24', '#34d399', '#f87171', '#fb923c', '#e879f9']

// ─── SVG Mind Map renderer ────────────────────────────────────────────────────
function MindMapSVG({ mindmap }) {
  if (!mindmap?.center) return null
  const { center, branches = [] } = mindmap
  const W = 660, H = 480, CX = W / 2, CY = H / 2
  const R_BRANCH = branches.length <= 3 ? 160 : 180
  const R_LEAF   = branches.length <= 3 ? 280 : 300

  const angle = (i) => (i / branches.length) * 2 * Math.PI - Math.PI / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 400 }}>
      {branches.map((branch, bi) => {
        const a  = angle(bi)
        const bx = CX + Math.cos(a) * R_BRANCH
        const by = CY + Math.sin(a) * R_BRANCH
        const col = branch.color || BRANCH_COLORS[bi % BRANCH_COLORS.length]
        const children = branch.children || []

        return (
          <g key={bi}>
            {/* Center → branch */}
            <line x1={CX} y1={CY} x2={bx} y2={by}
              stroke={col} strokeWidth="2" strokeOpacity="0.55" strokeDasharray="6 3" />
            {/* Branch circle */}
            <circle cx={bx} cy={by} r="32" fill={col} fillOpacity="0.12"
              stroke={col} strokeWidth="1.5" strokeOpacity="0.65" />
            <foreignObject x={bx - 28} y={by - 15} width="56" height="30">
              <div style={{ fontSize: 9, color: '#e2e8f0', textAlign: 'center', lineHeight: '1.25', wordBreak: 'break-word' }}>
                {branch.label}
              </div>
            </foreignObject>
            {/* Leaf children */}
            {children.map((child, ci) => {
              const spread = Math.min(0.7, 0.9 / Math.max(children.length, 1))
              const la = a + (ci - (children.length - 1) / 2) * spread
              const lx = CX + Math.cos(la) * R_LEAF
              const ly = CY + Math.sin(la) * R_LEAF
              return (
                <g key={ci}>
                  <line x1={bx} y1={by} x2={lx} y2={ly} stroke={col} strokeWidth="1" strokeOpacity="0.3" />
                  <circle cx={lx} cy={ly} r="24" fill="#1f2937" stroke={col} strokeWidth="1" strokeOpacity="0.35" />
                  <foreignObject x={lx - 20} y={ly - 12} width="40" height="24">
                    <div style={{ fontSize: 8, color: '#94a3b8', textAlign: 'center', lineHeight: '1.2', wordBreak: 'break-word' }}>
                      {child}
                    </div>
                  </foreignObject>
                </g>
              )
            })}
          </g>
        )
      })}
      {/* Center node */}
      <circle cx={CX} cy={CY} r="46" fill="#312e81" stroke="#818cf8" strokeWidth="2" />
      <foreignObject x={CX - 38} y={CY - 18} width="76" height="36">
        <div style={{ fontSize: 11, color: '#c7d2fe', textAlign: 'center', fontWeight: 600, lineHeight: '1.3', wordBreak: 'break-word' }}>
          {center}
        </div>
      </foreignObject>
    </svg>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function StudentNotes() {
  const { user } = useAuth()
  const persona = useMemo(() => resolvePersona(user?.email, 'student'), [user?.email])
  const graphData = useMemo(() => getStudentGraphSnapshot(user?.email), [user?.email])
  const subjects = useMemo(() => uniqueSubjectsFromGraph(graphData), [graphData])

  /** One tab per graph subject, plus fixed "Content" (mind-map tools) at the end. */
  const [mainTab, setMainTab] = useState(CONTENT_TAB_ID)

  useEffect(() => {
    setMainTab(prev => {
      if (prev === CONTENT_TAB_ID) return prev
      if (subjects.includes(prev)) return prev
      return subjects[0] || CONTENT_TAB_ID
    })
  }, [subjects])

  // ── Notes state ──
  const [notes, setNotes]           = useState(INITIAL_NOTES)
  const [noteTitle, setNoteTitle]   = useState('')
  const [noteText, setNoteText]     = useState('')
  const [nodeSearch, setNodeSearch] = useState('')
  const [attachedNode, setAttachedNode] = useState('')
  const [openNote, setOpenNote]     = useState(null)

  // ── Mind map state ──
  const [mapMode, setMapMode]       = useState('build')   // 'build' | 'paste'
  const [pasteText, setPasteText]   = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError]     = useState(null)
  const [mindmap, setMindmap]       = useState(null)
  // Build-your-own
  const [buildCenter, setBuildCenter] = useState('')
  const [branches, setBranches]       = useState([
    { label: '', children: '' },
    { label: '', children: '' },
  ])

  const allNodes = graphData.nodes.map(n => n.label)
  const filteredNodes = allNodes.filter(n =>
    n.toLowerCase().includes(nodeSearch.toLowerCase()) && nodeSearch
  )

  const visibleNotes = useMemo(() => {
    if (mainTab === CONTENT_TAB_ID) return []
    return notes.filter(n => {
      const c = n.course || courseForNodeLabel(graphData, n.node)
      return c === mainTab
    })
  }, [notes, mainTab, graphData])

  const noteCountBySubject = useMemo(() => {
    const m = {}
    for (const t of subjects) {
      m[t] = notes.filter(n => (n.course || courseForNodeLabel(graphData, n.node)) === t).length
    }
    return m
  }, [notes, subjects, graphData])

  // ── Save note ──
  const saveNote = () => {
    if (!noteText.trim()) return
    const colors = BRANCH_COLORS
    const inferredCourse = attachedNode
      ? courseForNodeLabel(graphData, attachedNode)
      : (mainTab !== CONTENT_TAB_ID ? mainTab : '')
    setNotes(prev => [{
      id: Date.now(),
      title: noteTitle.trim() || 'Untitled',
      text: noteText.trim(),
      node: attachedNode || 'General',
      course: inferredCourse || undefined,
      timestamp: 'just now',
      color: colors[prev.length % colors.length],
    }, ...prev])
    setNoteTitle(''); setNoteText(''); setAttachedNode(''); setNodeSearch('')
  }

  // ── Generate mind map from pasted content ──
  const generateFromPaste = async () => {
    if (!pasteText.trim()) return
    setGenerating(true); setGenError(null)
    try {
      const guide = await generateStudyGuide(pasteText)
      setMindmap(guide.mindmap)
    } catch (e) {
      setGenError(e.message.includes('API_KEY') || e.message.includes('quota')
        ? e.message
        : e.message)
    } finally {
      setGenerating(false)
    }
  }

  // ── Build mind map from manual input ──
  const buildMap = () => {
    if (!buildCenter.trim()) return
    const built = {
      center: buildCenter.trim(),
      branches: branches
        .filter(b => b.label.trim())
        .map((b, i) => ({
          label: b.label.trim(),
          color: BRANCH_COLORS[i % BRANCH_COLORS.length],
          children: b.children.split(',').map(c => c.trim()).filter(Boolean),
        })),
    }
    setMindmap(built)
  }

  const addBranch = () => setBranches(prev => [...prev, { label: '', children: '' }])
  const removeBranch = (i) => setBranches(prev => prev.filter((_, j) => j !== i))
  const updateBranch = (i, field, val) =>
    setBranches(prev => prev.map((b, j) => j === i ? { ...b, [field]: val } : b))

  return (
    <RequireAuth role="student">
      <div className="min-h-screen bg-space-page">
        <Navbar />
        <main className="pt-14 max-w-5xl mx-auto px-5 py-8">

          <div className="mb-6">
            <h1 className="text-xl font-semibold text-white mb-1">Notes</h1>
            <p className="text-gray-500 text-sm">
              Subject tabs follow your knowledge graph. The <span className="text-gray-400">Content</span> tab combines persona-specific course shortcuts with the mind-map workspace below.
            </p>
          </div>

          {/* Subject tabs (dynamic) + fixed Content tab */}
          <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-800">
            {subjects.map(title => (
              <button
                key={title}
                type="button"
                onClick={() => setMainTab(title)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors max-w-[11rem] truncate ${
                  mainTab === title
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
                title={title}
              >
                {compactSubjectLabel(title, 22)}
                {noteCountBySubject[title] > 0 && (
                  <span className="text-gray-600 font-normal"> ({noteCountBySubject[title]})</span>
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setMainTab(CONTENT_TAB_ID)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                mainTab === CONTENT_TAB_ID
                  ? 'border-white/50 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Content
            </button>
          </div>

          {/* ── Per-subject notes (not on Content tab) ── */}
          {mainTab !== CONTENT_TAB_ID && (
            <div className="grid grid-cols-5 gap-6">

              {/* Editor */}
              <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3 h-fit">
                <input
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="Title (optional)"
                  className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                />
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Write your note…"
                  className="h-40 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500 leading-relaxed"
                />

                {/* Concept node autocomplete */}
                <div className="relative">
                  <input
                    value={nodeSearch}
                    onChange={e => { setNodeSearch(e.target.value); setAttachedNode('') }}
                    placeholder="Attach to a concept node…"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  {filteredNodes.length > 0 && !attachedNode && (
                    <div className="absolute top-full mt-1 left-0 right-0 bg-gray-800 border border-gray-700 rounded-xl shadow-xl max-h-36 overflow-y-auto z-10">
                      {filteredNodes.slice(0, 7).map(n => (
                        <button key={n} onClick={() => { setAttachedNode(n); setNodeSearch(n) }}
                          className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 transition-colors">
                          {n}
                        </button>
                      ))}
                    </div>
                  )}
                  {attachedNode && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-indigo-400">✓</span>
                  )}
                </div>

                <button onClick={saveNote} disabled={!noteText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-2 text-sm font-medium transition-colors">
                  Save note
                </button>
              </div>

              {/* Notes list */}
              <div className="col-span-3">
                {openNote ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: openNote.color }} />
                        <h3 className="text-white font-medium">{openNote.title}</h3>
                      </div>
                      <button onClick={() => setOpenNote(null)} className="text-gray-500 hover:text-white text-sm">✕ Close</button>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">{openNote.text}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-indigo-400 bg-indigo-600/10 border border-indigo-600/20 rounded-full px-2.5 py-0.5">{openNote.node}</span>
                      <span className="text-xs text-gray-600">{openNote.timestamp}</span>
                    </div>
                  </div>
                ) : visibleNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <p className="text-gray-600 text-sm">No notes for this subject yet. Write your first one →</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {visibleNotes.map(n => (
                      <button key={n.id} onClick={() => setOpenNote(n)}
                        className="text-left bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: n.color }} />
                          <span className="text-sm font-medium text-white truncate">{n.title}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-3">{n.text}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium" style={{ color: n.color }}>{n.node}</span>
                          <span className="text-[10px] text-gray-700">{n.timestamp}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Content tab: mind-map workspace (constant) ── */}
          {mainTab === CONTENT_TAB_ID && (
            <div>
              <PersonaContentHub persona={persona} subjects={subjects} />
              <div className="grid grid-cols-5 gap-6">

              {/* Left controls */}
              <div className="col-span-2 flex flex-col gap-4">

                {/* Mode toggle */}
                <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
                  {[
                    { id: 'build', label: '✏️ Build your own' },
                    { id: 'paste', label: '✦ From content' },
                  ].map(m => (
                    <button key={m.id} onClick={() => setMapMode(m.id)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        mapMode === m.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Build mode */}
                {mapMode === 'build' && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3">
                    <input
                      value={buildCenter}
                      onChange={e => setBuildCenter(e.target.value)}
                      placeholder="Central topic…"
                      className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-medium"
                    />

                    <p className="text-[11px] text-gray-500">Branches — add sub-topics as comma-separated children</p>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {branches.map((b, i) => (
                        <div key={i} className="flex gap-2">
                          <div className="w-2.5 h-2.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: BRANCH_COLORS[i % BRANCH_COLORS.length] }} />
                          <div className="flex-1 flex flex-col gap-1">
                            <input
                              value={b.label}
                              onChange={e => updateBranch(i, 'label', e.target.value)}
                              placeholder={`Branch ${i + 1}`}
                              className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                              value={b.children}
                              onChange={e => updateBranch(i, 'children', e.target.value)}
                              placeholder="child1, child2, child3"
                              className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <button onClick={() => removeBranch(i)} className="text-gray-700 hover:text-red-400 text-xs mt-1 flex-shrink-0">✕</button>
                        </div>
                      ))}
                    </div>

                    <button onClick={addBranch} className="text-xs text-indigo-400 hover:text-indigo-300 text-left">
                      + Add branch
                    </button>

                    <button onClick={buildMap} disabled={!buildCenter.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-2 text-sm font-medium transition-colors">
                      Build map
                    </button>
                  </div>
                )}

                {/* Paste mode */}
                {mapMode === 'paste' && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3">
                    <p className="text-xs text-gray-400">Paste any notes, passage, or topic list and we'll auto-generate a mind map.</p>
                    <textarea
                      value={pasteText}
                      onChange={e => setPasteText(e.target.value)}
                      placeholder="Paste your content here…"
                      className="h-44 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                    {genError && (
                      <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 leading-relaxed">{genError}</p>
                    )}
                    <button onClick={generateFromPaste} disabled={generating || !pasteText.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      {generating
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
                        : '✦ Generate mind map'}
                    </button>
                  </div>
                )}
              </div>

              {/* Map canvas */}
              <div className="col-span-3 bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col min-h-96">
                {mindmap ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-white">{mindmap.center}</h3>
                      <button onClick={() => setMindmap(null)} className="text-xs text-gray-600 hover:text-gray-400">Clear</button>
                    </div>
                    <MindMapSVG mindmap={mindmap} />

                    {/* Branch legend */}
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-800 pt-4">
                      {mindmap.branches?.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                          <div className="w-2 h-2 rounded-full" style={{ background: b.color || BRANCH_COLORS[i % BRANCH_COLORS.length] }} />
                          {b.label}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-gray-600">
                    <div className="text-4xl">🗺</div>
                    <p className="text-sm">
                      {mapMode === 'build'
                        ? 'Fill in the center topic and branches, then click Build map.'
                        : 'Paste any content and click Generate mind map.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            </div>
          )}

        </main>
      </div>
    </RequireAuth>
  )
}
