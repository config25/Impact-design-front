import GNB from "../components/common/GNB";
import "./PerformanceStreamScreen.css";
import shinhanLogo from "../resource/flow/신한은행.png";
import component1 from "../resource/flow/Component 1.png";
import vector3 from "../resource/flow/Vector 3.png";
import pencil2 from "../resource/quick/pencil2.png";

const PerformanceStreamScreen = ({ onNavigate }) => {
    return (
        <div className="stream-container">
            {/* GNB */}
            <GNB activeScreen="performance" onNavigate={onNavigate} />

            {/* Sub Header */}
            <div className="sub-header">
                <div className="sub-header-title">2. Performance Flow Canvas</div>
                <div className="sub-header-actions">
                    <button className="tips-button">
                        <img src={pencil2} alt="" className="pencil-icon" />
                        <span className="tips-text">
                            <span className="tips-text-bold">작성 Tips</span>
                            <span className="tips-text-regular">를 확인해보세요!</span>
                        </span>
                    </button>
                    <button className="save-button">저장</button>
                    <button className="submit-button">제출완료</button>
                </div>
            </div>

            {/* Main Content Box */}
            <div className="main-content-box">
                {/* Header */}
                <header className="stream-header">
                    <div className="header-left">
                        <div className="step-badge-container">
                            <img src={component1} alt="" className="step-badge-img" />
                            <span className="step-badge-number">2</span>
                            <img src={vector3} alt="" className="step-badge-vector" />
                        </div>
                        <div className="header-text">
                            <h1>Performance Flow Canvas</h1>
                            <p className="header-desc">
                                비전은 선언만으로 달성되지 않습니다.
                            </p>
                            <p className="header-desc">
                                비전을 달성하기 위해서는 전략목표가 필요하고, 전략목표를 현실로 만들기 위해서는 전술적 성과와 전략적 활동이 함께 설계되어야 합니다.
                            </p>
                        </div>
                    </div>
                    <div className="logo-container">
                        <img src={shinhanLogo} alt="신한은행" />
                    </div>
                </header>

                {/* New Vision Banner */}
                <div className="vision-banner">
                    <span className="vision-label">New Vision</span>
                    <div className="vision-content">
                        <span className="vision-text">1단계에서 작성했던 New Vision이 자동으로 들어옴</span>
                    </div>
                </div>

                {/* Content */}
                <div className="stream-content">
                    {/* Row 1: Strategic Goal */}
                    <div className="stream-row">
                        <div className="row-label">
                            <div className="label-number">1. 3대 전략목표</div>
                            <div className="label-subtitle">(Strategic Goal)</div>
                        </div>
                        <div className="row-content">
                            <p className="row-desc">
                                <span className="underline">전략목표는 '무엇을 더 할 것인가'가 아니라 '어떤 방식의 성과를 만들겠다는 선택'이어야 합니다.</span>
                                <span className="example"> 예) 매출 확대 X, 고수익 구조로의 전환 O</span>
                            </p>
                            <div className="goal-cards">
                                <div className="goal-card filled">
                                    <div className="goal-card-title">고수익 고객 중심의 매출 구조로 전환</div>
                                    <div className="goal-card-content">
                                        수익성을 기준으로 고객을 구분하고,<br />
                                        고수익 고객에게 영업·자원·의사결정이 우선 배분되는<br />
                                        매출 운영 구조로 전환한다
                                    </div>
                                    <div className="card-expand">
                                        <span className="card-expand-arrow"></span>
                                    </div>
                                </div>
                                <div className="goal-card empty">
                                    <div className="goal-card-title">목표를 작성하세요.</div>
                                    <div className="goal-card-content">
                                        <span className="edit-icon">✎</span>
                                        <span className="placeholder">(존재 이유)</span>
                                    </div>
                                    <div className="card-expand">
                                        <span className="card-expand-arrow"></span>
                                    </div>
                                </div>
                                <div className="goal-card empty">
                                    <div className="goal-card-title">목표를 작성하세요.</div>
                                    <div className="goal-card-content">
                                        <span className="edit-icon">✎</span>
                                        <span className="placeholder">(존재 이유)</span>
                                    </div>
                                    <div className="card-expand">
                                        <span className="card-expand-arrow"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Tactical Performance */}
                    <div className="stream-row">
                        <div className="row-label">
                            <div className="label-number">2. 전술적 성과</div>
                            <div className="label-subtitle">(성과)</div>
                        </div>
                        <div className="row-content">
                            <p className="row-desc">
                                <span className="underline">전술적 성과지표는 전략목표를 향해 가고 있음을 단기적으로 확인할 수 있는 지표를 의미합니다.</span>
                                <span className="example"> 예) 영업 활동 강화 X, 고수익 고객 매출 비중 +8% O</span>
                            </p>
                            <div className="metric-tables">
                                <MetricTable
                                    headers={["전술적 성과 지표", "목표"]}
                                    rows={[
                                        { indicator: "1. 프리미엄 판매 비중", target: "8% 향상 (3개월)" },
                                        { indicator: "2.", target: "" },
                                        { indicator: "3.", target: "" },
                                    ]}
                                />
                                <MetricTable
                                    headers={["전술적 성과 지표", "목표"]}
                                    rows={[
                                        { indicator: "1. 프리미엄 판매 비중", target: "8% 향상 (3개월)" },
                                        { indicator: "2.", target: "" },
                                        { indicator: "3.", target: "" },
                                    ]}
                                />
                                <MetricTable
                                    headers={["전술적 성과 지표", "목표"]}
                                    rows={[
                                        { indicator: "1. 프리미엄 판매 비중", target: "8% 향상 (3개월)" },
                                        { indicator: "2.", target: "" },
                                        { indicator: "3.", target: "" },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Strategic Activity */}
                    <div className="stream-row">
                        <div className="row-label">
                            <div className="label-number">3. 전략적 활동</div>
                            <div className="label-subtitle">(체질)</div>
                        </div>
                        <div className="row-content">
                            <p className="row-desc">
                                <span className="underline">전략적 성과지표는 반복 가능한 구조와 체질로 자리 잡았는지를 확인하는 기준을 의미합니다.</span>
                                <span className="example"> 예) 3분기 연속 유지, 규범화 완료 등</span>
                            </p>
                            <div className="metric-tables">
                                <MetricTable
                                    headers={["전략적 활동 지표", "내재화 기준"]}
                                    rows={[
                                        { indicator: "1. 수익성 기준 기반 영업 체계", target: "3분기 연속 유지" },
                                        { indicator: "2.", target: "" },
                                        { indicator: "3.", target: "" },
                                    ]}
                                />
                                <MetricTable
                                    headers={["전략적 활동 지표", "내재화 기준"]}
                                    rows={[
                                        { indicator: "1. 수익성 기준 기반 영업 체계", target: "3분기 연속 유지" },
                                        { indicator: "2.", target: "" },
                                        { indicator: "3.", target: "" },
                                    ]}
                                />
                                <MetricTable
                                    headers={["전략적 활동 지표", "내재화 기준"]}
                                    rows={[
                                        { indicator: "1. 수익성 기준 기반 영업 체계", target: "3분기 연속 유지" },
                                        { indicator: "2.", target: "" },
                                        { indicator: "3.", target: "" },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricTable = ({ headers, rows }) => {
    return (
        <div className="metric-table-wrapper">
            <table className="metric-table">
                <thead>
                    <tr>
                        <th>{headers[0]}</th>
                        <th>{headers[1]}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                {row.indicator}
                                {!row.indicator.includes(".") || row.indicator.endsWith(".") ? (
                                    <span className="edit-icon">✎</span>
                                ) : null}
                            </td>
                            <td>
                                {row.target || <span className="edit-icon">✎</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="table-expand">
                <span className="table-expand-arrow"></span>
            </div>
        </div>
    );
};

export default PerformanceStreamScreen;
