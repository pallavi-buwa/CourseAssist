import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RequireAuth, useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import KnowledgeGraph2D from '../components/KnowledgeGraph2D.jsx'
import AlertsSidebar from '../components/AlertsSidebar.jsx'
import NodeDetailPanel from '../components/NodeDetailPanel.jsx'
import MicroCheckGenerator from '../components/MicroCheckGenerator.jsx'
import GraphGenerator from '../components/GraphGenerator.jsx'
import { marketingGraph } from '../data/mockGraphMarketing.js'
import { resolvePersona } from '../data/personas.js'
import { getProfessorMarketingGraph } from '../data/personaProfessorGraphs.js'
import {
  readCachedProfessorAIGraph,
  writeCachedProfessorAIGraph,
} from '../utils/personaGraphStorage.js'
import {
  generatePersonaProfessorCohortGraph,
  isOpenAIConfigured,
} from '../api/openai.js'
import { subscribeToConceptScores } from '../firebase/realtimeSync.js'
import { SCORE_BANDS } from '../utils/nodeColorScale.js'

export default function ProfessorDashboard() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const persona = useMemo(() => resolvePersona(user?.email, 'professor'), [user?.email])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedNode, setSelectedNode]         = useState(null)
  const [liveUpdates, setLiveUpdates]           = useState(false)
  const [graphData, setGraphData]               = useState(marketingGraph)
  const [showMicroCheck, setShowMicroCheck]     = useState(false)
  const [showGenerator, setShowGenerator]       = useState(false)

  useEffect(() => {
    if (!user?.email) return
    const p = resolvePersona(user.email, 'professor')
    const cached = readCachedProfessorAIGraph(user.email, 'marketing')
    setGraphData(cached || getProfessorMarketingGraph(p))
    setSelectedNode(null)
  }, [user?.email])

  useEffect(() => {
    if (!user?.email) return
    const p = resolvePersona(user.email, 'professor')
    if (!p.tryAIGraph || !isOpenAIConfigured()) return
    if (readCachedProfessorAIGraph(user.email, 'marketing')) return

    let cancelled = false
    ;(async () => {
      try {
        const g = await generatePersonaProfessorCohortGraph(p, 'Marketing Management')
        if (cancelled || !g?.nodes?.length) return
        writeCachedProfessorAIGraph(user.email, 'marketing', g)
        setGraphData(g)
      } catch {
        /* keep static persona / default graph */
      }
    })()
    return () => { cancelled = true }
  }, [user?.email, persona.id])

  const graphNodeIds = graphData.nodes.map(n => n.id).join(',')

  // Subscribe to live Firebase updates for each node
  useEffect(() => {
    const unsubs = []
    graphData.nodes.forEach(node => {
      const unsub = subscribeToConceptScores(node.id, (score) => {
        if (score == null) return
        setGraphData(prev => ({
          ...prev,
          nodes: prev.nodes.map(n => n.id === node.id ? { ...n, comprehension: score } : n),
        }))
        setLiveUpdates(v => !v)
      })
      unsubs.push(unsub)
    })
    return () => unsubs.forEach(u => u?.())
  }, [graphNodeIds])

  const handleGenerated = (newGraph) => {
    setGraphData(prev => ({
      nodes: [...prev.nodes, ...newGraph.nodes],
      links: [...prev.links, ...newGraph.links],
    }))
  }

  const courseTitle = courseId === 'marketing' ? 'Marketing Management' :
                      courseId === 'strategy'  ? 'Business Strategy' :
                      'Operations Management'

  return (
    <RequireAuth role="professor">
      <div className="flex min-h-screen flex-col bg-space-page">
        <Navbar />
        <div className="flex flex-1 overflow-hidden pt-16">

          {/* Left sidebar */}
          <AlertsSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(v => !v)}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Sub-header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-claro-indigo/15 bg-claro-panel">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => navigate('/professor/home')} className="min-h-touch text-claro-muted hover:text-claro-text text-base transition-colors px-1">Back</button>
                <div>
                  <h1 className="text-lg font-semibold text-claro-text tracking-tight">{courseTitle} — Class Overview</h1>
                  <p className="text-sm text-claro-muted mt-1">
                    {graphData.nodes.length} concepts · {graphData.links.length} connections · 50 students
                    {persona.matched && (
                      <span> · {persona.cohortHint}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Live indicator */}
                <div className="flex items-center gap-2 text-sm text-claro-muted mr-1">
                  <div className="w-2 h-2 rounded-full bg-claro-sage animate-pulse" />
                  Live sync
                </div>

                <button
                  type="button"
                  onClick={() => setShowMicroCheck(true)}
                  className="min-h-touch border border-claro-indigo/25 text-claro-muted hover:text-claro-text hover:border-claro-indigo/40 rounded-lg px-4 py-2.5 text-sm transition-colors bg-claro-panel"
                >
                  + Micro-check
                </button>
                <button
                  type="button"
                  onClick={() => setShowGenerator(true)}
                  className={`min-h-touch rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 active:brightness-95 dark:hover:brightness-125 ${persona.matched ? '' : 'bg-claro-indigo'}`}
                  style={persona.matched ? { backgroundColor: persona.accentHex } : undefined}
                >
                  + From syllabus
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-3 border-b border-claro-indigo/12 bg-claro-canvas/80">
              <span className="text-sm font-medium text-claro-text">Comprehension</span>
              {SCORE_BANDS.map(b => (
                <div key={b.range} className="flex items-center gap-2">
                  <div className="h-3 w-3 flex-shrink-0 rounded-full ring-1 ring-black/10" style={{ background: b.color }} />
                  <span className="text-sm text-claro-muted">{b.range}</span>
                </div>
              ))}
              <span className="text-sm text-claro-muted ml-auto max-w-md leading-snug">Cool = strong · warm = at risk · size = engagement</span>
            </div>

            {/* 2D Graph */}
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <KnowledgeGraph2D
                graphData={graphData}
                onNodeClick={(node) => setSelectedNode(node)}
                liveUpdates={liveUpdates}
              />

              {selectedNode && (
                <NodeDetailPanel
                  node={selectedNode}
                  mode="professor"
                  onClose={() => setSelectedNode(null)}
                />
              )}
            </div>

          </div>
        </div>

        {showMicroCheck && <MicroCheckGenerator onClose={() => setShowMicroCheck(false)} />}
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
