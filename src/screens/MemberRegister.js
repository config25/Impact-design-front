import { useState } from "react";
import "./MemberRegister.css";
import backgroundImage from "../resource/start/background.jpg";
import { checkLoginId, checkCode, signup } from "../services/authService";

const MemberRegister = ({ onRegister }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [idChecked, setIdChecked] = useState(false);
    const [idCheckMsg, setIdCheckMsg] = useState("");
    const [idCheckError, setIdCheckError] = useState(false);
    const [codeConfirmed, setCodeConfirmed] = useState(false);
    const [codeMsg, setCodeMsg] = useState("");
    const [codeError, setCodeError] = useState(false);
    const [teams, setTeams] = useState([]);
    const [team, setTeam] = useState("");

    const handleIdCheck = async () => {
        if (!id) return;
        const result = await checkLoginId(id);
        if (result.success) {
            setIdChecked(true);
            setIdCheckMsg("사용 가능한 아이디입니다.");
            setIdCheckError(false);
        } else {
            setIdChecked(false);
            setIdCheckMsg(result.message);
            setIdCheckError(true);
        }
    };

    const handleCodeCheck = async () => {
        if (!code) return;
        const result = await checkCode(code);
        if (result.success) {
            setCodeConfirmed(true);
            setCodeMsg("확인되었습니다");
            setCodeError(false);
            setTeams(result.teams);
            setTeam("");
        } else {
            setCodeConfirmed(false);
            setCodeMsg(result.message);
            setCodeError(true);
            setTeams([]);
            setTeam("");
        }
    };

    const handleRegister = async () => {
        if (!id || !password || !code || !idChecked || !codeConfirmed || !team) return;
        const result = await signup(id, password, code, Number(team));
        if (result.success) {
            alert("회원가입이 완료되었습니다.");
            onRegister();
        } else {
            alert(result.message);
        }
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
                                        setIdCheckMsg("");
                                        setIdCheckError(false);
                                    }}
                                />
                                <button
                                    className="mr-btn-check"
                                    onClick={handleIdCheck}
                                >
                                    중복확인
                                </button>
                            </div>
                            {idCheckMsg && (
                                <span className={idCheckError ? "mr-error-msg" : "mr-confirm-msg"}>
                                    {idCheckMsg}
                                </span>
                            )}
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
                                        setCodeMsg("");
                                        setCodeError(false);
                                        setTeams([]);
                                        setTeam("");
                                    }}
                                />
                                <button
                                    className="mr-btn-check"
                                    onClick={handleCodeCheck}
                                >
                                    코드확인
                                </button>
                            </div>
                            {codeMsg && (
                                <span className={codeError ? "mr-error-msg" : "mr-confirm-msg"}>
                                    {codeMsg}
                                </span>
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
                                    {teams.map((t) => (
                                        <option key={t.teamId} value={t.teamId}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            className="mr-btn-register"
                            onClick={handleRegister}
                            disabled={!idChecked || !codeConfirmed}
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
