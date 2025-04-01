import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("DataGrid Error:", error, info);
  }

  render() {
    return this.state.hasError
      ? <div style={{ color: 'red', padding: 20 }}>
          Something went wrong displaying the data. Please try again later.
        </div>
      : this.props.children;
  }
}