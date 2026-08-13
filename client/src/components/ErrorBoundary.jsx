import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Caught by error boundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-100">Something went wrong</h1>
          <p className="text-slate-400 mt-2">
            Please refresh the page. If the problem continues, try again later.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary