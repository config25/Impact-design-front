import React from "react";

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    handleReset = () => {
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    fontFamily: "Pretendard, sans-serif",
                    color: "#333",
                }}>
                    <h2 style={{ marginBottom: 12 }}>문제가 발생했습니다</h2>
                    <p style={{ marginBottom: 20, color: "#666" }}>
                        페이지를 새로고침하거나 아래 버튼을 눌러주세요.
                    </p>
                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: "10px 24px",
                            backgroundColor: "#337ab7",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 15,
                        }}
                    >
                        다시 시도
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
