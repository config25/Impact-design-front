import { useState, useEffect } from "react";
import GNB from "../components/common/GNB";
import TipsModal from "../components/common/TipsModal";
import "./BuildWinScreen.css";
import component1 from "../resource/build/Component 1.png";
import { getImageUrl } from "../utils/logoUtil";
import vector3 from "../resource/build/Vector 3.png";
import pencil2 from "../resource/quick/pencil2.png";
import pencil from "../resource/start/pencil.png";
import { getBuildWinCanvas, saveBuildWinCanvas, submitBuildWinCanvas } from "../services/buildWinCanvasService";

const BuildWinScreen = ({ onNavigate, gameStep }) => {
    // Editable fields state
    const [alignment, setAlignment] = useState("");
    const [taskName, setTaskName] = useState("");
    const [taskContent, setTaskContent] = useState("");
    const [triggerSignal, setTriggerSignal] = useState("");
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
            const result = await getBuildWinCanvas();
            if (result.success && result.data) {
                const d = result.data;
                if (d.imageUrl) setLogoUrl(getImageUrl(d.imageUrl));
                setAlignment(d.strategicGoal || "");
                setTaskName(d.taskName || "");
                setTaskContent(d.taskDescription || "");
                setTriggerSignal(d.crisisSignal || "");
                setPainPoint(d.painTouchPoint || "");

                if (d.teamwork) {
                    setTeamwork(d.teamwork.activityTeamwork || "");
                    setOutput(d.teamwork.workType || "");
                }

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
        const result = await saveBuildWinCanvas({
            strategicGoal: alignment, taskName, taskContent,
            crisisSignal: triggerSignal, painPoint, tableCells,
            teamwork, output, outcomes,
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
        const result = await submitBuildWinCanvas({
            strategicGoal: alignment, taskName, taskContent,
            crisisSignal: triggerSignal, painPoint, tableCells,
            teamwork, output, outcomes,
        });
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
        <div className="buildwin-container">
            {/* GNB */}
            <GNB activeScreen="buildwin" onNavigate={onNavigate} gameStep={gameStep} />

            {/* Sub Header */}
            <div className="sub-header">
                <div className="sub-header-title">4. Build Win Canvas</div>
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
                <header className="buildwin-header">
                    <div className="header-left">
                        <div className="step-badge-container">
                            <img src={component1} alt="" className="step-badge-img" />
                            <span className="step-badge-number">4</span>
                            <img src={vector3} alt="" className="step-badge-vector" />
                        </div>
                        <div className="header-text">
                            <h1>Build Win Canvas <span className="title-sub">(전략적 실행과제)</span></h1>
                            <p className="header-desc">
                                Build Win은 단기 성과를 만드는 과제가 아니라, 성과가 반복되게 만드는 '체질'을 바꾸는 과제입니다.
                            </p>
                            <p className="header-desc">
                                이 Build Win이 성공하면, 우리는 한 차원 높은 성과창출 역량을 확보하게 됩니다.
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
                <div className="buildwin-content">
                    {/* Alignment Section */}
                    <div className="alignment-section">
                        <div className="section-label purple">전략목표 Alignment</div>
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
                                    placeholder="Build Win을 통해 중·장기적으로 바꾸고자 하는 '성과가 만들어지는 방식'은 무엇입니까?"
                                />
                            ) : alignment ? (
                                <span>{alignment}</span>
                            ) : (
                                <>
                                    <img src={pencil} alt="" className="edit-icon" />
                                    <span className="help-text">Build Win을 통해 중·장기적으로 바꾸고자 하는 '성과가 만들어지는 방식'은 무엇입니까?</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Task Section */}
                    <div className="task-section">
                        <div className="task-rows">
                            <div className="task-row">
                                <div className="section-label purple small">
                                    <span>전략적</span>
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
                                            placeholder="이 과제를 한 문장으로 정의하면, '무엇을 새로 만들거나 바꾸는 과제'입니까?"
                                        />
                                    ) : taskName ? (
                                        <span>{taskName}</span>
                                    ) : (
                                        <>
                                            <img src={pencil} alt="" className="edit-icon" />
                                            <span>이 과제를 한 문장으로 정의하면, '무엇을 새로 만들거나 바꾸는 과제'입니까?</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="task-row">
                                <div className="section-label purple small invisible">
                                    <span>전략적</span>
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
                                            placeholder="이 과제가 완료되면, 조직의 어떤 기준·구조·역량이 달라집니까?"
                                        />
                                    ) : taskContent ? (
                                        <span>{taskContent}</span>
                                    ) : (
                                        <>
                                            <img src={pencil} alt="" className="edit-icon" />
                                            <span className="help-text">이 과제가 완료되면, 조직의 어떤 기준·구조·역량이 달라집니까?</span>
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
                                    <th className="crisis-header">변화의 신호(Trigger)</th>
                                    <th className="resource-header">필요 자원</th>
                                    <th className="quantity-header">수량</th>
                                    <th className="procedure-header">전환 단계</th>
                                    <th className="content-header">전환 활동</th>
                                    <th className="duration-header">소요기간</th>
                                    <th className="teamwork-header">팀 워크</th>
                                    <th className="teamwork-header2">팀 워크</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 행 1-2: 변화의 신호 */}
                                <tr>
                                    <td
                                        rowSpan="2"
                                        className="crisis-cell"
                                        onClick={() => !editing && handleEdit('triggerSignal')}
                                    >
                                        {editing === 'triggerSignal' ? (
                                            <textarea
                                                className="editable-textarea"
                                                value={triggerSignal}
                                                onChange={(e) => setTriggerSignal(e.target.value)}
                                                onBlur={handleBlur}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                placeholder="지금의 성과 방식이 중·장기적으로 지속되기 어렵다고 판단되는 신호는 무엇입니까?"
                                            />
                                        ) : triggerSignal ? (
                                            <div className="cell-content">{triggerSignal}</div>
                                        ) : (
                                            <>
                                                <div className="cell-question">
                                                    지금의 성과 방식이 중·장기적으로 지속되기<br />
                                                    어렵다고 판단되는 신호는 무엇입니까?
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
                                                <div className="cell-example">(기준 / 규칙 프로세스</div>
                                                <div className="cell-example">/ 체계 시스템 / 플랫폼</div>
                                                <div className="cell-example">역할 정의 등)</div>
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
                                {/* 행 4-5: 지금 성과가 나더라도... */}
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
                                                placeholder="지금 성과가 나더라도, 앞으로 해결되지 않으면 결국 반복될 문제는 무엇입니까?"
                                            />
                                        ) : painPoint ? (
                                            <div className="cell-content">{painPoint}</div>
                                        ) : (
                                            <>
                                                <div className="cell-question">
                                                    지금 성과가 나더라도, 앞으로 해결되지 않으면<br />
                                                    결국 반복될 문제는 무엇입니까?
                                                </div>
                                                <div className="cell-example">(예: 복잡한 의사결정 구조 등)</div>
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
                                                placeholder={index === 0 ? "6~18개월 내 추세로 확인 가능한 변화는 무엇입니까?" : ""}
                                            />
                                        ) : outcomes.quantitative[index] ? (
                                            <span>{outcomes.quantitative[index]}</span>
                                        ) : (
                                            <>
                                                <img src={pencil} alt="" className="edit-icon" />
                                                {index === 0 && <span className="help-text">6~18개월 내 추세로 확인 가능한 변화는 무엇입니까?</span>}
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
                title="전략적 실행과제"
                concept={`Build Win Canvas는 단기 성과를 만드는 과제가 아니라, 성과가 반복되게 만드는 '체질'을 바꾸는 중장기적 전략 실행과제를 설계하는 도구입니다.\n\nBuild Win이 성공하면, 조직은 한 차원 높은 성과창출 역량을 확보하게 됩니다.`}
                method={`1. 전략목표 Alignment: Build Win을 통해 중·장기적으로 바꾸고자 하는 '성과 방식'을 명확히 합니다.\n2. 전략적 실행과제: 과제명과 주요 내용을 구체적으로 작성합니다.\n   - 과제명은 '무엇을 새로 만들거나 바꾸는 과제'인지 한 문장으로 정의\n3. 상황(Situation): 변화의 신호(Trigger)와 Pain/Touch point를 분석합니다.\n4. 투입(Input) → 활동(Activity) → 산출(Outputs): 필요 자원, 전환 단계, 팀워크를 논리적 흐름으로 작성합니다.\n5. 성과(Outcomes): 정성적 효과(체감 변화)와 정량적 효과(측정 가능 변화)를 구분하여 작성합니다.`}
            />
        </div>
    );
};

export default BuildWinScreen;
