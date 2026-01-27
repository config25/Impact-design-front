import "./GNB.css";

const GNB = ({ activeScreen, onNavigate }) => {
    const menuItems = [
        { id: "impactcheck", title: "IMPACT Check", subtitle: "성과관리 현황진단" },
        { id: "identity", title: "Strategic Identity Canvas", subtitle: "정체성 설계" },
        { id: "performance", title: "Performance Flow Canvas", subtitle: "성과경로 설계" },
        { id: "quickwin", title: "Quick Win Canvas", subtitle: "전술적 실행과제" },
        { id: "buildwin", title: "Build Win Canvas", subtitle: "전략적 실행과제" },
        { id: "review", title: "IMPACT Review", subtitle: "실행과제 검증" },
    ];

    const handleClick = (screenId) => {
        if (onNavigate) {
            onNavigate(screenId);
        }
    };

    return (
        <nav className="gnb">
            <div className="gnb-inner">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`gnb-item ${activeScreen === item.id ? "active" : ""}`}
                        onClick={() => handleClick(item.id)}
                    >
                        <span className="gnb-title">{item.title}</span>
                        <span className="gnb-subtitle">{item.subtitle}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default GNB;
