import { useState } from "react";
import "./MemberLogin.css";
import backgroundImage from "../resource/start/background.jpg";

const MemberLogin = ({ onLogin }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (!id || !password) {
            setError("패스워드가 일치하지 않습니다.");
            return;
        }
        setError("");
        onLogin();
    };

    return (
        <div
            className="ml-screen"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="ml-overlay">
                <div className="ml-content">
                    <h1 className="ml-title">Impact Design Canvas</h1>
                    <p className="ml-subtitle">
                        압도적 성과조직을 만드는 네 가지 Performance Secret
                    </p>

                    <div className="ml-tab-row">
                        <div className="ml-tab-active">회원 로그인</div>
                    </div>

                    <div className="ml-card">
                        <div className="ml-field">
                            <label className="ml-label">ID</label>
                            <input
                                className="ml-input"
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>

                        <div className="ml-field">
                            <label className="ml-label">PASSWORD</label>
                            <input
                                className="ml-input"
                                type="password"
                                placeholder="패스워드를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="ml-error-row">
                                <span className="ml-error-dot"></span>
                                <span className="ml-error-text">{error}</span>
                            </div>
                        )}

                        <button className="ml-btn-login" onClick={handleLogin}>
                            LOGIN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberLogin;
