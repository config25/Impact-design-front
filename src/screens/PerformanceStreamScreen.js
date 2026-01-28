import { useState } from "react";
import GNB from "../components/common/GNB";
import "./PerformanceStreamScreen.css";
import shinhanLogo from "../resource/flow/신한은행.png";
import component1 from "../resource/flow/Component 1.png";
import vector3 from "../resource/flow/Vector 3.png";
import pencil2 from "../resource/quick/pencil2.png";
import pencilIcon from "../resource/identity/pencil.png";

const PerformanceStreamScreen = ({ onNavigate }) => {
    // Goal cards state
    const [goalCards, setGoalCards] = useState([
        { title: "", content: "" },
        { title: "", content: "" },
        { title: "", content: "" }
    ]);
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
        [{ indicator: "", target: "" }, { indicator: "", target: "" }, { indicator: "", target: "" }],
        [{ indicator: "", target: "" }, { indicator: "", target: "" }, { indicator: "", target: "" }],
        [{ indicator: "", target: "" }, { indicator: "", target: "" }, { indicator: "", target: "" }]
    ]);

    // Strategic Activity tables state (3 tables x 3 rows)
    const [strategicTables, setStrategicTables] = useState([
        [{ indicator: "", target: "" }, { indicator: "", target: "" }, { indicator: "", target: "" }],
        [{ indicator: "", target: "" }, { indicator: "", target: "" }, { indicator: "", target: "" }],
        [{ indicator: "", target: "" }, { indicator: "", target: "" }, { indicator: "", target: "" }]
    ]);

    const [editingMetric, setEditingMetric] = useState(null); // { type, tableIndex, rowIndex, field }

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
