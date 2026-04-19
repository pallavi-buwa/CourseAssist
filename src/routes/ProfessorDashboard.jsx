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
      <div className="min-h-screen bg-claro-midnight flex flex-col">
        <Navbar />
        <div className="pt-14 flex flex-1 overflow-hidden">

          {/* Left sidebar */}
          <AlertsSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(v => !v)}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Sub-header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/50">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/professor/home')} className="text-gray-600 hover:text-white text-sm transition-colors">←</button>
                <div>
                  <h1 className="text-sm font-medium text-white">{courseTitle} — Class Overview</h1>
                  <p className="text-xs text-gray-500">
                    {graphData.nodes.length} concepts · {graphData.links.length} connections · 50 students
                    {persona.matched && (
                      <span> · {persona.cohortHint}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Live indicator */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-claro-sage animate-pulse" />
                  Live sync
                </div>

                <button
                  onClick={() => setShowMicroCheck(true)}
                  className="border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-lg px-3 py-1.5 text-xs transition-colors"
                >
                  + Micro-check
                </button>
                <button
                  onClick={() => setShowGenerator(true)}
                  className="hover:brightness-110 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{ backgroundColor: persona.accentHex }}
                >
                  + From syllabus
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 px-5 py-2 border-b border-gray-800">
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
              <span className="text-[11px] text-gray-600 ml-auto">Node size = student engagement · Click node to inspect</span>
            </div>

            {/* 2D Graph */}
            <div className="flex-1 relative overflow-hidden">
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
