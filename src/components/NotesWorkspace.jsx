import { useState } from 'react'
import { studentGraph } from '../data/mockStudentGraph.js'

const MOCK_NOTES = [
  { id: 1, text: 'Decision Frameworks are key for both AI and strategy courses — strong cross-course link!', node: 'Decision Frameworks', timestamp: '2 days ago' },
  { id: 2, text: 'Risk Assessment: review the difference between qualitative and quantitative methods.', node: 'Risk Assessment', timestamp: '1 week ago' },
]

export default function NotesWorkspace({ onClose }) {
  const [text, setText]         = useState('')
  const [attachedNode, setAttachedNode] = useState('')
  const [nodeSearch, setNodeSearch]     = useState('')
  const [notes, setNotes]       = useState(MOCK_NOTES)
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  const allNodes = studentGraph.nodes.map(n => ({ id: n.id, label: n.label }))
  const filtered = allNodes.filter(n => n.label.toLowerCase().includes(nodeSearch.toLowerCase()))

  const handleSave = () => {
    if (!text.trim()) return
    setNotes(prev => [{
      id: Date.now(),
      text,
      node: attachedNode || 'Unattached',
      timestamp: 'just now',
    }, ...prev])
    setText(''); setAttachedNode(''); setNodeSearch('')
  }

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setUploadedFile(`Attached to ${attachedNode || 'your graph'}`)
    }, 1800)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[50vh] bg-gray-900 border-t border-gray-800 z-40 flex flex-col"
         style={{ animation: 'slideInUp 0.3s ease-out' }}>

      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h3 className="text-sm font-medium text-white">Notes Workspace</h3>
        <button type="button" onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-white transition-colors text-xs">Close</button>
      </div>

      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Editor */}
        <div className="flex-1 flex flex-col p-4 gap-3 border-r border-gray-800">
          {/* Toolbar */}
          <div className="flex gap-1 border-b border-gray-800 pb-2">
            {['B','I','•'].map(t => (
              <button key={t} className="w-7 h-7 border border-gray-700 rounded text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-colors font-medium">{t}</button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none"
            placeholder="Start typing your notes…"
          />
          <div className="flex items-center gap-2">
            {/* Node attach */}
            <div className="flex-1 relative">
              <input
                value={nodeSearch}
                onChange={e => setNodeSearch(e.target.value)}
                placeholder="Attach to node…"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-claro-indigo"
              />
              {nodeSearch && (
                <div className="absolute bottom-full mb-1 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-32 overflow-y-auto z-10">
                  {filtered.slice(0, 8).map(n => (
                    <button key={n.id} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                      onClick={() => { setAttachedNode(n.label); setNodeSearch(n.label) }}>
                      {n.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* File upload */}
            <label className="cursor-pointer border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-lg px-3 py-1.5 text-xs transition-colors">
              {uploading ? 'Analyzing…' : uploadedFile ? 'Attached' : 'Upload file'}
              <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleFile} />
            </label>

            <button onClick={handleSave} className="bg-claro-indigo hover:brightness-110 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">Save</button>
          </div>
          {uploadedFile && <p className="text-xs text-green-400">{uploadedFile}</p>}
        </div>

        {/* Notes list */}
        <div className="w-64 overflow-y-auto p-3 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">Saved Notes</p>
          {notes.map(n => (
            <div key={n.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-300 leading-relaxed mb-1 line-clamp-3">{n.text}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-claro-indigo">{n.node}</span>
                <span className="text-[10px] text-gray-600">{n.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
