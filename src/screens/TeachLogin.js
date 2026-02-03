import { useState } from "react";
import "./TeachLogin.css";
import backgroundImage from "../resource/start/background.jpg";

const TeachLogin = ({ onLogin }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (!id || !password) {
            setError("패스워드가 일치하지 않습니다.");
            return;
        }
        setError("");
        if (onLogin) onLogin();
    };

    return (
        <div
            className="tl-screen"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="tl-overlay">
                <div className="tl-content">
                    <h1 className="tl-title">Impact Design Canvas</h1>
                    <p className="tl-subtitle">
                        압도적 성과조직을 만드는 네 가지 Performance Secret
                    </p>

                    <div className="tl-tab-row">
                        <div className="tl-tab-active">강사 로그인</div>
                    </div>

                    <div className="tl-card">
                        <div className="tl-field">
                            <label className="tl-label">ID</label>
                            <input
                                className="tl-input"
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>

                        <div className="tl-field">
                            <label className="tl-label">PASSWORD</label>
                            <input
                                className="tl-input"
                                type="password"
                                placeholder="패스워드를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="tl-error-row">
                                <span className="tl-error-dot"></span>
                                <span className="tl-error-text">{error}</span>
                            </div>
                        )}

                        <button className="tl-btn-login" onClick={handleLogin}>
                            LOGIN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeachLogin;
