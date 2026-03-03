import { useState, useEffect, useContext } from "react";
import { DashboardContext } from "../contexts/DashboardContext";
import GNB from "../components/common/GNB";
import TipsModal from "../components/common/TipsModal";
import "./PerformanceStreamScreen.css";
import component1 from "../resource/flow/Component 1.png";
import { getImageUrl } from "../utils/logoUtil";
import vector3 from "../resource/flow/Vector 3.png";
import pencil2 from "../resource/quick/pencil2.png";
import pencilIcon from "../resource/identity/pencil.png";
import { getFlowCanvas, saveFlowCanvas, submitFlowCanvas } from "../services/flowCanvasService";

const PerformanceStreamScreen = ({ onNavigate, gameStep }) => {
    const { dashboard } = useContext(DashboardContext);
    // Goal cards state
    const [goalCards, setGoalCards] = useState([
        { goalId: null, title: "", content: "" },
        { goalId: null, title: "", content: "" },
        { goalId: null, title: "", content: "" }
    ]);
    const [newVision, setNewVision] = useState("");
    const [editingGoal, setEditingGoal] = useState(null); // { index, field: 'title' | 'content' }

    const handleGoalEdit = (index, field) => {
        setEditingGoal({ index, field });
    };

    const handleGoalChange = (index, field, value) => {
        setGoalCards(prev => {
            const newCards = [...prev];
            newCards[index] = { ...newCards[index], [field]: value };
            return newCards;
        });
    };

    const handleGoalBlur = () => {
        setEditingGoal(null);
    };

    const handleGoalKeyDown = (e) => {
        if (e.key === "Escape") {
            setEditingGoal(null);
        }
    };

    const isGoalFilled = (card) => {
        return card.title.trim() !== "" || card.content.trim() !== "";
    };

    // Tactical Performance tables state (3 tables x 3 rows)
    const [tacticalTables, setTacticalTables] = useState([
        [{ metricId: null, indicator: "", target: "" }, { metricId: null, indicator: "", target: "" }, { metricId: null, indicator: "", target: "" }],
        [{ metricId: null, indicator: "", target: "" }, { metricId: null, indicator: "", target: "" }, { metricId: null, indicator: "", target: "" }],
        [{ metricId: null, indicator: "", target: "" }, { metricId: null, indicator: "", target: "" }, { metricId: null, indicator: "", target: "" }]
    ]);

    // Strategic Activity tables state (3 tables x 3 rows)
    const [strategicTables, setStrategicTables] = useState([
        [{ activityId: null, indicator: "", target: "" }, { activityId: null, indicator: "", target: "" }, { activityId: null, indicator: "", target: "" }],
        [{ activityId: null, indicator: "", target: "" }, { activityId: null, indicator: "", target: "" }, { activityId: null, indicator: "", target: "" }],
        [{ activityId: null, indicator: "", target: "" }, { activityId: null, indicator: "", target: "" }, { activityId: null, indicator: "", target: "" }]
    ]);

    const [editingMetric, setEditingMetric] = useState(null); // { type, tableIndex, rowIndex, field }

    // Submit state
    const [submitted, setSubmitted] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getFlowCanvas();
            if (result.success && result.data) {
                if (!dashboard?.classImage && result.data.imageUrl) setLogoUrl(getImageUrl(result.data.imageUrl));
                if (result.data.newVision) {
                    setNewVision(result.data.newVision);
                }
                const goals = result.data.goals || [];
                if (!goals.length) return;

                setGoalCards(goals.map((g) => ({
                    goalId: g.goalId || null,
                    title: g.goalTitle || "",
                    content: g.goalDescription || "",
                })));

                setTacticalTables(goals.map((g) =>
                    (g.tacticals || []).map((t) => ({
                        metricId: t.metricId || null,
                        indicator: t.tacticalMetric || "",
                        target: t.tacticalGoal || "",
                    }))
                ));

                setStrategicTables(goals.map((g) =>
                    (g.strategicActivities || []).map((a) => ({
                        activityId: a.activityId || null,
                        indicator: a.activityMetric || "",
                        target: a.interCriteria || "",
                    }))
                ));

                setSubmitted(result.data.submitted || false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        const result = await saveFlowCanvas(goalCards, tacticalTables, strategicTables);
        if (result.success) {
            // 저장 후 응답의 ID를 반영하여 다음 저장 시 update 되도록 함
            if (result.data?.goals?.length) {
                const goals = result.data.goals;
                setGoalCards(goals.map((g) => ({
                    goalId: g.goalId || null,
                    title: g.goalTitle || "",
                    content: g.goalDescription || "",
                })));
                setTacticalTables(goals.map((g) =>
                    (g.tacticals || []).map((t) => ({
                        metricId: t.metricId || null,
                        indicator: t.tacticalMetric || "",
                        target: t.tacticalGoal || "",
                    }))
                ));
                setStrategicTables(goals.map((g) =>
                    (g.strategicActivities || []).map((a) => ({
                        activityId: a.activityId || null,
                        indicator: a.activityMetric || "",
                        target: a.interCriteria || "",
                    }))
                ));
            }
            alert("저장되었습니다.");
        } else {
            alert(result.message);
        }
    };

    const handleSubmit = async () => {
        if (submitted) return;
        if (!window.confirm("제출완료 후에는 수정이 불가능합니다. 제출하시겠습니까?")) return;
        const result = await submitFlowCanvas(goalCards, tacticalTables, strategicTables);
        if (result.success) {
            if (result.data?.goals?.length) {
                const goals = result.data.goals;
                setGoalCards(goals.map((g) => ({
                    goalId: g.goalId || null,
                    title: g.goalTitle || "",
                    content: g.goalDescription || "",
                })));
                setTacticalTables(goals.map((g) =>
                    (g.tacticals || []).map((t) => ({
                        metricId: t.metricId || null,
                        indicator: t.tacticalMetric || "",
                        target: t.tacticalGoal || "",
                    }))
                ));
                setStrategicTables(goals.map((g) =>
                    (g.strategicActivities || []).map((a) => ({
                        activityId: a.activityId || null,
                        indicator: a.activityMetric || "",
                        target: a.interCriteria || "",
                    }))
                ));
            }
            setSubmitted(true);
            alert("제출이 완료되었습니다.");
        } else {
            alert(result.message);
        }
    };

    const handleMetricEdit = (type, tableIndex, rowIndex, field) => {
        setEditingMetric({ type, tableIndex, rowIndex, field });
    };

    const handleMetricChange = (type, tableIndex, rowIndex, field, value) => {
        if (type === 'tactical') {
            setTacticalTables(prev => {
                const newTables = prev.map(table => table.map(row => ({ ...row })));
                newTables[tableIndex][rowIndex][field] = value;
                return newTables;
            });
        } else {
            setStrategicTables(prev => {
                const newTables = prev.map(table => table.map(row => ({ ...row })));
                newTables[tableIndex][rowIndex][field] = value;
                return newTables;
            });
        }
    };

    const handleMetricBlur = () => {
        setEditingMetric(null);
    };

    const handleMetricKeyDown = (e) => {
        if (e.key === "Escape") {
            setEditingMetric(null);
        }
    };

    return (
        <div className="stream-container">
            {/* GNB */}
            <GNB activeScreen="performance" onNavigate={onNavigate} gameStep={gameStep} />

            {/* Sub Header */}
            <div className="sub-header">
                <div className="sub-header-title">2. Performance Flow Canvas</div>
                <div className="sub-header-actions">
                    <button className="tips-button" onClick={() => setShowTips(true)}>
                        <img src={pencil2} alt="" className="pencil-icon" />
                        <span className="tips-text">
                            <span className="tips-text-bold">작성 Tips</span>
                            <span className="tips-text-regular">를 확인해보세요!</span>
                        </span>
                    </button>
                    <button className="save-button" onClick={handleSave} disabled={submitted}>저장</button>
                    <button className="submit-button" onClick={handleSubmit} disabled={submitted}>{submitted ? "제출됨" : "제출완료"}</button>
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
                    {(dashboard?.classImage || logoUrl) && (
                        <div className="logo-wrapper">
                            <img src={dashboard?.classImage ? getImageUrl(dashboard.classImage) : logoUrl} alt="logo" className="logo-img" />
                        </div>
                    )}
                </header>

                {/* New Vision Banner */}
                <div className="vision-banner">
                    <span className="vision-label">New Vision</span>
                    <div className="vision-content">
                        <span className="vision-text">{newVision || "1단계에서 작성했던 New Vision이 자동으로 들어옵니다."}</span>
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
                                {goalCards.map((card, index) => (
                                    <div key={index} className={`goal-card ${isGoalFilled(card) ? 'filled' : 'empty'}`}>
                                        <div
                                            className={`goal-card-title ${card.title.trim() ? 'has-content' : ''}`}
                                            onClick={() => !editingGoal && handleGoalEdit(index, 'title')}
                                        >
                                            {editingGoal?.index === index && editingGoal?.field === 'title' ? (
                                                <input
                                                    type="text"
                                                    className="goal-title-input"
                                                    value={card.title}
                                                    onChange={(e) => handleGoalChange(index, 'title', e.target.value)}
                                                    onBlur={handleGoalBlur}
                                                    onKeyDown={handleGoalKeyDown}
                                                    autoFocus
                                                    placeholder="목표를 작성하세요."
                                                />
                                            ) : (
                                                card.title || "목표를 작성하세요."
                                            )}
                                        </div>
                                        <div
                                            className="goal-card-content"
                                            onClick={() => !editingGoal && handleGoalEdit(index, 'content')}
                                        >
                                            {editingGoal?.index === index && editingGoal?.field === 'content' ? (
                                                <textarea
                                                    className="goal-content-input"
                                                    value={card.content}
                                                    onChange={(e) => handleGoalChange(index, 'content', e.target.value)}
                                                    onBlur={handleGoalBlur}
                                                    onKeyDown={handleGoalKeyDown}
                                                    autoFocus
                                                    placeholder="내용을 입력하세요"
                                                />
                                            ) : card.content ? (
                                                <span className="content-text">{card.content}</span>
                                            ) : (
                                                <>
                                                    <img src={pencilIcon} alt="" className="edit-icon" />
                                                    <span className="placeholder">(존재 이유)</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="card-expand">
                                            <span className="card-expand-arrow"></span>
                                        </div>
                                    </div>
                                ))}
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
                                <span className="example">  예) 영업 활동 강화 X, 고수익 고객 매출 비중 +8% O</span>
                            </p>
                            <div className="metric-tables">
                                {tacticalTables.map((tableRows, tableIndex) => (
                                    <MetricTable
                                        key={tableIndex}
                                        headers={["전술적 성과 지표", "목표"]}
                                        rows={tableRows}
                                        tableIndex={tableIndex}
                                        type="tactical"
                                        pencilIcon={pencilIcon}
                                        editingMetric={editingMetric}
                                        onEdit={handleMetricEdit}
                                        onChange={handleMetricChange}
                                        onBlur={handleMetricBlur}
                                        onKeyDown={handleMetricKeyDown}
                                    />
                                ))}
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
                                {strategicTables.map((tableRows, tableIndex) => (
                                    <MetricTable
                                        key={tableIndex}
                                        headers={["전략적 활동 지표", "내재화 기준"]}
                                        rows={tableRows}
                                        tableIndex={tableIndex}
                                        type="strategic"
                                        pencilIcon={pencilIcon}
                                        editingMetric={editingMetric}
                                        onEdit={handleMetricEdit}
                                        onChange={handleMetricChange}
                                        onBlur={handleMetricBlur}
                                        onKeyDown={handleMetricKeyDown}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TipsModal
                show={showTips}
                onClose={() => setShowTips(false)}
                title="성과경로 설계"
                concept={`Performance Flow Canvas는 비전을 달성하기 위한 전략목표(Strategic Goal)와 실행 경로를 설계하는 도구입니다.\n\n비전은 선언만으로 달성되지 않습니다. 전략목표를 설정하고, 이를 현실로 만들기 위한 전술적 성과지표와 전략적 활동지표를 함께 설계해야 합니다.`}
                method={`1. 3대 전략목표: New Vision을 기반으로, '어떤 방식의 성과를 만들겠다는 선택'을 3가지로 설정합니다.\n   - 예) 매출 확대(X) → 고수익 구조로의 전환(O)\n2. 전술적 성과: 전략목표를 향해 가고 있음을 단기적으로 확인할 수 있는 구체적인 성과지표를 작성합니다.\n   - 예) 영업 활동 강화(X) → 고수익 고객 매출 비중 +8%(O)\n3. 전략적 활동: 반복 가능한 구조와 체질로 자리 잡았는지를 확인하는 내재화 기준을 작성합니다.\n   - 예) 3분기 연속 유지, 규범화 완료 등`}
            />
        </div>
    );
};

const MetricTable = ({ headers, rows, tableIndex, type, pencilIcon, editingMetric, onEdit, onChange, onBlur, onKeyDown }) => {
    const isEditing = (rowIndex, field) => {
        return editingMetric?.type === type &&
               editingMetric?.tableIndex === tableIndex &&
               editingMetric?.rowIndex === rowIndex &&
               editingMetric?.field === field;
    };

    const getRowNumber = (index) => `${index + 1}.`;

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
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td
                                className={!row.indicator.trim() ? 'empty-row' : ''}
                                onClick={() => !editingMetric && onEdit(type, tableIndex, rowIndex, 'indicator')}
                            >
                                {isEditing(rowIndex, 'indicator') ? (
                                    <>
                                        <span className="row-number">{getRowNumber(rowIndex)}</span>
                                        <input
                                            type="text"
                                            className="metric-input"
                                            value={row.indicator}
                                            onChange={(e) => onChange(type, tableIndex, rowIndex, 'indicator', e.target.value)}
                                            onBlur={onBlur}
                                            onKeyDown={onKeyDown}
                                            autoFocus
                                            placeholder="지표를 입력하세요"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <span className="row-number">{getRowNumber(rowIndex)}</span>
                                        {row.indicator.trim() ? (
                                            <span className="metric-value">{row.indicator}</span>
                                        ) : (
                                            <img src={pencilIcon} alt="" className="edit-icon" />
                                        )}
                                    </>
                                )}
                            </td>
                            <td
                                className={!row.target.trim() ? 'empty-row' : ''}
                                onClick={() => !editingMetric && onEdit(type, tableIndex, rowIndex, 'target')}
                            >
                                {isEditing(rowIndex, 'target') ? (
                                    <input
                                        type="text"
                                        className="metric-input"
                                        value={row.target}
                                        onChange={(e) => onChange(type, tableIndex, rowIndex, 'target', e.target.value)}
                                        onBlur={onBlur}
                                        onKeyDown={onKeyDown}
                                        autoFocus
                                        placeholder="목표를 입력하세요"
                                    />
                                ) : row.target.trim() ? (
                                    <span className="metric-value">{row.target}</span>
                                ) : (
                                    <img src={pencilIcon} alt="" className="edit-icon" />
                                )}
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
