import React, { Component } from "react";
import { Result, Button } from "antd";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error);
    console.error(errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="Something went wrong"
          subTitle="An unexpected error occurred."
          extra={
            <Button
              type="primary"
              onClick={this.handleReload}
            >
              Reload
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;