import { useState } from "react";
import "./MemberRegister.css";
import backgroundImage from "../resource/start/background.jpg";

const MemberRegister = ({ onRegister }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [idChecked, setIdChecked] = useState(false);
    const [codeConfirmed, setCodeConfirmed] = useState(false);
    const [team, setTeam] = useState("");

    const handleIdCheck = () => {
        if (!id) return;
        setIdChecked(true);
    };

    const handleCodeCheck = () => {
        if (!code) return;
        setCodeConfirmed(true);
    };

    const handleRegister = () => {
        if (!id || !password || !code || !codeConfirmed || !team) return;
        onRegister();
    };

    return (
        <div
            className="mr-screen"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="mr-overlay">
                <div className="mr-content">
                    <h1 className="mr-title">Impact Design Canvas</h1>
                    <p className="mr-subtitle">
                        압도적 성과조직을 만드는 네 가지 Performance Secret
                    </p>

                    <div className="mr-tab-row">
                        <div className="mr-tab-active">계정등록</div>
                    </div>

                    <div className="mr-card">
                        {/* ID */}
                        <div className="mr-field">
                            <label className="mr-label">ID</label>
                            <div className="mr-input-row">
                                <input
                                    className="mr-input-with-btn"
                                    type="text"
                                    placeholder="아이디를 입력하세요"
                                    value={id}
                                    onChange={(e) => {
                                        setId(e.target.value);
                                        setIdChecked(false);
                                    }}
                                />
                                <button
                                    className="mr-btn-check"
                                    onClick={handleIdCheck}
                                >
                                    중복확인
                                </button>
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="mr-field">
                            <label className="mr-label">PASSWORD</label>
                            <input
                                className="mr-input"
                                type="password"
                                placeholder="패스워드를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Code */}
                        <div className="mr-field">
                            <label className="mr-label">Code</label>
                            <div className="mr-input-row">
                                <input
                                    className="mr-input-with-btn"
                                    type="text"
                                    placeholder="Code를 입력하세요"
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                        setCodeConfirmed(false);
                                    }}
                                />
                                <button
                                    className="mr-btn-check"
                                    onClick={handleCodeCheck}
                                >
                                    코드확인
                                </button>
                            </div>
                            {codeConfirmed && (
                                <span className="mr-confirm-msg">확인되었습니다</span>
                            )}
                        </div>

                        {/* 팀 선택 (코드 확인 후) */}
                        {codeConfirmed && (
                            <div className="mr-team-field">
                                <label className="mr-label">Team</label>
                                <select
                                    className={`mr-team-select${!team ? " placeholder" : ""}`}
                                    value={team}
                                    onChange={(e) => setTeam(e.target.value)}
                                >
                                    <option value="" disabled>팀을 선택하세요</option>
                                    <option value="team1">팀 1</option>
                                    <option value="team2">팀 2</option>
                                    <option value="team3">팀 3</option>
                                    <option value="team4">팀 4</option>
                                    <option value="team5">팀 5</option>
                                </select>
                            </div>
                        )}

                        <button
                            className="mr-btn-register"
                            onClick={handleRegister}
                        >
                            계정등록
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberRegister;
