import { ClickableTd } from "./ClickablePopover";

const FlowModal = ({ show, onClose, title, data, TeamSelectBar }) => {
    if (!show || !data) return null;

    return (
        <div className="td2-modal-overlay" onClick={onClose}>
            <div className="td2-flow-modal" onClick={e => e.stopPropagation()}>
                <div className="td2-impact-modal-header">
                    <span className="td2-impact-modal-title">{title}</span>
                    <button className="td2-modify-close" onClick={onClose}>&times;</button>
                </div>
                <TeamSelectBar />
                <div className="td2-flow-modal-body">
                    {/* 헤더 */}
                    <div className="td2-flow-header">
                        <h2 className="td2-flow-header-title">Performance Flow Canvas</h2>
                        <p className="td2-flow-header-desc">비전은 선언만으로 달성되지 않습니다.</p>
                        <p className="td2-flow-header-desc">비전을 달성하기 위해서는 전략목표가 필요하고, 전략목표를 현실로 만들기 위해서는 전술적 성과와 전략적 활동이 함께 설계되어야 합니다.</p>
                    </div>

                    {/* New Vision 배너 */}
                    <div className="td2-flow-vision">
                        <span className="td2-flow-vision-label">New Vision</span>
                        <span className="td2-flow-vision-text">{data.newVision || ""}</span>
                    </div>

                    {/* 콘텐츠 */}
                    <div className="td2-flow-content">
                        {/* Row 1: 전략목표 */}
                        <div className="td2-flow-row">
                            <div className="td2-flow-row-label">
                                <div className="td2-flow-label-number">1. 3대 전략목표</div>
                                <div className="td2-flow-label-sub">(Strategic Goal)</div>
                            </div>
                            <div className="td2-flow-row-content">
                                <p className="td2-flow-row-desc">
                                    <span className="td2-flow-desc-main">전략목표는 '무엇을 더 할 것인가'가 아니라 '어떤 방식의 성과를 만들겠다는 선택'이어야 합니다.</span>
                                    <span className="td2-flow-desc-example"> 예) 매출 확대 X, 고수익 구조로의 전환 O</span>
                                </p>
                                <div className="td2-flow-goal-cards">
                                    {(data.goals || []).map((goal, idx) => (
                                        <div className="td2-flow-goal-card" key={goal.goalId || idx}>
                                            <div className={`td2-flow-goal-title ${goal.goalTitle ? "has-content" : ""}`}>
                                                {goal.goalTitle || `전략목표 ${idx + 1}`}
                                            </div>
                                            <div className="td2-flow-goal-desc">{goal.goalDescription || ""}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Row 2: 전술적 성과 */}
                        <div className="td2-flow-row">
                            <div className="td2-flow-row-label">
                                <div className="td2-flow-label-number">2. 전술적 성과</div>
                                <div className="td2-flow-label-sub">(성과)</div>
                            </div>
                            <div className="td2-flow-row-content">
                                <p className="td2-flow-row-desc">
                                    <span className="td2-flow-desc-main">전술적 성과지표는 전략목표를 향해 가고 있음을 단기적으로 확인할 수 있는 지표를 의미합니다.</span>
                                    <span className="td2-flow-desc-example"> 예) 영업 활동 강화 X, 고수익 고객 매출 비중 +8% O</span>
                                </p>
                                <div className="td2-flow-tables">
                                    {(data.goals || []).map((goal, idx) => (
                                        <div className="td2-flow-table-wrapper" key={`t-${goal.goalId || idx}`}>
                                            <table className="td2-flow-table">
                                                <thead>
                                                    <tr>
                                                        <th>전술적 성과 지표</th>
                                                        <th>목표</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(goal.tacticals || []).length === 0 ? (
                                                        <tr><td colSpan="2" className="td2-flow-empty">-</td></tr>
                                                    ) : (goal.tacticals || []).map((t, ti) => (
                                                        <tr key={t.metricId || ti}>
                                                            <ClickableTd><span className="td2-flow-row-num">{ti + 1}.</span> {t.tacticalMetric || ""}</ClickableTd>
                                                            <ClickableTd>{t.tacticalGoal || ""}</ClickableTd>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Row 3: 전략적 활동 */}
                        <div className="td2-flow-row">
                            <div className="td2-flow-row-label">
                                <div className="td2-flow-label-number">3. 전략적 활동</div>
                                <div className="td2-flow-label-sub">(체질)</div>
                            </div>
                            <div className="td2-flow-row-content">
                                <p className="td2-flow-row-desc">
                                    <span className="td2-flow-desc-main">전략적 성과지표는 반복 가능한 구조와 체질로 자리 잡았는지를 확인하는 기준을 의미합니다.</span>
                                    <span className="td2-flow-desc-example"> 예) 3분기 연속 유지, 규범화 완료 등</span>
                                </p>
                                <div className="td2-flow-tables">
                                    {(data.goals || []).map((goal, idx) => (
                                        <div className="td2-flow-table-wrapper" key={`s-${goal.goalId || idx}`}>
                                            <table className="td2-flow-table">
                                                <thead>
                                                    <tr>
                                                        <th>전략적 활동 지표</th>
                                                        <th>내재화 기준</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(goal.strategicActivities || []).length === 0 ? (
                                                        <tr><td colSpan="2" className="td2-flow-empty">-</td></tr>
                                                    ) : (goal.strategicActivities || []).map((a, ai) => (
                                                        <tr key={a.activityId || ai}>
                                                            <ClickableTd><span className="td2-flow-row-num">{ai + 1}.</span> {a.activityMetric || ""}</ClickableTd>
                                                            <ClickableTd>{a.interCriteria || ""}</ClickableTd>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlowModal;
