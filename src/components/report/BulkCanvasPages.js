import "../../components/identity/identity.css";
import "../../screens/PerformanceStreamScreen.css";
import "../../screens/WinCanvasScreen.css";
import "../../screens/QuickWinScreen.css";
import "../../screens/BuildWinScreen.css";
import { getImageUrl } from "../../utils/logoUtil";
import component1Identity from "../../resource/identity/Component 1.png";
import vector3Identity from "../../resource/identity/Vector 3.png";
import component1Flow from "../../resource/flow/Component 1.png";
import vector3Flow from "../../resource/flow/Vector 3.png";
import component1Quick from "../../resource/quick/Component 1.png";
import vector3Quick from "../../resource/quick/Vector 3.png";
import component1Build from "../../resource/build/Component 1.png";
import vector3Build from "../../resource/build/Vector 3.png";

const PageWrapper = ({ children }) => (
    <div className="report-page bulk-canvas-page" style={{ width: 1415, height: 820, overflow: 'hidden' }}>
        <div style={{ width: 1920, transform: `scale(${1415 / 1920})`, transformOrigin: 'top left' }}>
            {children}
        </div>
    </div>
);

const StepBadge = ({ img, vector, number }) => (
    <div style={{ position: 'relative', width: 79, height: 130, marginLeft: -30, marginTop: -24, flexShrink: 0 }}>
        <img src={img} alt="" style={{ width: 79, height: 116, display: 'block' }} />
        <span style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', fontFamily: 'Pretendard', fontWeight: 200, fontSize: 53, color: '#fff' }}>{number}</span>
        <img src={vector} alt="" style={{ width: 79, height: 25, display: 'block', transform: 'rotate(180deg)', marginTop: 8 }} />
    </div>
);

/* ── Identity Canvas ── */
const LogoImg = ({ logoUrl }) => logoUrl ? (
    <div style={{ width: 240, height: 80, borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', flexShrink: 0, marginTop: 20 }}>
        <img src={logoUrl} alt="logo" style={{ maxWidth: 400, maxHeight: 105, objectFit: 'contain' }} />
    </div>
) : null;

const IdentityCanvasPage = ({ data, logoUrl }) => {
    if (!data) data = {};
    return (
        <PageWrapper>
            <div style={{ padding: '24px 16px', background: '#fff', minHeight: 1080 }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, padding: '0 26px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 }}>
                        <StepBadge img={component1Identity} vector={vector3Identity} number="1" />
                        <div style={{ marginLeft: 30 }}>
                            <h1 style={{ margin: '0 0 16px', fontSize: 40, fontWeight: 700, color: '#353B72', fontFamily: 'Pretendard' }}>Strategic Identity Canvas</h1>
                            <p style={{ fontSize: 21, color: '#555', margin: '8px 0', fontFamily: 'Pretendard' }}>성과창출의 첫 걸음은, 무엇을 할 것인가가 아니라 달성하고자 하는 미래를 먼저 그리는 것입니다.</p>
                            <p style={{ fontSize: 21, color: '#555', margin: '8px 0', fontFamily: 'Pretendard' }}>우리의 미래는 무엇입니까? 앞으로 우리가 도달해야 할 '새로운 미래'를 여러분의 언어로 제시해보십시오</p>
                        </div>
                    </div>
                    <LogoImg logoUrl={logoUrl} />
                </header>
                <div className="identity-grid" style={{ padding: '0 40px' }}>
                    <section className="legacy-section">
                        <div className="legacy-header">기존 가치체계 (Current Legacy)</div>
                        <div className="legacy-content">
                            {[{ title: "미션(Mission)", sub: "(존재 이유)", value: data.mission }, { title: "비전 (Vision)", sub: "(지향하는 미래)", value: data.vision }, { title: "핵심가치 (Value)", sub: "(행동 원칙)", value: data.value }].map((item, i) => (
                                <div className="legacy-item" key={i}>
                                    <div className="legacy-item-title">{item.title}</div>
                                    <div className="legacy-item-body">{item.value ? <div className="input-value" style={{ cursor: 'default' }}>{item.value}</div> : <span className="legacy-item-subtitle">{item.sub}</span>}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="identity-section threat-section">
                        <div className="threat-header"><div className="threat-header-title">외부의 위협 신호 (External Threats)</div><div className="threat-header-subtitle">"우리를 위협하는 외부의 경고는 무엇입니까?"</div></div>
                        <div className="threat-body"><div className="threat-grid">
                            {[{ title: "정책/경제 (Macro)", value: data.macro }, { title: "기술 (Tech)", value: data.tech }, { title: "고객/사회 (Customer)", value: data.customer }, { title: "경쟁 (Competitor)", value: data.competitor }].map((c, i) => (
                                <div className="threat-card" key={i}><div className="threat-card-title">{c.title}</div><div className="threat-card-content">{c.value && <div className="input-value" style={{ cursor: 'default' }}>{c.value}</div>}</div></div>
                            ))}
                        </div></div>
                        <div className="internal-header"><div className="internal-header-title">내부의 한계점 (Internal Limits)</div><div className="internal-header-subtitle">"앞으로의 성장을 위해 넘어서야 할 내부의 한계는 무엇입니까?"</div></div>
                        <div className="internal-body"><div className="internal-grid">
                            {[{ title: "역량 (Capability)", value: data.capability }, { title: "문화(Culture)", value: data.culture }, { title: "구조(Structure)", value: data.structure }, { title: "기타", value: data.etc }].map((c, i) => (
                                <div className="internal-card" key={i}><div className="internal-card-title">{c.title}</div><div className="internal-card-content">{c.value && <div className="input-value" style={{ cursor: 'default' }}>{c.value}</div>}</div></div>
                            ))}
                        </div></div>
                    </section>
                    <section className="new-identity-section">
                        <div className="new-identity-header">미래 방향성 (New Identity)</div>
                        <div className="new-identity-content">
                            {[{ title: "New 미션(Mission)", sub: "(재정의된 존재 이유)", value: data.newMission }, { title: "New 비전(Vision)", sub: "(새롭게 그리는 미래)", value: data.newVision }, { title: "New 핵심가치(Value)", sub: "(새로운 행동/판단기준)", value: data.newValue }].map((item, i) => (
                                <div className="new-identity-item" key={i}>
                                    <div className="new-item-title">{item.title}</div>
                                    <div className="new-item-body">{item.value ? <div className="input-value" style={{ cursor: 'default' }}>{item.value}</div> : <span className="new-item-subtitle">{item.sub}</span>}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </PageWrapper>
    );
};

/* ── Flow Canvas ── */
const FlowCanvasPage = ({ data, logoUrl }) => {
    if (!data) data = {};
    const rawGoals = data.goals || [];
    const goals = [...rawGoals, ...Array(Math.max(0, 3 - rawGoals.length)).fill(null)].slice(0, 3);
    return (
        <PageWrapper>
            <div style={{ background: '#fff', minHeight: 1320 }}>
                <div style={{ padding: '24px 15px' }}>
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, padding: '0 26px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                            <StepBadge img={component1Flow} vector={vector3Flow} number="2" />
                            <div style={{ paddingTop: 3 }}>
                                <h1 style={{ margin: '0 0 21px', fontSize: 40, fontWeight: 700, color: '#3D49BE', fontFamily: 'Pretendard' }}>Performance Flow Canvas</h1>
                                <p style={{ fontSize: 21, color: '#222', margin: '0 0 12px', fontFamily: 'Pretendard' }}>비전은 선언만으로 달성되지 않습니다.</p>
                                <p style={{ fontSize: 21, color: '#222', margin: '0 0 12px', fontFamily: 'Pretendard' }}>비전을 달성하기 위해서는 전략목표가 필요하고, 전략목표를 현실로 만들기 위해서는 전술적 성과와 전략적 활동이 함께 설계되어야 합니다.</p>
                            </div>
                        </div>
                        <LogoImg logoUrl={logoUrl} />
                    </header>
                    <div className="vision-banner" style={{ width: 'calc(100% - 86px)', marginLeft: 35 }}>
                        <span className="vision-label">New Vision</span>
                        <div className="vision-content"><span className="vision-text">{data.newVision || ""}</span></div>
                    </div>
                    <div className="stream-content">
                        {/* 전략목표 */}
                        <div className="stream-row">
                            <div className="row-label"><div className="label-number">1. 3대 전략목표</div><div className="label-subtitle">(Strategic Goal)</div></div>
                            <div className="row-content">
                                <p className="row-desc"><span className="underline">전략목표는 '무엇을 더 할 것인가'가 아니라 '어떤 방식의 성과를 만들겠다는 선택'이어야 합니다.</span><span className="example"> 예) 매출 확대 X, 고수익 구조로의 전환 O</span></p>
                                <div className="goal-cards">
                                    {goals.map((g, i) => (
                                        <div key={i} className={`goal-card ${g?.goalTitle ? 'filled' : 'empty'}`}>
                                            <div className={`goal-card-title ${g?.goalTitle ? 'has-content' : ''}`}>{g?.goalTitle || ""}</div>
                                            <div className="goal-card-content">{g?.goalDescription ? <span className="content-text">{g.goalDescription}</span> : null}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* 전술적 성과 */}
                        <div className="stream-row">
                            <div className="row-label"><div className="label-number">2. 전술적 성과</div><div className="label-subtitle">(성과)</div></div>
                            <div className="row-content">
                                <p className="row-desc"><span className="underline">전술적 성과지표는 전략목표를 향해 가고 있음을 단기적으로 확인할 수 있는 지표를 의미합니다.</span><span className="example"> 예) 영업 활동 강화 X, 고수익 고객 매출 비중 +8% O</span></p>
                                <div className="metric-tables">
                                    {goals.map((g, ti) => (
                                        <div className="metric-table-wrapper" key={ti}>
                                            <table className="metric-table"><thead><tr><th>전술적 성과 지표</th><th>목표</th></tr></thead>
                                                <tbody>
                                                    {(g?.tacticals && g.tacticals.length > 0 ? g.tacticals : [{}, {}, {}]).slice(0, 3).map((t, ri) => (
                                                        <tr key={ri}><td><span className="row-number">{ri + 1}.</span> <span className="metric-value">{t.tacticalMetric || ""}</span></td><td><span className="metric-value">{t.tacticalGoal || ""}</span></td></tr>
                                                    ))}
                                                    {(g?.tacticals?.length || 0) > 0 && g.tacticals.length < 3 && Array.from({ length: 3 - g.tacticals.length }, (_, ri) => (
                                                        <tr key={`e-${ri}`}><td className="empty-row"><span className="row-number">{g.tacticals.length + ri + 1}.</span></td><td className="empty-row"></td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* 전략적 활동 */}
                        <div className="stream-row">
                            <div className="row-label"><div className="label-number">3. 전략적 활동</div><div className="label-subtitle">(체질)</div></div>
                            <div className="row-content">
                                <p className="row-desc"><span className="underline">전략적 성과지표는 반복 가능한 구조와 체질로 자리 잡았는지를 확인하는 기준을 의미합니다.</span><span className="example"> 예) 3분기 연속 유지, 규범화 완료 등</span></p>
                                <div className="metric-tables">
                                    {goals.map((g, ti) => (
                                        <div className="metric-table-wrapper" key={ti}>
                                            <table className="metric-table"><thead><tr><th>전략적 활동 지표</th><th>내재화 기준</th></tr></thead>
                                                <tbody>
                                                    {(g?.strategicActivities && g.strategicActivities.length > 0 ? g.strategicActivities : [{}, {}, {}]).slice(0, 3).map((a, ri) => (
                                                        <tr key={ri}><td><span className="row-number">{ri + 1}.</span> <span className="metric-value">{a.activityMetric || ""}</span></td><td><span className="metric-value">{a.interCriteria || ""}</span></td></tr>
                                                    ))}
                                                    {(g?.strategicActivities?.length || 0) > 0 && g.strategicActivities.length < 3 && Array.from({ length: 3 - g.strategicActivities.length }, (_, ri) => (
                                                        <tr key={`e-${ri}`}><td className="empty-row"><span className="row-number">{g.strategicActivities.length + ri + 1}.</span></td><td className="empty-row"></td></tr>
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
        </PageWrapper>
    );
};

/* ── Win Canvas (Quick / Build 공통) ── */
const WinCanvasPage = ({ data, type, logoUrl }) => {
    if (!data) data = {};
    const isQuick = type === "quick";
    const containerClass = isQuick ? "quickwin-container" : "buildwin-container";
    const badgeImg = isQuick ? component1Quick : component1Build;
    const badgeVec = isQuick ? vector3Quick : vector3Build;
    const stepNum = isQuick ? "3" : "4";
    const title = isQuick ? "Quick Win Canvas" : "Build Win Canvas";
    const titleSub = isQuick ? "(전술적 실행과제)" : "(전략적 실행과제)";
    const colorClass = isQuick ? "cyan" : "purple";
    const labelPrefix = isQuick ? "전술적" : "전략적";
    const headerDescs = isQuick
        ? ["Quick Win은 전략목표 달성을 가로막는 장애물을 빠르게 제거하여 단기적으로 가시적인 성과를 만들어내는 실행과제입니다.", "이 Quick Win이 실행되지 않으면, 우리는 지금 만들 수 있는 성과를 계속 '놓치게' 됩니다."]
        : ["Build Win은 단기 성과를 만드는 과제가 아니라, 성과가 반복되게 만드는 '체질'을 바꾸는 과제입니다.", "이 Build Win이 성공하면, 우리는 한 차원 높은 성과창출 역량을 확보하게 됩니다."];
    const signalHeader = isQuick ? "위기의 신호 (Crisis Signal)" : "변화의 신호(Trigger)";
    const procedureHeader = isQuick ? "추진 절차" : "전환 단계";
    const contentHeader = isQuick ? "주요 내용" : "전환 활동";

    const inputs = data.taskInputs || [];
    const activities = data.taskActivities || [];
    const qualitative = (data.taskOutcomes || []).filter(o => o.outcomeType === "QUALITATIVE").sort((a, b) => a.orderNo - b.orderNo);
    const quantitative = (data.taskOutcomes || []).filter(o => o.outcomeType === "QUANTITATIVE").sort((a, b) => a.orderNo - b.orderNo);

    const renderDataCells = (rowIdx) => (
        <>
            <td className="input-cell"><span>{inputs[rowIdx]?.resourceName || ""}</span></td>
            <td className="input-cell"><span>{inputs[rowIdx]?.quantity != null ? inputs[rowIdx].quantity : ""}</span></td>
            <td className="input-cell"><span>{activities[rowIdx]?.processStep || ""}</span></td>
            <td className="input-cell"><span>{activities[rowIdx]?.activityContent || ""}</span></td>
            <td className="input-cell"><span>{activities[rowIdx]?.duration || ""}</span></td>
        </>
    );

    return (
        <PageWrapper>
            <div className={`win-canvas ${containerClass}`} style={{ width: 1920, minHeight: 1320 }}>
                <div className="main-content-box" style={{ width: '100%', padding: '24px 15px' }}>
                    <header className="win-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, padding: '0 26px' }}>
                        <div className="header-left">
                            <StepBadge img={badgeImg} vector={badgeVec} number={stepNum} />
                            <div className="header-text">
                                <h1>{title} <span className="title-sub">{titleSub}</span></h1>
                                {headerDescs.map((d, i) => <p key={i} className="header-desc">{d}</p>)}
                            </div>
                        </div>
                        <LogoImg logoUrl={logoUrl} />
                    </header>
                    <div className="win-content" style={{ padding: '20px 51px' }}>
                        <div className="alignment-section">
                            <div className={`section-label ${colorClass}`}>전략목표 Alignment</div>
                            <div className="section-content"><span>{data.strategicGoal || ""}</span></div>
                        </div>
                        <div className="task-section">
                            <div className="task-rows">
                                <div className="task-row">
                                    <div className={`section-label ${colorClass} small`}><span>{labelPrefix}</span><span>실행과제</span></div>
                                    <div className="task-label">과제명</div>
                                    <div className={`task-content highlight ${data.taskName ? 'has-content' : ''}`}><span>{data.taskName || ""}</span></div>
                                </div>
                                <div className="task-row">
                                    <div className={`section-label ${colorClass} small invisible`}><span>{labelPrefix}</span><span>실행과제</span></div>
                                    <div className="task-label main-content-label">주요 내용</div>
                                    <div className="task-content main-content"><span>{data.taskDescription || ""}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="main-table">
                            <table>
                                <thead>
                                    <tr className="header-row">
                                        <th className="situation">상황(Situation)</th>
                                        <th colSpan="2" className="input">투입(Input)</th>
                                        <th colSpan="4" className="activity">활동(Activity)</th>
                                        <th colSpan="2" className="outputs">산출(Outputs)</th>
                                    </tr>
                                    <tr className="subheader-row">
                                        <th className="crisis-header">{signalHeader}</th>
                                        <th className="resource-header">필요 자원</th>
                                        <th className="quantity-header">수량</th>
                                        <th className="procedure-header">{procedureHeader}</th>
                                        <th className="content-header">{contentHeader}</th>
                                        <th className="duration-header">소요기간</th>
                                        <th className="teamwork-header">팀 워크</th>
                                        <th className="teamwork-header2">팀 워크</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td rowSpan="2" className="crisis-cell"><div className="cell-content">{data.crisisSignal || ""}</div></td>
                                        {renderDataCells(0)}
                                        <td rowSpan="5" className="teamwork-cell"><div className="cell-content">{data.teamwork?.activityTeamwork || ""}</div></td>
                                        <td rowSpan="5" className="output-cell"><div className="cell-content">{data.teamwork?.workType || ""}</div></td>
                                    </tr>
                                    <tr>{renderDataCells(1)}</tr>
                                    <tr><td className="pain-header-cell">Pain/Touch point</td>{renderDataCells(2)}</tr>
                                    <tr><td rowSpan="2" className="pain-cell"><div className="cell-content">{data.painTouchPoint || ""}</div></td>{renderDataCells(3)}</tr>
                                    <tr>{renderDataCells(4)}</tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="outcomes-section">
                            <div className="outcomes-header">성과(Outcomes)</div>
                            <div className="outcomes-content">
                                <div className="outcomes-row outcomes-title-row">
                                    <div className="outcomes-cell outcomes-title-cell left">정성적 효과(체감되는 변화)</div>
                                    <div className="outcomes-cell outcomes-title-cell right">정량적 효과(측정가능한 변화)</div>
                                </div>
                                {[0, 1, 2].map(idx => (
                                    <div key={idx} className="outcomes-row">
                                        <div className={`outcomes-cell left ${idx === 2 ? 'last' : ''}`}><span className="item-number">{idx + 1}.</span><span>{qualitative[idx]?.outcomeContent || ""}</span></div>
                                        <div className={`outcomes-cell right ${idx === 2 ? 'last' : ''}`}><span className="item-number">{idx + 1}.</span><span>{quantitative[idx]?.outcomeContent || ""}</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

/* ── 전체 팀 캔버스 페이지 모음 ──
 * canvasType 미지정: 팀별로 4종 캔버스 모두 렌더 (기본)
 * canvasType 지정 ("identity" | "flow" | "quick" | "build"): 해당 캔버스 1종만 팀 순서대로 렌더
 */
const BulkCanvasPages = ({ canvasData, canvasType }) => {
    if (!canvasData || canvasData.length === 0) return null;
    return (
        <>
            {canvasData.map((team) => {
                const logoUrl = team.imageUrl ? getImageUrl(team.imageUrl) : null;
                return (
                    <div key={team.teamId}>
                        {(!canvasType || canvasType === "identity") && <IdentityCanvasPage data={team.identityCanvas} logoUrl={logoUrl} />}
                        {(!canvasType || canvasType === "flow") && <FlowCanvasPage data={team.flowCanvas} logoUrl={logoUrl} />}
                        {(!canvasType || canvasType === "quick") && <WinCanvasPage data={team.quickWinCanvas} type="quick" logoUrl={logoUrl} />}
                        {(!canvasType || canvasType === "build") && <WinCanvasPage data={team.buildWinCanvas} type="build" logoUrl={logoUrl} />}
                    </div>
                );
            })}
        </>
    );
};

export default BulkCanvasPages;
