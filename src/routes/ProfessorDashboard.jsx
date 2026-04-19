import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RequireAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import KnowledgeGraph2D from '../components/KnowledgeGraph2D.jsx'
import AlertsSidebar from '../components/AlertsSidebar.jsx'
import NodeDetailPanel from '../components/NodeDetailPanel.jsx'
import MicroCheckGenerator from '../components/MicroCheckGenerator.jsx'
import GraphGenerator from '../components/GraphGenerator.jsx'
import { marketingGraph } from '../data/mockGraphMarketing.js'
import { subscribeToConceptScores } from '../firebase/realtimeSync.js'
import { LeafBackdrop } from '../components/brand/LeafBackdrop.jsx'
import { SCORE_BANDS } from '../utils/nodeColorScale.js'

export default function ProfessorDashboard() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedNode, setSelectedNode]         = useState(null)
  const [liveUpdates, setLiveUpdates]           = useState(false)
  const [graphData, setGraphData]               = useState(marketingGraph)
  const [showMicroCheck, setShowMicroCheck]     = useState(false)
  const [showGenerator, setShowGenerator]       = useState(false)
  const unsubRef = useRef(null)

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
  }, [])

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
      <div className="flex min-h-screen flex-col bg-claro-midnight">
        <Navbar />
        <LeafBackdrop className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden pt-14">

          {/* Left sidebar */}
          <AlertsSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(v => !v)}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Sub-header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2D6A4F]/15 bg-[#FFFCF7]/95">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/professor/home')} className="text-[#5C6B63] hover:text-[#1B4332] text-sm transition-colors">←</button>
                <div>
                  <h1 className="text-sm font-medium text-[#1B4332]">{courseTitle} — Class Overview</h1>
                  <p className="text-xs text-[#5C6B63]">{graphData.nodes.length} concepts · {graphData.links.length} connections · 50 students</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Live indicator */}
                <div className="flex items-center gap-1.5 text-xs text-[#5C6B63] mr-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-pulse" />
                  Live sync
                </div>

                <button
                  onClick={() => setShowMicroCheck(true)}
                  className="border border-[#2D6A4F]/25 text-[#5C6B63] hover:text-[#1B4332] hover:border-[#2D6A4F]/40 rounded-lg px-3 py-1.5 text-xs transition-colors bg-[#FFFCF7]"
                >
                  + Micro-check
                </button>
                <button
                  onClick={() => setShowGenerator(true)}
                  className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
                >
                  + From syllabus
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-2 border-b border-[#2D6A4F]/12 bg-[#FDF6ED]/80">
              <span className="text-[10px] font-medium uppercase tracking-wide text-[#5C6B63]">Comprehension</span>
              {SCORE_BANDS.map(b => (
                <div key={b.range} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-black/5" style={{ background: b.color }} />
                  <span className="text-[10px] text-[#5C6B63]">{b.range}</span>
                </div>
              ))}
              <span className="text-[10px] text-[#5C6B63] ml-auto min-w-[12rem]">Cool tones = strong · warm = at risk · Node size = engagement</span>
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
        </LeafBackdrop>

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
