import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[CourseAssist] render error', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-screen bg-claro-midnight text-claro-text flex items-center justify-center p-6">
        <div className="max-w-xl rounded-lg border border-claro-coral/30 bg-claro-slate p-6">
          <p className="text-xs uppercase tracking-widest text-claro-coral mb-3">Something crashed</p>
          <h1 className="text-xl font-semibold mb-3">CourseAssist could not render this screen.</h1>
          <p className="text-sm text-claro-muted leading-6 mb-4">
            The app caught the error instead of leaving you on a blank page. Try signing out or clearing old demo data if this happened right after the intro.
          </p>
          <pre className="max-h-40 overflow-auto rounded bg-black/30 p-3 text-xs text-claro-coral whitespace-pre-wrap">
            {this.state.error.message}
          </pre>
          <button
            onClick={() => {
              localStorage.removeItem('eg_user')
              window.location.assign('/')
            }}
            className="mt-5 rounded-lg bg-claro-indigo px-4 py-2 text-sm font-medium text-white hover:brightness-110"
          >
            Reset demo session
          </button>
        </div>
      </div>
    )
  }
}
