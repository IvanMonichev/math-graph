import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Result } from 'antd';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('MathGraph:', error, info.componentStack);
  }
  render() {
    return this.state.failed ? (
      <Result
        status="error"
        title="Не удалось открыть приложение"
        extra={<Button onClick={() => window.location.reload()}>Перезагрузить</Button>}
      />
    ) : (
      this.props.children
    );
  }
}
