import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console and could be sent to a monitoring service
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 12, border: '1px solid #fca5a5', borderRadius: 8 }}>
          <div style={{ color: '#b91c1c', fontWeight: 700 }}>Lỗi hiển thị thành phần</div>
          <div style={{ marginTop: 8 }}>{String(this.state.error)}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
