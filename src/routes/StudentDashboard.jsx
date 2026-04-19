import { useState, useMemo, useEffect } from 'react'
import { RequireAuth, useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import KnowledgeGraph3D from '../components/KnowledgeGraph3D.jsx'
import NodeDetailPanel from '../components/NodeDetailPanel.jsx'
import GraphGenerator from '../components/GraphGenerator.jsx'
import { resolvePersona } from '../data/personas.js'
import { getStaticStudentGraphForPersona } from '../data/personaStudentGraphs.js'
import {
  readCachedStudentAIGraph,
  writeCachedStudentAIGraph,
} from '../utils/personaGraphStorage.js'
import {
  generatePersonaStudentKnowledgeGraph,
  isOpenAIConfigured,
} from '../api/openai.js'
import {
  uniqueSubjectsFromGraph,
  compactSubjectLabel,
} from '../utils/studentGraphSnapshot.js'
import { readNodeMasteryMap, writeNodeMastery } from '../utils/nodeMasteryStorage.js'
import PersonaContentHub from '../components/PersonaContentHub.jsx'
import { SCORE_BANDS } from '../utils/nodeColorScale.js'

const SUBJECT_LEGEND_COLORS = ['#C4922A', '#2B4A6B', '#E8C97A', '#8B2035', '#5A7A9A', '#9B6B2F']

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const persona = useMemo(() => resolvePersona(user?.email, 'student'), [user?.email])

  const [selectedNode, setSelectedNode]       = useState(null)
  /** null = all subjects; non-empty array = highlight only those courses (OR) */
  const [subjectSelection, setSubjectSelection] = useState(null)
  /** 'graph' | 'content' hub */
  const [view, setView]                         = useState('graph')
  const [showGenerator, setShowGenerator]     = useState(false)
  const [graphData, setGraphData]             = useState(() => getStaticStudentGraphForPersona({}))
  const [masteryTick, setMasteryTick]         = useState(0)

  const masteryMap = useMemo(() => readNodeMasteryMap(user?.email), [user?.email, masteryTick])

  const mergedGraph = useMemo(() => {
    const nodes = Array.isArray(graphData?.nodes) ? graphData.nodes : []
    const links = Array.isArray(graphData?.links) ? graphData.links : []
    return {
      nodes: nodes.map(n => ({
        ...n,
        _graphAccuracy: n.accuracy,
        accuracy: masteryMap[n.id] != null ? masteryMap[n.id] : n.accuracy,
      })),
      links,
    }
  }, [graphData, masteryMap])

  const subjects = useMemo(() => uniqueSubjectsFromGraph(graphData), [graphData])
  const subjectLegend = useMemo(
    () => subjects.map((title, i) => ({
      title,
      label: compactSubjectLabel(title, 24),
      color: SUBJECT_LEGEND_COLORS[i % SUBJECT_LEGEND_COLORS.length],
    })),
    [subjects],
  )

  useEffect(() => {
    if (view !== 'graph' || !subjectSelection?.length) return
    const valid = subjectSelection.filter(t => subjects.includes(t))
    if (valid.length === subjectSelection.length) return
    setSubjectSelection(valid.length ? valid : null)
  }, [subjects, view, subjectSelection])

  useEffect(() => {
    if (!user?.email) return
    const p = resolvePersona(user.email, 'student')
    const cached = readCachedStudentAIGraph(user.email)
    setGraphData(cached || getStaticStudentGraphForPersona(p))
    setSelectedNode(null)
  }, [user?.email])

  useEffect(() => {
    if (!user?.email) return
    const p = resolvePersona(user.email, 'student')
    if (!p.tryAIGraph || !isOpenAIConfigured()) return
    if (readCachedStudentAIGraph(user.email)) return

    let cancelled = false
    ;(async () => {
      try {
        const g = await generatePersonaStudentKnowledgeGraph(p, user.name || user.email)
        if (cancelled || !g?.nodes?.length) return
        writeCachedStudentAIGraph(user.email, g)
        setGraphData(g)
      } catch {
        /* keep static / persona fallback graph */
      }
    })()
    return () => { cancelled = true }
  }, [user?.email, user?.name, persona.id])

  useEffect(() => {
    setSelectedNode(prev => {
      if (!prev?.id) return prev
      return mergedGraph.nodes.find(x => x.id === prev.id) ?? null
    })
  }, [mergedGraph])

  const handleMasteryChange = (nodeId, val) => {
    if (!user?.email) return
    writeNodeMastery(user.email, nodeId, val)
    setMasteryTick(t => t + 1)
  }

  const handleNodeClick = (node) => {
    setSelectedNode(node)
  }

  const handleGenerated = (newGraph) => {
    setGraphData(prev => ({
      nodes: [...prev.nodes, ...newGraph.nodes],
      links: [...prev.links, ...newGraph.links],
    }))
  }

  const toggleSubject = (title) => {
    setSubjectSelection((prev) => {
      if (prev === null) return [title]
      const has = prev.includes(title)
      if (has) {
        const next = prev.filter(t => t !== title)
        return next.length ? next : null
      }
      return [...prev, title]
    })
    setSelectedNode(null)
  }

  const clearSubjectFilters = () => {
    setView('graph')
    setSubjectSelection(null)
    setSelectedNode(null)
  }

  return (
    <RequireAuth role="student">
      <div className="flex min-h-screen flex-col bg-space-page">
        <Navbar />
        <div className="flex min-h-0 flex-1 flex-col pt-16">

          {/* Sub-header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-claro-indigo/15 bg-claro-panel">
            <div>
              <h1 className="text-lg font-semibold text-claro-text tracking-tight">My Knowledge Graph</h1>
              <p className="text-sm text-claro-muted mt-1">
                {graphData.nodes.length} concepts · {graphData.links.length} connections
                {persona.matched && (
                  <span> · {persona.label}</span>
                )}
              </p>
            </div>

            {/* Subject pills: multi-select (OR) + Content — touch targets from main UI pass */}
            <div className="flex flex-col items-end gap-1.5 max-w-[min(100%,42rem)]">
              <p className="hidden text-[10px] text-claro-muted text-right max-w-full leading-snug sm:block">
                <span className="font-medium uppercase tracking-wide text-claro-muted/90">Courses</span>
                {' — '}
                <span>Select one or more to filter the graph.</span>
              </p>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={clearSubjectFilters}
                  className={`min-h-touch inline-flex items-center text-sm px-4 py-2 rounded-full border transition-all ${
                    subjectSelection === null
                      ? 'text-white border-transparent'
                      : 'bg-claro-canvas border-claro-indigo/20 text-claro-muted hover:border-claro-indigo/40'
                  }`}
                  style={
                    subjectSelection === null
                      ? { backgroundColor: persona.accentHex, borderColor: persona.accentHex }
                      : undefined
                  }
                  title="Show every course on the graph"
                >
                  All
                </button>
                {subjects.map(title => {
                  const on = subjectSelection !== null && subjectSelection.includes(title)
                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => { setView('graph'); toggleSubject(title) }}
                      className={`min-h-touch inline-flex items-center max-w-[12rem] truncate text-sm px-4 py-2 rounded-full border transition-all ${
                        on
                          ? 'text-white border-transparent'
                          : 'bg-claro-canvas border-claro-indigo/20 text-claro-muted hover:border-claro-indigo/40'
                      }`}
                      style={
                        on
                          ? { backgroundColor: persona.accentHex, borderColor: persona.accentHex }
                          : undefined
                      }
                      title={`${title} — click again to remove; click other courses to add more`}
                    >
                      {compactSubjectLabel(title, 18)}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => { setView('content'); setSelectedNode(null) }}
                  className={`min-h-touch inline-flex items-center text-sm px-4 py-2 rounded-full border transition-all font-medium ${
                    view === 'content'
                      ? 'bg-claro-indigo border-claro-indigo text-white'
                      : 'bg-claro-canvas border-claro-indigo/20 text-claro-muted hover:border-claro-indigo/40'
                  }`}
                  title="Readings and materials (same for every subject layout)"
                >
                  Content
                </button>
              </div>
              <p className="hidden text-[10px] text-claro-muted/90 text-right max-w-full leading-snug md:block">
                Zoom, fit, fullscreen, and export in the graph toolbar.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/student/notes')}
                className="min-h-touch rounded-lg border border-claro-indigo/25 bg-claro-panel px-4 py-2.5 text-sm text-claro-muted transition-colors hover:border-claro-indigo/40 hover:text-claro-text"
              >
                Notes
              </button>
              <button
                type="button"
                onClick={() => setShowGenerator(true)}
                className={`min-h-touch rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 active:brightness-95 dark:hover:brightness-125 ${persona.matched ? '' : 'bg-claro-indigo'}`}
                style={persona.matched ? { backgroundColor: persona.accentHex } : undefined}
              >
                + Add from syllabus
              </button>
            </div>
          </div>

          {/* Legend + stats */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-3 border-b border-claro-indigo/12 bg-claro-canvas/80">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-sm font-medium text-claro-text">Legend</span>
              {SCORE_BANDS.map(b => (
                <div key={b.range} className="flex items-center gap-2">
                  <div className="h-3 w-3 flex-shrink-0 rounded-full ring-1 ring-black/10" style={{ background: b.color }} />
                  <span className="text-sm text-claro-muted">{b.range} {b.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 border-l border-claro-indigo/15 pl-4">
                <div className="h-0.5 w-5" style={{ background: '#E8C97A' }} />
                <span className="text-sm text-claro-muted">Cross-course link</span>
              </div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2 justify-end max-w-xl">
              {subjectLegend.map(({ title, label, color }) => (
                <div key={title} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full opacity-80" style={{ background: color }} />
                  <span className="text-sm text-claro-muted" title={title}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graph + detail panel — or Content hub (min height so 3D canvas always gets non-zero layout) */}
          <div className="flex-1 relative overflow-hidden min-h-[min(55vh,560px)] min-w-0 flex flex-col">
            {view === 'content' ? (
              <div className="h-full overflow-y-auto px-5 py-8 max-w-4xl mx-auto">
                <PersonaContentHub persona={persona} subjects={subjects} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 w-full">
                <KnowledgeGraph3D
                  graphData={mergedGraph}
                  onNodeClick={handleNodeClick}
                  highlightCourses={subjectSelection}
                />

                {selectedNode && (
                  <NodeDetailPanel
                    node={selectedNode}
                    mode="student"
                    onClose={() => setSelectedNode(null)}
                    preferences={user?.preferences}
                    onMasteryChange={handleMasteryChange}
                    graphDefaultAccuracy={graphData.nodes.find(n => n.id === selectedNode.id)?.accuracy}
                  />
                )}
              </div>
            )}
          </div>

        </div>

        {showGenerator && (
          <GraphGenerator
            onClose={() => setShowGenerator(false)}
            onGenerated={(g) => { handleGenerated(g); setShowGenerator(false) }}
          />
        )}
      </div>
    </RequireAuth>
  )
}
