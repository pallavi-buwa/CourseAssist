import { useMemo, useCallback, useEffect, useState } from 'react'
import { graphData } from './data/graphData.js'
import { useGraphInteraction } from './hooks/useGraphInteraction.js'
import { useGraphSimulation } from './hooks/useGraphSimulation.js'
import { useExploration } from './hooks/useExploration.js'
import { useCameraAnimation } from './hooks/useCameraAnimation.js'
import Graph3D from './components/Graph3D.jsx'
import SidePanel from './components/SidePanel.jsx'
import NodeTooltip from './components/NodeTooltip.jsx'
import TopBar from './components/TopBar.jsx'
import Legend from './components/Legend.jsx'
import Breadcrumb from './components/Breadcrumb.jsx'
import BrainIntro from './components/BrainIntro.jsx'

export default function App() {
  // ── Brain intro ───────────────────────────────────────────────────────────
  const [showBrain, setShowBrain] = useState(true)
  const [graphVisible, setGraphVisible] = useState(false)

  const handleBrainEnter = useCallback(() => {
    // Small delay so brain scatter finishes before graph fades in
    setTimeout(() => {
      setShowBrain(false)
      setGraphVisible(true)
    }, 200)
  }, [])

  // ── Intro overlay (kept for legacy compat) ───────────────────────────────
  const showIntro = false

  // ── Live simulation ──────────────────────────────────────────────────────
  const {
    enrichedNodes,
    isLive,
    activeFilter,
    toggleLive,
    resetStates,
    setSubjectFilter,
  } = useGraphSimulation(graphData.nodes)

  // Merged live graph data (all nodes + original links)
  const allLiveNodes = enrichedNodes
  const allLiveLinks = graphData.links

  // ── Exploration system ───────────────────────────────────────────────────
  const {
    visibleNodes,
    visibleLinks,
    level,
    anchorId,
    focusNeighborIds,
    breadcrumbs,
    introComplete,
    expandNode,
    goBack,
    resetExploration,
    markIntroComplete,
  } = useExploration(allLiveNodes, allLiveLinks)

  // ── Camera animation ─────────────────────────────────────────────────────
  const { fgRef, flyTo, runIntro, resetCamera } = useCameraAnimation()

  // ── Compose graph data ───────────────────────────────────────────────────
  // Apply enriched statuses to visible nodes
  const nodeStatusMap = useMemo(() => {
    const m = {}
    allLiveNodes.forEach(n => { m[n.id] = n.status })
    return m
  }, [allLiveNodes])

  const liveVisibleNodes = useMemo(() =>
    visibleNodes.map(n => ({ ...n, status: nodeStatusMap[n.id] || 'default' })),
    [visibleNodes, nodeStatusMap]
  )

  const liveGraphData = useMemo(() => ({
    nodes: liveVisibleNodes,
    links: visibleLinks,
  }), [liveVisibleNodes, visibleLinks])

  // ── Interaction ───────────────────────────────────────────────────────────
  const {
    hoveredNode,
    selectedNode,
    tooltipPos,
    neighborIds,
    onNodeHover,
    onNodeClick: rawOnNodeClick,
    onMouseMove,
    closePanel,
  } = useGraphInteraction(liveGraphData.links)

  // Enhanced click: expand + camera fly
  const onNodeClick = useCallback((node) => {
    rawOnNodeClick(node)
    expandNode(node)
    flyTo(node, Math.min(level + 1, 3))
  }, [rawOnNodeClick, expandNode, flyTo, level])

  // Back: camera returns to previous anchor or overview
  const handleBack = useCallback(() => {
    goBack()
    // Fly back to previous anchor if there is one, else overview
    if (breadcrumbs.length > 1) {
      const prevId = breadcrumbs[breadcrumbs.length - 2].id
      const prevNode = allLiveNodes.find(n => n.id === prevId)
      if (prevNode) flyTo(prevNode, Math.max(level - 1, 1))
    } else {
      resetCamera()
    }
  }, [goBack, breadcrumbs, allLiveNodes, flyTo, level, resetCamera])

  const handleReset = useCallback(() => {
    resetExploration()
    resetStates()
    closePanel()
    resetCamera()
  }, [resetExploration, resetStates, closePanel, resetCamera])

  // ── Camera intro when graph first becomes visible ──────────────────────────
  useEffect(() => {
    if (!graphVisible) return
    const timer = setTimeout(() => runIntro(() => markIntroComplete()), 400)
    return () => clearTimeout(timer)
  }, [graphVisible, runIntro, markIntroComplete])

  // ── Layout ────────────────────────────────────────────────────────────────
  const panelOpen  = Boolean(selectedNode)
  const graphWidth  = panelOpen ? window.innerWidth - 340 : window.innerWidth
  const graphHeight = window.innerHeight - 52

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a12]">

      {/* Brain intro – renders above everything */}
      {showBrain && <BrainIntro onEnter={handleBrainEnter} />}

      {/* Graph layer fades in after brain */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${graphVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

      {/* Top bar */}
      <TopBar
        nodeCount={liveGraphData.nodes.length}
        linkCount={liveGraphData.links.length}
        isLive={isLive}
        toggleLive={toggleLive}
        resetStates={handleReset}
        activeFilter={activeFilter}
        setSubjectFilter={setSubjectFilter}
      />

      {/* Breadcrumb trail */}
      <Breadcrumb
        breadcrumbs={breadcrumbs}
        level={level}
        onBack={handleBack}
        onReset={handleReset}
      />

      {/* 3D canvas */}
      <div className="absolute inset-0 pt-[52px] vignette">
        <Graph3D
          graphData={liveGraphData}
          hoveredNode={hoveredNode}
          selectedNode={selectedNode}
          neighborIds={neighborIds}
          onNodeHover={onNodeHover}
          onNodeClick={onNodeClick}
          onMouseMove={onMouseMove}
          activeFilter={activeFilter}
          level={level}
          anchorId={anchorId}
          focusNeighborIds={focusNeighborIds}
          fgRef={fgRef}
          width={graphWidth}
          height={graphHeight}
          introComplete={introComplete}
        />
      </div>

      {/* Side panel */}
      {panelOpen && (
        <div className="absolute top-[52px] right-0 bottom-0 w-[340px] z-10">
          <SidePanel node={selectedNode} onClose={closePanel} />
        </div>
      )}

      {/* Hover tooltip */}
      <NodeTooltip node={hoveredNode} position={tooltipPos} />

      {/* Legend */}
      <Legend />

      {/* Exploration level indicator */}
      <LevelIndicator level={level} totalVisible={liveGraphData.nodes.length} />

      {/* Hint */}
      {!hoveredNode && !selectedNode && level === 0 && (
        <div className="absolute bottom-6 right-6 text-[11px] text-slate-600 pointer-events-none text-right leading-relaxed">
          <div>Scroll to zoom · Drag to orbit</div>
          <div>Click a node to explore deeper</div>
        </div>
      )}

      </div> {/* end graph layer */}
    </div>
  )
}

// ── Level indicator ──────────────────────────────────────────────────────────
function LevelIndicator({ level, totalVisible }) {
  const labels = ['Overview', 'Focused', 'Deep Dive', 'Deep Dive+']
  const colors = [
    'text-slate-400',
    'text-blue-400',
    'text-purple-400',
    'text-emerald-400',
  ]
  return (
    <div className="absolute top-[62px] right-5 z-20 flex items-center gap-2 pointer-events-none">
      <span className={`text-[11px] font-medium ${colors[level] || colors[3]}`}>
        {labels[level] || 'Deep Dive+'}
      </span>
      <span className="text-slate-600 text-[10px]">· {totalVisible} nodes</span>
    </div>
  )
}
