import { useRef, useCallback } from 'react'
import { flyToNode, playIntro } from '../utils/cameraUtils.js'

/**
 * Wraps the camera animation utilities.
 * Always cancels the previous animation before starting a new one.
 */
export function useCameraAnimation() {
  const fgRef    = useRef(null)
  const cancelFn = useRef(() => {})

  const cancelCurrent = useCallback(() => {
    cancelFn.current?.()
    cancelFn.current = () => {}
  }, [])

  const flyTo = useCallback((node, level, onComplete) => {
    cancelCurrent()
    cancelFn.current = flyToNode(fgRef, node, level, onComplete)
  }, [cancelCurrent])

  const runIntro = useCallback((onComplete) => {
    cancelCurrent()
    cancelFn.current = playIntro(fgRef, onComplete)
  }, [cancelCurrent])

  const resetCamera = useCallback(() => {
    cancelCurrent()
    cancelFn.current = flyToNode(fgRef, { x: 0, y: 0, z: 0 }, 0)
  }, [cancelCurrent])

  return { fgRef, flyTo, runIntro, resetCamera, cancelCurrent }
}
