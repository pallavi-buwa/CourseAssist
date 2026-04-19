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

const CONTENT_TAB = 'content'
const SUBJECT_LEGEND_COLORS = ['#C4B5FF', '#8EE4D2', '#FFD6A8', '#FFB8C8', '#67e8f9', '#fbbf24']

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const persona = useMemo(() => resolvePersona(user?.email, 'student'), [user?.email])

  const [selectedNode, setSelectedNode]       = useState(null)
  /** 'all' | full subject title from graph | 'content' (fixed hub tab) */
  const [activeCourse, setActiveCourse]       = useState('all')
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
    if (activeCourse === 'all' || activeCourse === CONTENT_TAB) return
    if (!subjects.includes(activeCourse)) setActiveCourse('all')
  }, [subjects, activeCourse])

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

  return (
    <RequireAuth role="student">
      <div className="min-h-screen bg-claro-midnight flex flex-col">
        <Navbar />
        <div className="pt-14 flex flex-col flex-1">

          {/* Sub-header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/50">
            <div>
              <h1 className="text-sm font-medium text-white">My Knowledge Graph</h1>
              <p className="text-xs text-gray-500">
                {graphData.nodes.length} concepts · {graphData.links.length} connections
                {persona.matched && (
                  <span className="text-claro-muted"> · {persona.label}</span>
                )}
              </p>
            </div>

            {/* Subject tabs (from graph) + fixed Content tab */}
            <div className="flex flex-wrap items-center justify-end gap-1.5 max-w-[min(100%,42rem)]">
              <button
                type="button"
                onClick={() => { setActiveCourse('all'); setSelectedNode(null) }}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  activeCourse === 'all'
                    ? 'text-white border-transparent'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
                style={
                  activeCourse === 'all'
                    ? { backgroundColor: persona.accentHex, borderColor: persona.accentHex }
                    : undefined
                }
              >
                All
              </button>
              {subjects.map(title => (
                <button
                  key={title}
                  type="button"
                  onClick={() => { setActiveCourse(title); setSelectedNode(null) }}
                  className={`text-xs px-3 py-1 rounded-full border transition-all max-w-[10rem] truncate ${
                    activeCourse === title
                      ? 'text-white border-transparent'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                  style={
                    activeCourse === title
                      ? { backgroundColor: persona.accentHex, borderColor: persona.accentHex }
                      : undefined
                  }
                  title={title}
                >
                  {compactSubjectLabel(title, 18)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => { setActiveCourse(CONTENT_TAB); setSelectedNode(null) }}
                className={`text-xs px-3 py-1 rounded-full border transition-all font-medium ${
                  activeCourse === CONTENT_TAB
                    ? 'text-white border-white/25 bg-white/10'
                    : 'bg-gray-900 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
                title="Readings and materials (same for every subject layout)"
              >
                Content
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/student/notes')}
                className="border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-lg px-3 py-1.5 text-xs transition-colors"
              >
                ✎ Notes
              </button>
              <button
                onClick={() => setShowGenerator(true)}
                className="hover:brightness-110 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ backgroundColor: persona.accentHex }}
              >
                + Add from syllabus
              </button>
            </div>
          </div>

          {/* Legend + stats */}
          <div className="flex items-center gap-6 px-5 py-2 border-b border-gray-800">
            <div className="flex items-center gap-4">
              {[
                { color: '#9EE4D4', label: 'Strong (≥70%)' },
                { color: '#FFD6A8', label: 'Developing (50–69%)' },
                { color: '#FFB8C8', label: 'Needs work (<50%)' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-[11px] text-gray-500">{l.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 ml-2">
                <div className="w-4 h-0.5" style={{ background: '#FFD6A8' }} />
                <span className="text-[11px] text-gray-500">Cross-course link</span>
              </div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1 justify-end max-w-xl">
              {subjectLegend.map(({ title, label, color }) => (
                <div key={title} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full opacity-70" style={{ background: color }} />
                  <span className="text-[11px] text-gray-500" title={title}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graph + detail panel — or Content hub (min height so 3D canvas always gets non-zero layout) */}
          <div className="flex-1 relative overflow-hidden min-h-[min(55vh,560px)] min-w-0 flex flex-col">
            {activeCourse === CONTENT_TAB ? (
              <div className="h-full overflow-y-auto px-5 py-8 max-w-4xl mx-auto">
                <PersonaContentHub persona={persona} subjects={subjects} />
                <p className="text-[11px] text-gray-600">
                  Subject tabs above always mirror your graph. Readings use the same subject titles.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 w-full">
                <KnowledgeGraph3D
                  graphData={mergedGraph}
                  onNodeClick={handleNodeClick}
                  highlightCourse={activeCourse === 'all' ? null : activeCourse}
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
