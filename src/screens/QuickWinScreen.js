import { useState, useEffect } from "react";
import GNB from "../components/common/GNB";
import TipsModal from "../components/common/TipsModal";
import "./QuickWinScreen.css";
import component1 from "../resource/quick/Component 1.png";
import { getImageUrl } from "../utils/logoUtil";
import vector3 from "../resource/quick/Vector 3.png";
import pencil2 from "../resource/quick/pencil2.png";
import pencil from "../resource/start/pencil.png";
import { getQuickWinCanvas, saveQuickWinCanvas, submitQuickWinCanvas } from "../services/quickWinCanvasService";

const QuickWinScreen = ({ onNavigate }) => {
    // Editable fields state
    const [alignment, setAlignment] = useState("");
    const [taskName, setTaskName] = useState("");
    const [taskContent, setTaskContent] = useState("");
    const [crisisSignal, setCrisisSignal] = useState("");
    const [painPoint, setPainPoint] = useState("");
    const [teamwork, setTeamwork] = useState("");
    const [output, setOutput] = useState("");

    // Table cells state (5 rows x 5 columns for input cells)
    const [tableCells, setTableCells] = useState(
        Array(5).fill(null).map(() => Array(5).fill(""))
    );

    // Outcomes state
    const [outcomes, setOutcomes] = useState({
        qualitative: ["", "", ""],
        quantitative: ["", "", ""]
    });

    // Editing state
    const [editing, setEditing] = useState(null);

    // Submit state
    const [submitted, setSubmitted] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getQuickWinCanvas();
            if (result.success && result.data) {
                const d = result.data;
                if (d.imageUrl) setLogoUrl(getImageUrl(d.imageUrl));
                setAlignment(d.strategicGoal || "");
                setTaskName(d.taskName || "");
                setTaskContent(d.taskDescription || "");
                setCrisisSignal(d.crisisSignal || "");
                setPainPoint(d.painTouchPoint || "");

                if (d.teamwork) {
                    setTeamwork(d.teamwork.activityTeamwork || "");
                    setOutput(d.teamwork.workType || "");
                }

                // tableCells: 5 rows x 5 cols (input 2cols + activity 3cols)
                const inputs = d.taskInputs || [];
                const activities = d.taskActivities || [];
                const cells = Array(5).fill(null).map((_, i) => [
                    inputs[i]?.resourceName || "",
                    inputs[i]?.quantity != null ? String(inputs[i].quantity) : "",
                    activities[i]?.processStep || "",
                    activities[i]?.activityContent || "",
                    activities[i]?.duration || "",
                ]);
                setTableCells(cells);

                // outcomes
                const taskOutcomes = d.taskOutcomes || [];
                const qual = ["", "", ""];
                const quant = ["", "", ""];
                taskOutcomes.forEach((o) => {
                    if (o.outcomeType === "QUALITATIVE") {
                        const idx = o.orderNo - 1;
                        if (idx >= 0 && idx < 3) qual[idx] = o.outcomeContent || "";
                    } else if (o.outcomeType === "QUANTITATIVE") {
                        const idx = o.orderNo - 4;
                        if (idx >= 0 && idx < 3) quant[idx] = o.outcomeContent || "";
                    }
                });
                setOutcomes({ qualitative: qual, quantitative: quant });

                setSubmitted(d.submitted || false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        const result = await saveQuickWinCanvas({
            strategicGoal: alignment, taskName, taskContent, crisisSignal,
            painPoint, tableCells, teamwork, output, outcomes,
        });
        if (result.success) {
            alert("저장되었습니다.");
        } else {
            alert(result.message);
        }
    };

    const handleSubmit = async () => {
        if (submitted) return;
        if (!window.confirm("제출완료 후에는 수정이 불가능합니다. 제출하시겠습니까?")) return;
        const result = await submitQuickWinCanvas();
        if (result.success) {
            setSubmitted(true);
            alert("제출이 완료되었습니다.");
        } else {
            alert(result.message);
        }
    };

    const handleEdit = (field) => {
        setEditing(field);
    };

    const handleBlur = () => {
        setEditing(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setEditing(null);
        }
    };

    const handleTableCellChange = (row, col, value) => {
        setTableCells(prev => {
            const newCells = prev.map(r => [...r]);
            newCells[row][col] = value;
            return newCells;
        });
    };

    const handleOutcomeChange = (type, index, value) => {
        setOutcomes(prev => ({
            ...prev,
            [type]: prev[type].map((v, i) => i === index ? value : v)
        }));
    };

    return (
        <div className="quickwin-container">
            {/* GNB */}
            <GNB activeScreen="quickwin" onNavigate={onNavigate} />

            {/* Sub Header */}
            <div className="sub-header">
                <div className="sub-header-title">3. Quick Win Canvas</div>
                <div className="sub-header-actions">
                    <button className="tips-button" onClick={() => setShowTips(true)}>
                        <img src={pencil2} alt="" className="pencil-icon" />
                        <span className="tips-text"><span className="tips-text-bold">작성 Tips</span><span className="tips-text-regular">를 확인해보세요!</span></span>
                    </button>
                    <button className="save-button" onClick={handleSave} disabled={submitted}>저장</button>
                    <button className="submit-button" onClick={handleSubmit} disabled={submitted}>{submitted ? "제출됨" : "제출완료"}</button>
                </div>
            </div>

            {/* Main Content Box */}
            <div className="main-content-box">
                {/* Header */}
                <header className="quickwin-header">
                    <div className="header-left">
                        <div className="step-badge-container">
                            <img src={component1} alt="" className="step-badge-img" />
                            <span className="step-badge-number">3</span>
                            <img src={vector3} alt="" className="step-badge-vector" />
                        </div>
                        <div className="header-text">
                            <h1>Quick Win Canvas <span className="title-sub">(전술적 실행과제)</span></h1>
                            <p className="header-desc">
                                Quick Win은 전략목표 달성을 가로막는 장애물을 빠르게 제거하여 단기적으로 가시적인 성과를 만들어내는 실행과제입니다.
                            </p>
                            <p className="header-desc">
                                이 Quick Win이 실행되지 않으면, 우리는 지금 만들 수 있는 성과를 계속 '놓치게' 됩니다.
                            </p>
                        </div>
                    </div>
                    {logoUrl && (
                        <div className="logo-wrapper">
                            <img src={logoUrl} alt="logo" className="logo-img" />
                        </div>
                    )}
                </header>

                {/* Content */}
                <div className="quickwin-content">
                    {/* Alignment Section */}
                    <div className="alignment-section">
                        <div className="section-label cyan">전략목표 Alignment</div>
                        <div
                            className="section-content"
                            onClick={() => !editing && handleEdit('alignment')}
                        >
                            {editing === 'alignment' ? (
                                <input
                                    type="text"
                                    className="editable-input"
                                    value={alignment}
                                    onChange={(e) => setAlignment(e.target.value)}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    placeholder="이 과제는 회사의 어떤 전략목표(방향)와 연계되어 있습니까?"
                                />
                            ) : alignment ? (
                                <span>{alignment}</span>
                            ) : (
                                <>
                                    <img src={pencil} alt="" className="edit-icon" />
                                    <span className="help-text">이 과제는 회사의 어떤 전략목표(방향)와 연계되어 있습니까?</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Task Section */}
                    <div className="task-section">
                        <div className="task-rows">
                            <div className="task-row">
                                <div className="section-label cyan small">
                                    <span>전술적</span>
                                    <span>실행과제</span>
                                </div>
                                <div className="task-label">과제명</div>
                                <div
                                    className={`task-content highlight ${taskName ? 'has-content' : ''}`}
                                    onClick={() => !editing && handleEdit('taskName')}
                                >
                                    {editing === 'taskName' ? (
                                        <input
                                            type="text"
                                            className="editable-input highlight-input"
                                            value={taskName}
                                            onChange={(e) => setTaskName(e.target.value)}
                                            onBlur={handleBlur}
                                            onKeyDown={handleKeyDown}
                                            autoFocus
                                            placeholder="이 과제를 한 문장으로 표현하면, '무엇을 제거/해결하는 과제'입니까?"
                                        />
                                    ) : taskName ? (
                                        <span>{taskName}</span>
                                    ) : (
                                        <>
                                            <img src={pencil} alt="" className="edit-icon" />
                                            <span>이 과제를 한 문장으로 표현하면, '무엇을 제거/해결하는 과제'입니까?</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="task-row">
                                <div className="section-label cyan small invisible">
                                    <span>전술적</span>
                                    <span>실행과제</span>
                                </div>
                                <div className="task-label main-content-label">주요 내용</div>
                                <div
                                    className="task-content main-content"
                                    onClick={() => !editing && handleEdit('taskContent')}
                                >
                                    {editing === 'taskContent' ? (
                                        <input
                                            type="text"
                                            className="editable-input"
                                            value={taskContent}
                                            onChange={(e) => setTaskContent(e.target.value)}
                                            onBlur={handleBlur}
                                            onKeyDown={handleKeyDown}
                                            autoFocus
                                            placeholder="이 과제를 실행하면 [어떤 문제]가 해결되어 [어떤 결과]가 나올 것이라고 확신합니까?"
                                        />
                                    ) : taskContent ? (
                                        <span>{taskContent}</span>
                                    ) : (
                                        <>
                                            <img src={pencil} alt="" className="edit-icon" />
                                            <span className="help-text">이 과제를 실행하면 [어떤 문제]가 해결되어 [어떤 결과]가 나올 것이라고 확신합니까?</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Table */}
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
                                    <th className="crisis-header">위기의 신호 (Crisis Signal)</th>
                                    <th className="resource-header">필요 자원</th>
                                    <th className="quantity-header">수량</th>
                                    <th className="procedure-header">추진 절차</th>
                                    <th className="content-header">주요 내용</th>
                                    <th className="duration-header">소요기간</th>
                                    <th className="teamwork-header">팀 워크</th>
                                    <th className="teamwork-header2">팀 워크</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 행 1-2: 위기의 신호 */}
                                <tr>
                                    <td
                                        rowSpan="2"
                                        className="crisis-cell"
                                        onClick={() => !editing && handleEdit('crisisSignal')}
                                    >
                                        {editing === 'crisisSignal' ? (
                                            <textarea
                                                className="editable-textarea"
                                                value={crisisSignal}
                                                onChange={(e) => setCrisisSignal(e.target.value)}
                                                onBlur={handleBlur}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                placeholder="지금 이 과제를 실행해야 할 이유나 신호(Signal)는 무엇입니까?"
                                            />
                                        ) : crisisSignal ? (
                                            <div className="cell-content">{crisisSignal}</div>
                                        ) : (
                                            <>
                                                <div className="cell-question">
                                                    지금 이 과제를 실행해야 할<br />
                                                    이유나 신호(Signal)는 무엇입니까?
                                                </div>
                                                <div className="cell-example">(예: 매출하락, 고객이탈 등)</div>
                                            </>
                                        )}
                                    </td>
                                    {[0, 1, 2, 3, 4].map(col => (
                                        <td
                                            key={`0-${col}`}
                                            className="input-cell"
                                            onClick={() => !editing && handleEdit(`cell-0-${col}`)}
                                        >
                                            {editing === `cell-0-${col}` ? (
                                                <input
                                                    type="text"
                                                    className="cell-input"
                                                    value={tableCells[0][col]}
                                                    onChange={(e) => handleTableCellChange(0, col, e.target.value)}
                                                    onBlur={handleBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                />
                                            ) : tableCells[0][col] ? (
                                                <span>{tableCells[0][col]}</span>
                                            ) : (
                                                <img src={pencil} alt="" className="edit-icon" />
                                            )}
                                        </td>
                                    ))}
                                    <td
                                        rowSpan="5"
                                        className="teamwork-cell"
                                        onClick={() => !editing && handleEdit('teamwork')}
                                    >
                                        {editing === 'teamwork' ? (
                                            <textarea
                                                className="editable-textarea"
                                                value={teamwork}
                                                onChange={(e) => setTeamwork(e.target.value)}
                                                onBlur={handleBlur}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                placeholder="함께 추진할 Lead 그룹과 Support 그룹은 누구입니까?"
                                            />
                                        ) : teamwork ? (
                                            <div className="cell-content">{teamwork}</div>
                                        ) : (
                                            <>
                                                <img src={pencil} alt="" className="edit-icon cell-pencil" />
                                                <div className="cell-question">
                                                    함께 추진할<br />
                                                    Lead 그룹과<br />
                                                    Support 그룹은<br />
                                                    누구입니까?
                                                </div>
                                            </>
                                        )}
                                    </td>
                                    <td
                                        rowSpan="5"
                                        className="output-cell"
                                        onClick={() => !editing && handleEdit('output')}
                                    >
                                        {editing === 'output' ? (
                                            <textarea
                                                className="editable-textarea"
                                                value={output}
                                                onChange={(e) => setOutput(e.target.value)}
                                                onBlur={handleBlur}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                placeholder="이 과제가 끝나면 '남는 것'은 무엇입니까?"
                                            />
                                        ) : output ? (
                                            <div className="cell-content">{output}</div>
                                        ) : (
                                            <>
                                                <img src={pencil} alt="" className="edit-icon cell-pencil" />
                                                <div className="cell-question">
                                                    이 과제가 끝나면<br />
                                                    '남는 것'은<br />
                                                    무엇입니까?
                                                </div>
                                                <div className="cell-example">(업무 매뉴얼, 체크리스트,</div>
                                                <div className="cell-example">개선된 양식, 분석 보고서,</div>
                                                <div className="cell-example">시범 운영 결과 등)</div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    {[0, 1, 2, 3, 4].map(col => (
                                        <td
                                            key={`1-${col}`}
                                            className="input-cell"
                                            onClick={() => !editing && handleEdit(`cell-1-${col}`)}
                                        >
                                            {editing === `cell-1-${col}` ? (
                                                <input
                                                    type="text"
                                                    className="cell-input"
                                                    value={tableCells[1][col]}
                                                    onChange={(e) => handleTableCellChange(1, col, e.target.value)}
                                                    onBlur={handleBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                />
                                            ) : tableCells[1][col] ? (
                                                <span>{tableCells[1][col]}</span>
                                            ) : (
                                                <img src={pencil} alt="" className="edit-icon" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                {/* 행 3: Pain/Touch point */}
                                <tr>
                                    <td className="pain-header-cell">Pain/Touch point</td>
                                    {[0, 1, 2, 3, 4].map(col => (
                                        <td
                                            key={`2-${col}`}
                                            className="input-cell"
                                            onClick={() => !editing && handleEdit(`cell-2-${col}`)}
                                        >
                                            {editing === `cell-2-${col}` ? (
                                                <input
                                                    type="text"
                                                    className="cell-input"
                                                    value={tableCells[2][col]}
                                                    onChange={(e) => handleTableCellChange(2, col, e.target.value)}
                                                    onBlur={handleBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                />
                                            ) : tableCells[2][col] ? (
                                                <span>{tableCells[2][col]}</span>
                                            ) : (
                                                <img src={pencil} alt="" className="edit-icon" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                {/* 행 4-5: 성과를 막고... */}
                                <tr>
                                    <td
                                        rowSpan="2"
                                        className="pain-cell"
                                        onClick={() => !editing && handleEdit('painPoint')}
                                    >
                                        {editing === 'painPoint' ? (
                                            <textarea
                                                className="editable-textarea"
                                                value={painPoint}
                                                onChange={(e) => setPainPoint(e.target.value)}
                                                onBlur={handleBlur}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                placeholder="성과를 막고 문제를 발생시키는 구체적인 '장애물(Bottleneck)'은 무엇입니까?"
                                            />
                                        ) : painPoint ? (
                                            <div className="cell-content">{painPoint}</div>
                                        ) : (
                                            <>
                                                <div className="cell-question">
                                                    성과를 막고 문제를 발생시키는 구체적인<br />
                                                    '장애물(Bottleneck)'은 무엇입니까?
                                                </div>
                                                <div className="cell-example">(예: 시스템 오류 등)</div>
                                            </>
                                        )}
                                    </td>
                                    {[0, 1, 2, 3, 4].map(col => (
                                        <td
                                            key={`3-${col}`}
                                            className="input-cell"
                                            onClick={() => !editing && handleEdit(`cell-3-${col}`)}
                                        >
                                            {editing === `cell-3-${col}` ? (
                                                <input
                                                    type="text"
                                                    className="cell-input"
                                                    value={tableCells[3][col]}
                                                    onChange={(e) => handleTableCellChange(3, col, e.target.value)}
                                                    onBlur={handleBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                />
                                            ) : tableCells[3][col] ? (
                                                <span>{tableCells[3][col]}</span>
                                            ) : (
                                                <img src={pencil} alt="" className="edit-icon" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    {[0, 1, 2, 3, 4].map(col => (
                                        <td
                                            key={`4-${col}`}
                                            className="input-cell"
                                            onClick={() => !editing && handleEdit(`cell-4-${col}`)}
                                        >
                                            {editing === `cell-4-${col}` ? (
                                                <input
                                                    type="text"
                                                    className="cell-input"
                                                    value={tableCells[4][col]}
                                                    onChange={(e) => handleTableCellChange(4, col, e.target.value)}
                                                    onBlur={handleBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                />
                                            ) : tableCells[4][col] ? (
                                                <span>{tableCells[4][col]}</span>
                                            ) : (
                                                <img src={pencil} alt="" className="edit-icon" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Outcomes Section */}
                    <div className="outcomes-section">
                        <div className="outcomes-header">성과(Outcomes)</div>
                        <div className="outcomes-content">
                            <div className="outcomes-row outcomes-title-row">
                                <div className="outcomes-cell outcomes-title-cell left">정성적 효과(체감되는 변화)</div>
                                <div className="outcomes-cell outcomes-title-cell right">정량적 효과(측정가능한 변화)</div>
                            </div>
                            {[0, 1, 2].map((index) => (
                                <div key={index} className="outcomes-row">
                                    <div
                                        className={`outcomes-cell left ${index === 2 ? 'last' : ''}`}
                                        onClick={() => !editing && handleEdit(`qualitative-${index}`)}
                                    >
                                        <span className="item-number">{index + 1}.</span>
                                        {editing === `qualitative-${index}` ? (
                                            <input
                                                type="text"
                                                className="outcome-input"
                                                value={outcomes.qualitative[index]}
                                                onChange={(e) => handleOutcomeChange('qualitative', index, e.target.value)}
                                                onBlur={handleBlur}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                placeholder={index === 0 ? "현장에서 가장 먼저 체감되는 변화는 무엇입니까?" : ""}
                                            />
                                        ) : outcomes.qualitative[index] ? (
                                            <span>{outcomes.qualitative[index]}</span>
                                        ) : (
                                            <>
                                                <img src={pencil} alt="" className="edit-icon" />
                                                {index === 0 && <span className="help-text">현장에서 가장 먼저 체감되는 변화는 무엇입니까?</span>}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`outcomes-cell right ${index === 2 ? 'last' : ''}`}
                                        onClick={() => !editing && handleEdit(`quantitative-${index}`)}
                                    >
                                        <span className="item-number">{index + 1}.</span>
                                        {editing === `quantitative-${index}` ? (
                                            <input
                                                type="text"
                                                className="outcome-input"
                                                value={outcomes.quantitative[index]}
                                                onChange={(e) => handleOutcomeChange('quantitative', index, e.target.value)}
                                                onBlur={handleBlur}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                placeholder={index === 0 ? "6개월 내 수치로 확인 가능한 변화는 무엇입니까?" : ""}
                                            />
                                        ) : outcomes.quantitative[index] ? (
                                            <span>{outcomes.quantitative[index]}</span>
                                        ) : (
                                            <>
                                                <img src={pencil} alt="" className="edit-icon" />
                                                {index === 0 && <span className="help-text">6개월 내 수치로 확인 가능한 변화는 무엇입니까?</span>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <TipsModal
                show={showTips}
                onClose={() => setShowTips(false)}
                title="전술적 실행과제"
                concept={`Quick Win Canvas는 전략목표 달성을 가로막는 장애물을 빠르게 제거하여, 단기간에 가시적 성과를 만들어내는 전술적 실행과제를 설계하는 도구입니다.\n\nQuick Win이 실행되지 않으면, 지금 당장 만들 수 있는 성과를 계속 놓치게 됩니다.`}
                method={`1. 전략목표 Alignment: 이 과제가 연계된 전략목표(방향)를 명확히 합니다.\n2. 전술적 실행과제: 과제명과 주요 내용을 구체적으로 작성합니다.\n   - 과제명은 '무엇을 제거/해결하는 과제'인지 한 문장으로 표현\n3. 상황(Situation): 위기의 신호와 Pain/Touch point를 분석합니다.\n4. 투입(Input) → 활동(Activity) → 산출(Outputs): 필요 자원, 추진 절차, 팀워크를 논리적 흐름으로 작성합니다.\n5. 성과(Outcomes): 정성적 효과(체감 변화)와 정량적 효과(측정 가능 변화)를 구분하여 작성합니다.`}
            />
        </div>
    );
};

export default QuickWinScreen;
