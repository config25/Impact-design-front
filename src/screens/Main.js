import "./Main.css";
import backgroundImage from "../resource/start/background.jpg";

const Main = ({ onLogin, onRegister }) => {
    return (
        <div
            className="login-screen"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="login-overlay">
                <div className="login-content">
                    <h1 className="login-title">Impact Design Canvas</h1>
                    <p className="login-subtitle">
                        압도적 성과조직을 만드는 네 가지 Performance Secret
                    </p>

                    <div className="login-card">
                        <button className="login-btn-primary" onClick={onLogin}>
                            LOGIN
                        </button>
                        <button className="login-btn-secondary" onClick={onRegister}>
                            계정등록
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
