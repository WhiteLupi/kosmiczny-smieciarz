import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown): void {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = (): void => this.setState({ error: null });

  render(): ReactNode {
    if (this.state.error) {
      const fallback = this.props.fallback;
      if (fallback) return fallback(this.state.error, this.reset);
      return (
        <div
          style={{
            padding: 40,
            color: '#d94d4d',
            fontFamily: "'VT323', monospace",
            fontSize: 24,
          }}
        >
          ▸ BŁĄD SYSTEMOWY ◂
          <br />
          {this.state.error.message}
          <br />
          <button className="btn" style={{ marginTop: 20 }} onClick={this.reset}>
            RESET SCENY
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
