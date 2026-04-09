const IdentityModal = ({ show, onClose, title, data, TeamSelectBar }) => {
    if (!show || !data) return null;

    return (
        <div className="td2-modal-overlay" onClick={onClose}>
            <div className="td2-identity-modal" onClick={e => e.stopPropagation()}>
                <div className="td2-impact-modal-header">
                    <span className="td2-impact-modal-title">{title}</span>
                    <button className="td2-modify-close" onClick={onClose}>&times;</button>
                </div>
                <TeamSelectBar />
                <div className="td2-identity-modal-body">
                    {/* 헤더 */}
                    <div className="td2-id-header">
                        <h2 className="td2-id-header-title">Strategic Identity Canvas</h2>
                        <p className="td2-id-header-desc">성과창출의 첫 걸음은, 무엇을 할 것인가가 아니라 달성하고자 하는 미래를 먼저 그리는 것입니다.
                        </p>
                        <p className="td2-id-header-desc">우리의 미래는 무엇입니까? 앞으로 우리가 도달해야 할 '새로운 미래'를 여러분의 언어로 제시해보십시오
                        </p>
                    </div>

                    {/* 3단 레이아웃 */}
                    <div className="td2-id-grid">
                        {/* 좌: 기존 가치체계 */}
                        <div className="td2-id-col">
                            <div className="td2-id-section-header td2-id-legacy">기존 가치체계 (Current Legacy)</div>
                            <div className="td2-id-legacy-content">
                                <div className="td2-id-card">
                                    <div className="td2-id-card-title">미션 (Mission)</div>
                                    <div className="td2-id-card-body">
                                        <span className="td2-id-card-value">{data.mission || ""}</span>
                                    </div>
                                </div>
                                <div className="td2-id-card">
                                    <div className="td2-id-card-title">비전 (Vision)</div>
                                    <div className="td2-id-card-body">
                                        <span className="td2-id-card-value">{data.vision || ""}</span>
                                    </div>
                                </div>
                                <div className="td2-id-card">
                                    <div className="td2-id-card-title">핵심가치 (Value)</div>
                                    <div className="td2-id-card-body">
                                        <span className="td2-id-card-value">{data.value || ""}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 중: 외부의 위협 신호 + 내부의 한계점 */}
                        <div className="td2-id-col-center">
                            {/* 외부의 위협 신호 */}
                            <div className="td2-id-threat-block">
                                <div className="td2-id-threat-header">
                                    <div className="td2-id-threat-header-title">외부의 위협 신호 (External Threats)</div>
                                    <div className="td2-id-threat-header-sub">"우리를 위협하는 외부의 경고는 무엇입니까?"</div>
                                </div>
                                <div className="td2-id-threat-body">
                                    <div className="td2-id-threat-grid">
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">정책/경제<br/>(Macro)</div>
                                            <div className="td2-id-mini-body">{data.macro || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">기술<br/>(Tech)</div>
                                            <div className="td2-id-mini-body">{data.tech || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">고객/사회<br/>(Customer)</div>
                                            <div className="td2-id-mini-body">{data.customer || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">경쟁<br/>(Competitor)</div>
                                            <div className="td2-id-mini-body">{data.competitor || ""}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 내부의 한계점 */}
                            <div className="td2-id-threat-block">
                                <div className="td2-id-threat-header">
                                    <div className="td2-id-threat-header-title">내부의 한계점 (Internal Limits)</div>
                                    <div className="td2-id-threat-header-sub">"앞으로의 성장을 위해 넘어서야 할 내부의 한계는 무엇입니까?"</div>
                                </div>
                                <div className="td2-id-threat-body">
                                    <div className="td2-id-threat-grid">
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">역량<br/>(Capability)</div>
                                            <div className="td2-id-mini-body">{data.capability || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">문화<br/>(Culture)</div>
                                            <div className="td2-id-mini-body">{data.culture || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">구조<br/>(Structure)</div>
                                            <div className="td2-id-mini-body">{data.structure || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">기타</div>
                                            <div className="td2-id-mini-body">{data.etc || ""}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 우: 미래 방향성 */}
                        <div className="td2-id-col">
                            <div className="td2-id-section-header td2-id-new">미래 방향성 (New Identity)</div>
                            <div className="td2-id-new-content">
                                <div className="td2-id-card">
                                    <div className="td2-id-card-title td2-id-card-title-bold">New 미션 (Mission)</div>
                                    <div className="td2-id-card-body">
                                        <span className="td2-id-card-value">{data.newMission || ""}</span>
                                    </div>
                                </div>
                                <div className="td2-id-card">
                                    <div className="td2-id-card-title td2-id-card-title-bold">New 비전 (Vision)</div>
                                    <div className="td2-id-card-body">
                                        <span className="td2-id-card-value">{data.newVision || ""}</span>
                                    </div>
                                </div>
                                <div className="td2-id-card">
                                    <div className="td2-id-card-title td2-id-card-title-bold">New 핵심가치 (Value)</div>
                                    <div className="td2-id-card-body">
                                        <span className="td2-id-card-value">{data.newValue || ""}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdentityModal;
