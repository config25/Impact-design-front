import "./GNB.css";

const STEP_MAP = {
    impactcheck: "A",
    identity: "B",
    performance: "C",
    quickwin: "D",
    buildwin: "E",
    review: "F",
};

const GNB = ({ activeScreen, onNavigate, gameStep }) => {
    const menuItems = [
        { id: "impactcheck", title: "IMPACT Check", subtitle: "성과관리 현황진단" },
        { id: "identity", title: "Strategic Identity Canvas", subtitle: "정체성 설계" },
        { id: "performance", title: "Performance Flow Canvas", subtitle: "성과경로 설계" },
        { id: "quickwin", title: "Quick Win Canvas", subtitle: "전술적 실행과제" },
        { id: "buildwin", title: "Build Win Canvas", subtitle: "전략적 실행과제" },
        { id: "review", title: "IMPACT Review", subtitle: "실행과제 검증" },
    ];

    const allowedSteps = gameStep ? gameStep.split(",").map(s => s.trim()) : [];
    const isAllowed = (screenId) => {
        if (!gameStep) return true;
        const groupKey = STEP_MAP[screenId];
        // "A" (구 포맷) 또는 "A-1" (신 포맷) 둘 다 지원
        return allowedSteps.some(s => s === groupKey || s.startsWith(groupKey + "-"));
    };

    const handleClick = (screenId) => {
        if (!isAllowed(screenId)) return;
        if (onNavigate) {
            onNavigate(screenId);
        }
    };

    return (
        <nav className="gnb">
            <div className="gnb-inner">
                {menuItems.map((item) => {
                    const allowed = isAllowed(item.id);
                    return (
                        <button
                            key={item.id}
                            className={`gnb-item ${activeScreen === item.id ? "active" : ""} ${!allowed ? "disabled" : ""}`}
                            onClick={() => handleClick(item.id)}
                            disabled={!allowed}
                        >
                            <span className="gnb-title">{item.title}</span>
                            <span className="gnb-subtitle">{item.subtitle}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default GNB;
