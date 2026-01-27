const ThreatSection = () => {
    return (
        <section className="identity-section threat-section">
            {/* 외부의 위협 신호 헤더 - 728 x 100 */}
            <div className="threat-header">
                <div className="threat-header-title">
                    외부의 위협 신호 (External Threats)
                </div>
                <div className="threat-header-subtitle">
                    "우리를 위협하는 외부의 경고는 무엇입니까?"
                </div>
            </div>

            {/* 4가지 카드를 감싼 빨간 박스 - 728 x 282 */}
            <div className="threat-body">
                <div className="threat-grid">
                    <div className="threat-card">
                        <div className="threat-card-title">정책/경제 (Macro)</div>
                        <div className="threat-card-question">
                            규제강화, 원가상승 등<br />
                            불리한 환경요인은?
                        </div>
                    </div>
                    <div className="threat-card">
                        <div className="threat-card-title">기술 (Tech)</div>
                        <div className="threat-card-question">
                            우리의 경쟁력을 위협하는<br />
                            새로운 기술은?
                        </div>
                    </div>
                    <div className="threat-card">
                        <div className="threat-card-title">고객/사회 (Customer)</div>
                        <div className="threat-card-question">
                            고객의 취향은 얼마나<br />
                            냉정하게 변했는가?
                        </div>
                    </div>
                    <div className="threat-card">
                        <div className="threat-card-title">경쟁 (Competitor)</div>
                        <div className="threat-card-question">
                            경쟁사가 우리보다<br />
                            앞서고 있는 것은 없는가?
                        </div>
                    </div>
                </div>
            </div>

            {/* 4가지 카드를 감싼 빨간 박스 (상단) - 728 x 282 */}
            <div className="internal-body">
                <div className="internal-grid">
                    <div className="internal-card">
                        <div className="internal-card-title">역량(Capability)</div>
                        <div className="internal-card-question">
                            미래 성장을 위해 시급히<br />
                            보완해야 할 스킬은?
                        </div>
                    </div>
                    <div className="internal-card">
                        <div className="internal-card-title">문화(Culture)</div>
                        <div className="internal-card-question">
                            협업과 혁신을 가로막는<br />
                            조직 분위기는?
                        </div>
                    </div>
                    <div className="internal-card">
                        <div className="internal-card-title">구조(Structure)</div>
                        <div className="internal-card-question">
                            속도를 떨어뜨리는<br />
                            비효율적 체계는?
                        </div>
                    </div>
                    <div className="internal-card">
                        <div className="internal-card-title">기타</div>
                        <div className="internal-card-question">
                            경쟁사가 우리보다<br />
                            앞서고 있는 것은 없는가?
                        </div>
                    </div>
                </div>
            </div>

            {/* 내부의 한계점 푸터 - 728 x 100 */}
            <div className="internal-footer">
                <div className="internal-footer-title">
                    내부의 한계점 (Internal Limits)
                </div>
                <div className="internal-footer-subtitle">
                    "앞으로의 성장을 위해 넘어서야 할 내부의 한계는 무엇입니까?"
                </div>
            </div>
        </section>
    );
};

export default ThreatSection;
