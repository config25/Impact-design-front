import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { DashboardContext } from "../../contexts/DashboardContext";
import { useGameStep } from "../../contexts/GameStepContext";
import iconsImg from "../../resource/GNB/icons.png";
import "./GNB.css";

const STEP_MAP = {
    impactcheck: "A",
    identity: "B",
    performance: "C",
    quickwin: "D",
    buildwin: "E",
    review: "F",
};

const GNB = ({ activeScreen }) => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const { dashboard, clearDashboard } = useContext(DashboardContext);
    const { gameStep, fetchStep, resetGameStep } = useGameStep();

    useEffect(() => {
        if (gameStep === null) fetchStep();
    }, [gameStep, fetchStep]);

    const menuItems = [
        { id: "impactcheck", path: "/impactcheck", title: "IMPACT Check", subtitle: "성과관리 현황진단" },
        { id: "identity", path: "/identity", title: "Strategic Identity Canvas", subtitle: "정체성 설계" },
        { id: "performance", path: "/performance", title: "Performance Flow Canvas", subtitle: "성과경로 설계" },
        { id: "quickwin", path: "/quickwin", title: "Quick Win Canvas", subtitle: "전술적 실행과제" },
        { id: "buildwin", path: "/buildwin", title: "Build Win Canvas", subtitle: "전략적 실행과제" },
        { id: "review", path: "/review", title: "IMPACT Review", subtitle: "실행과제 검증" },
    ];

    const allowedSteps = gameStep ? gameStep.split(",").map(s => s.trim()) : [];
    const isAllowed = (screenId) => {
        if (!gameStep) return true;
        const groupKey = STEP_MAP[screenId];
        return allowedSteps.some(s => s === groupKey || s.startsWith(groupKey + "-"));
    };

    const handleClick = (item) => {
        if (!isAllowed(item.id)) return;
        navigate(item.path);
    };

    return (
        <>
        <div className="gnb-topbar">
            <div className="gnb-topbar-left">
                <img src={iconsImg} alt="icon" className="gnb-topbar-icon" onClick={() => navigate("/start")} style={{ cursor: "pointer" }} />
                <span className="gnb-topbar-title">{dashboard?.className || "강의실"}</span>
            </div>
            <div className="gnb-topbar-right">
                <span className="gnb-topbar-team">{dashboard?.teamName || ""}</span>
                <span className="gnb-topbar-divider">|</span>
                <span className="gnb-topbar-user">{dashboard?.userName || ""}</span>
                <button className="gnb-topbar-logout" onClick={() => { if (window.confirm("로그아웃 하시겠습니까?")) { clearDashboard(); resetGameStep(); logout(); } }}>로그아웃</button>
            </div>
        </div>
        <nav className="gnb">
            <div className="gnb-inner">
                {menuItems.map((item) => {
                    const allowed = isAllowed(item.id);
                    return (
                        <button
                            key={item.id}
                            className={`gnb-item ${activeScreen === item.id ? "active" : ""} ${!allowed ? "disabled" : ""}`}
                            onClick={() => handleClick(item)}
                            disabled={!allowed}
                        >
                            <span className="gnb-title">{item.title}</span>
                            <span className="gnb-subtitle">{item.subtitle}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
        </>
    );
};

export default GNB;
