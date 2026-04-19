import { useState, useRef } from 'react'
import { RequireAuth, useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import KnowledgeGraph3D from '../components/KnowledgeGraph3D.jsx'
import NodeDetailPanel from '../components/NodeDetailPanel.jsx'
import GraphGenerator from '../components/GraphGenerator.jsx'
import { studentGraph } from '../data/mockStudentGraph.js'
import { SCORE_BANDS } from '../utils/nodeColorScale.js'

const COURSE_FILTERS = [
  { id: 'all', label: 'All Courses' },
  { id: 'AI for Business Decisions', label: 'AI for Business' },
  { id: 'Strategic Management', label: 'Strategic Mgmt' },
  { id: 'Entrepreneurship', label: 'Entrepreneurship' },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedNode, setSelectedNode]       = useState(null)
  const [activeCourse, setActiveCourse]       = useState('all')
  const [showGenerator, setShowGenerator]     = useState(false)
  const [graphData, setGraphData]             = useState(studentGraph)

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
      <div className="flex min-h-screen flex-col bg-space-page">
        <Navbar />
        <div className="flex min-h-0 flex-1 flex-col pt-14">

          {/* Sub-header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-claro-indigo/15 bg-claro-panel/95">
            <div>
              <h1 className="text-sm font-medium text-claro-text">My Knowledge Graph</h1>
              <p className="text-xs text-claro-muted">{graphData.nodes.length} concepts · {graphData.links.length} connections</p>
            </div>

            {/* Course filter pills */}
            <div className="flex items-center gap-1.5">
              {COURSE_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveCourse(f.id)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    activeCourse === f.id
                      ? 'bg-claro-indigo border-claro-indigo text-white'
                      : 'bg-claro-canvas border-claro-indigo/20 text-claro-muted hover:border-claro-indigo/40'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/student/notes')}
                className="rounded-lg border border-claro-indigo/25 bg-claro-panel px-3 py-1.5 text-xs text-claro-muted transition-colors hover:border-claro-indigo/40 hover:text-claro-text"
              >
                Notes
              </button>
              <button
                onClick={() => setShowGenerator(true)}
                className="rounded-lg bg-claro-indigo px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:brightness-110 active:brightness-95 dark:hover:brightness-125"
              >
                + Add from syllabus
              </button>
            </div>
          </div>

          {/* Legend + stats */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2 border-b border-claro-indigo/12 bg-claro-canvas/80">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-claro-muted">Accuracy</span>
              {SCORE_BANDS.map(b => (
                <div key={b.range} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-black/5" style={{ background: b.color }} />
                  <span className="text-[10px] text-claro-muted">{b.range} {b.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 border-l border-claro-indigo/15 pl-3">
                <div className="h-0.5 w-4" style={{ background: '#a16207' }} />
                <span className="text-[10px] text-claro-muted">Cross-course link</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
              {[
                { label: 'AI for Business', color: '#22c55e' },
                { label: 'Strategic Mgmt', color: '#16a34a' },
                { label: 'Entrepreneurship', color: '#15803d' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full opacity-85" style={{ background: c.color }} />
                  <span className="text-[11px] text-claro-muted">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graph + detail panel */}
          <div className="flex-1 relative overflow-hidden">
            <KnowledgeGraph3D
              graphData={graphData}
              onNodeClick={handleNodeClick}
              highlightCourse={activeCourse === 'all' ? null : activeCourse}
            />

            {selectedNode && (
              <NodeDetailPanel
                node={selectedNode}
                mode="student"
                onClose={() => setSelectedNode(null)}
                preferences={user?.preferences}
              />
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
