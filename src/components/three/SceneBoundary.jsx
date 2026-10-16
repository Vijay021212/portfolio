import { Component } from 'react'

// If anything inside the 3D scene throws (model download failed, WebGL unavailable), drop the canvas
// and keep the rest of the page. Without this, React would unmount the whole site on a 3D error.
export default class SceneBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('[3D] scene disabled:', error?.message ?? error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
