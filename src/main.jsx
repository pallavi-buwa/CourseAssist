import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('[main] module executing')

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
  console.log('[main] render called')
} catch (e) {
  console.error('[main] render error:', e)
  document.getElementById('root').innerHTML = '<div style="color:red;padding:20px">Error: ' + e.message + '</div>'
}
