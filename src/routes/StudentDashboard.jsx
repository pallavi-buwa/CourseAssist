import { useState, useRef } from 'react'
import { RequireAuth, useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import KnowledgeGraph3D from '../components/KnowledgeGraph3D.jsx'
import NodeDetailPanel from '../components/NodeDetailPanel.jsx'
import NotesWorkspace from '../components/NotesWorkspace.jsx'
import GraphGenerator from '../components/GraphGenerator.jsx'
import { studentGraph } from '../data/mockStudentGraph.js'
import { LeafBackdrop } from '../components/brand/LeafBackdrop.jsx'
import { SCORE_BANDS } from '../utils/nodeColorScale.js'

const COURSE_FILTERS = [
  { id: 'all', label: 'All Courses' },
  { id: 'AI for Business Decisions', label: 'AI for Business' },
  { id: 'Strategic Management', label: 'Strategic Mgmt' },
  { id: 'Entrepreneurship', label: 'Entrepreneurship' },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const [selectedNode, setSelectedNode]       = useState(null)
  const [activeCourse, setActiveCourse]       = useState('all')
  const [showNotes, setShowNotes]             = useState(false)
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
      <div className="flex min-h-screen flex-col bg-claro-midnight">
        <Navbar />
        <LeafBackdrop className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col pt-14">

          {/* Sub-header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#2D6A4F]/15 bg-[#FFFCF7]/95">
            <div>
              <h1 className="text-sm font-medium text-[#1B4332]">My Knowledge Graph</h1>
              <p className="text-xs text-[#5C6B63]">{graphData.nodes.length} concepts · {graphData.links.length} connections</p>
            </div>

            {/* Course filter pills */}
            <div className="flex items-center gap-1.5">
              {COURSE_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveCourse(f.id)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    activeCourse === f.id
                      ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                      : 'bg-[#FDF6ED] border-[#2D6A4F]/20 text-[#5C6B63] hover:border-[#2D6A4F]/40'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotes(v => !v)}
                className="border border-[#2D6A4F]/25 text-[#5C6B63] hover:text-[#1B4332] hover:border-[#2D6A4F]/40 rounded-lg px-3 py-1.5 text-xs transition-colors bg-[#FFFCF7]"
              >
                ✎ Notes
              </button>
              <button
                onClick={() => setShowGenerator(true)}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
              >
                + Add from syllabus
              </button>
            </div>
          </div>

          {/* Legend + stats */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2 border-b border-[#2D6A4F]/12 bg-[#FDF6ED]/80">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-[#5C6B63]">Accuracy</span>
              {SCORE_BANDS.map(b => (
                <div key={b.range} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-black/5" style={{ background: b.color }} />
                  <span className="text-[10px] text-[#5C6B63]">{b.range} {b.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 border-l border-[#2D6A4F]/15 pl-3">
                <div className="h-0.5 w-4" style={{ background: '#a16207' }} />
                <span className="text-[10px] text-[#5C6B63]">Cross-course link</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
              {[
                { label: 'AI for Business', color: '#14532d' },
                { label: 'Strategic Mgmt', color: '#1a5f45' },
                { label: 'Entrepreneurship', color: '#3f5c4d' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full opacity-85" style={{ background: c.color }} />
                  <span className="text-[11px] text-[#5C6B63]">{c.label}</span>
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
                preferences={{ language: 'English', format: 'video' }}
              />
            )}
          </div>

        </div>
        </LeafBackdrop>

        {showNotes && <NotesWorkspace onClose={() => setShowNotes(false)} />}
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
