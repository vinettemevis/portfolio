import { Component, type PropsWithChildren, type ReactNode } from "react";

interface CanvasBoundaryProps extends PropsWithChildren {
  fallback: ReactNode;
}

interface CanvasBoundaryState {
  failed: boolean;
}

/**
 * Catches render/runtime errors from a single 3D component (CityScene,
 * GlobeAccent) and swaps in its CSS/SVG fallback instead of blanking the
 * page. Each 3D component gets its own boundary so one failing scene can
 * never take down another.
 */
export class CanvasBoundary extends Component<
  CanvasBoundaryProps,
  CanvasBoundaryState
> {
  state: CanvasBoundaryState = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // no-op: state flip alone is enough to swap in the fallback.
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
