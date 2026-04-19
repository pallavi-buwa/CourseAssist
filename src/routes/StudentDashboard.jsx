import { useState } from 'react'
import { RequireAuth, useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import KnowledgeGraph3D from '../components/KnowledgeGraph3D.jsx'
import NodeDetailPanel from '../components/NodeDetailPanel.jsx'
import GraphGenerator from '../components/GraphGenerator.jsx'
import { studentGraph } from '../data/mockStudentGraph.js'

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
      <div className="min-h-screen bg-claro-midnight flex flex-col">
        <Navbar />
        <div className="pt-20 flex flex-col flex-1">

          {/* Sub-header */}
          <div className="max-w-6xl mx-auto w-full px-5">
            <div className="flex items-center justify-between px-5 py-4 border border-[#3A3550] rounded-3xl bg-claro-slate/55">
              <div>
                <h1 className="text-sm font-medium text-claro-text">My Knowledge Graph</h1>
                <p className="text-xs text-claro-muted">{graphData.nodes.length} concepts · {graphData.links.length} connections</p>
              </div>

              <div className="flex items-center gap-1.5">
                {COURSE_FILTERS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveCourse(f.id)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                      activeCourse === f.id
                        ? 'bg-claro-indigo border-claro-indigo text-white'
                        : 'bg-claro-midnight border-[#3A3550] text-claro-muted hover:border-[#4A4463] hover:text-claro-text'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/student/notes')}
                  className="border border-[#3A3550] text-claro-muted hover:text-claro-text hover:border-[#4A4463] rounded-lg px-3 py-1.5 text-xs transition-colors"
                >
                  ✎ Notes
                </button>
                <button
                  onClick={() => setShowGenerator(true)}
                  className="bg-claro-indigo hover:brightness-110 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  + Add from syllabus
                </button>
              </div>
            </div>
          </div>

          {/* Legend + stats */}
          <div className="max-w-6xl mx-auto w-full px-10 py-3 flex items-center gap-6">
            <div className="flex items-center gap-4">
              {[
                { color: '#9EE4D4', label: 'Strong (≥70%)' },
                { color: '#FFD6A8', label: 'Developing (50–69%)' },
                { color: '#FFB8C8', label: 'Needs work (<50%)' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-[11px] text-claro-muted">{l.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 ml-2">
                <div className="w-4 h-0.5" style={{ background: '#FFD6A8' }} />
                <span className="text-[11px] text-claro-muted">Cross-course link</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
              {[
                { label: 'AI for Business', color: '#C4B5FF' },
                { label: 'Strategic Mgmt', color: '#8EE4D2' },
                { label: 'Entrepreneurship', color: '#FFD6A8' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full opacity-70" style={{ background: c.color }} />
                  <span className="text-[11px] text-claro-muted">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graph + detail panel */}
          <div className="flex-1 overflow-hidden px-5 py-4">
            <div className="relative h-full w-full max-w-6xl mx-auto rounded-3xl border border-[#3A3550] bg-claro-slate/35">
              <KnowledgeGraph3D
                graphData={graphData}
                onNodeClick={handleNodeClick}
                highlightCourse={activeCourse === 'all' ? null : activeCourse}
                height={620}
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
