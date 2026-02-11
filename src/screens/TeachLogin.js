import { useState, useContext } from "react";
import "./TeachLogin.css";
import backgroundImage from "../resource/start/background.jpg";
import { teacherLogin } from "../services/authService";
import { AuthContext } from "../contexts/AuthContext";

const TeachLogin = ({ onLogin }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { saveTokens } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!id || !password) {
            setError("아이디와 패스워드를 입력해주세요.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const result = await teacherLogin(id, password);

            if (result.success) {
                saveTokens(result.accessToken, result.refreshToken, result.userRole);
                if (onLogin) onLogin();
            } else {
                setError(result.message);
            }
        } catch (e) {
            setError("서버에 연결할 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
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
                                onKeyDown={handleKeyDown}
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
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {error && (
                            <div className="tl-error-row">
                                <span className="tl-error-dot">!</span>
                                <span className="tl-error-text">{error}</span>
                            </div>
                        )}

                        <button
                            className="tl-btn-login"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? "로그인 중..." : "LOGIN"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeachLogin;
