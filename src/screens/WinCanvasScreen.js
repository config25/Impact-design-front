import { useState, useEffect, useContext } from "react";
import { DashboardContext } from "../contexts/DashboardContext";
import GNB from "../components/common/GNB";
import TipsModal from "../components/common/TipsModal";
import { getImageUrl } from "../utils/logoUtil";
import pencil2 from "../resource/quick/pencil2.png";
import pencil from "../resource/start/pencil.png";
import "./WinCanvasScreen.css";

const WinCanvasScreen = ({
    onNavigate, gameStep,
    // Config props
    containerClass, headerClass, contentClass,
    activeScreen, stepNumber, stepBadgeImg, stepBadgeVector,
    title, titleSub, headerDesc,
    colorClass, labelPrefix,
    placeholders, subHeaders, outputExamples,
    tipsModal, serviceFns,
}) => {
    const { dashboard } = useContext(DashboardContext);
    const [alignment, setAlignment] = useState("");
    const [taskName, setTaskName] = useState("");
    const [taskContent, setTaskContent] = useState("");
    const [signalValue, setSignalValue] = useState("");
    const [painPoint, setPainPoint] = useState("");
    const [teamwork, setTeamwork] = useState("");
    const [output, setOutput] = useState("");

    const [tableCells, setTableCells] = useState(
        Array(5).fill(null).map(() => Array(5).fill(""))
    );

    const [outcomes, setOutcomes] = useState({
        qualitative: ["", "", ""],
        quantitative: ["", "", ""]
    });

    const [editing, setEditing] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await serviceFns.get();
            if (result.success && result.data) {
                const d = result.data;
                if (!dashboard?.classImage && d.imageUrl) setLogoUrl(getImageUrl(d.imageUrl));
                setAlignment(d.strategicGoal || "");
                setTaskName(d.taskName || "");
                setTaskContent(d.taskDescription || "");
                setSignalValue(d.crisisSignal || "");
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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const buildPayload = () => ({
        strategicGoal: alignment, taskName, taskContent,
        crisisSignal: signalValue, painPoint, tableCells,
        teamwork, output, outcomes,
    });

    const handleSave = async () => {
        const result = await serviceFns.save(buildPayload());
        if (result.success) {
            alert("저장되었습니다.");
        } else {
            alert(result.message);
        }
    };

    const handleSubmit = async () => {
        if (submitted) return;
        if (!window.confirm("제출완료 후에는 수정이 불가능합니다. 제출하시겠습니까?")) return;
        const result = await serviceFns.submit(buildPayload());
        if (result.success) {
            setSubmitted(true);
            alert("제출이 완료되었습니다.");
        } else {
            alert(result.message);
        }
    };

    const handleEdit = (field) => setEditing(field);
    const handleBlur = () => setEditing(null);
    const handleKeyDown = (e) => { if (e.key === "Escape") setEditing(null); };

    const renderInputCells = (row) => [0, 1, 2, 3, 4].map(col => (
        <td
            key={`${row}-${col}`}
            className="input-cell"
            onClick={() => !editing && handleEdit(`cell-${row}-${col}`)}
        >
            {editing === `cell-${row}-${col}` ? (
                <input
                    type="text"
                    className="cell-input"
                    value={tableCells[row][col]}
                    onChange={(e) => handleTableCellChange(row, col, e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : tableCells[row][col] ? (
                <span>{tableCells[row][col]}</span>
            ) : (
                <img src={pencil} alt="" className="edit-icon" />
            )}
        </td>
    ));

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
        <div className={`win-canvas ${containerClass}`}>
            <GNB activeScreen={activeScreen} onNavigate={onNavigate} gameStep={gameStep} />

            <div className="sub-header">
                <div className="sub-header-title">{stepNumber}. {title}</div>
                <div className="sub-header-actions">
                    <button className="tips-button" onClick={() => setShowTips(true)}>
                        <img src={pencil2} alt="" className="pencil-icon" />
                        <span className="tips-text"><span className="tips-text-bold">작성 Tips</span><span className="tips-text-regular">를 확인해보세요!</span></span>
                    </button>
                    <button className="save-button" onClick={handleSave} disabled={submitted}>저장</button>
                    <button className="submit-button" onClick={handleSubmit} disabled={submitted}>{submitted ? "제출됨" : "제출완료"}</button>
                </div>
            </div>

            <div className="main-content-box">
                <header className={`win-header ${headerClass}`}>
                    <div className="header-left">
                        <div className="step-badge-container">
                            <img src={stepBadgeImg} alt="" className="step-badge-img" />
                            <span className="step-badge-number">{stepNumber}</span>
                            <img src={stepBadgeVector} alt="" className="step-badge-vector" />
                        </div>
                        <div className="header-text">
                            <h1>{title} <span className="title-sub">{titleSub}</span></h1>
                            {headerDesc.map((desc, i) => (
                                <p key={i} className="header-desc">{desc}</p>
                            ))}
                        </div>
                    </div>
                    {(dashboard?.classImage || logoUrl) && (
                        <div className="logo-wrapper">
                            <img src={dashboard?.classImage ? getImageUrl(dashboard.classImage) : logoUrl} alt="logo" className="logo-img" />
                        </div>
                    )}
                </header>

                <div className={`win-content ${contentClass}`}>
                    {/* Alignment Section */}
                    <div className="alignment-section"><div className={`section-label ${colorClass}`}>전략목표 Alignment</div>
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
                                    placeholder={placeholders.alignment}
                                />
                            ) : alignment ? (
                                <span>{alignment}</span>
                            ) : (
                                <>
                                    <img src={pencil} alt="" className="edit-icon" />
                                    <span className="help-text">{placeholders.alignment}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Task Section */}
                    <div className="task-section">
                        <div className="task-rows">
                            <div className="task-row">
                                <div className={`section-label ${colorClass} small`}>
                                    <span>{labelPrefix}</span>
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
                                            placeholder={placeholders.taskName}
                                        />
                                    ) : taskName ? (
                                        <span>{taskName}</span>
                                    ) : (
                                        <>
                                            <img src={pencil} alt="" className="edit-icon" />
                                            <span>{placeholders.taskName}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="task-row">
                                <div className={`section-label ${colorClass} small invisible`}>
                                    <span>{labelPrefix}</span>
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
                                            placeholder={placeholders.taskContent}
                                        />
                                    ) : taskContent ? (
                                        <span>{taskContent}</span>
                                    ) : (
                                        <>
                                            <img src={pencil} alt="" className="edit-icon" />
                                            <span className="help-text">{placeholders.taskContent}</span>
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
                                    <th className="crisis-header">{subHeaders.signal}</th>
                                    <th className="resource-header">필요 자원</th>
                                    <th className="quantity-header">수량</th>
                                    <th className="procedure-header">{subHeaders.procedure}</th>
                                    <th className="content-header">{subHeaders.content}</th>
                                    <th className="duration-header">소요기간</th>
                                    <th className="teamwork-header">팀 워크</th>
                                    <th className="teamwork-header2">팀 워크</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 행 1-2: 신호 */}
                                <tr>
                                    <td
                                        rowSpan="2"
                                        className="crisis-cell"
                                        onClick={() => !editing && handleEdit('signalValue')}
                                    >
                                        {editing === 'signalValue' ? (
                                            <textarea
                                                className="editable-textarea"
                                                value={signalValue}
                                                onChange={(e) => setSignalValue(e.target.value)}
                                                onBlur={handleBlur}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                placeholder={placeholders.signal}
                                            />
                                        ) : signalValue ? (
                                            <div className="cell-content">{signalValue}</div>
                                        ) : (
                                            <>
                                                <div className="cell-question">{placeholders.signalQuestion.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</div>
                                                <div className="cell-example">{placeholders.signalExample}</div>
                                            </>
                                        )}
                                    </td>
                                    {renderInputCells(0)}
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
                                                {outputExamples.map((ex, i) => (
                                                    <div key={i} className="cell-example">{ex}</div>
                                                ))}
                                            </>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    {renderInputCells(1)}
                                </tr>
                                {/* Pain/Touch point */}
                                <tr>
                                    <td className="pain-header-cell">Pain/Touch point</td>
                                    {renderInputCells(2)}
                                </tr>
                                {/* Pain point rows */}
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
                                                placeholder={placeholders.painPoint}
                                            />
                                        ) : painPoint ? (
                                            <div className="cell-content">{painPoint}</div>
                                        ) : (
                                            <>
                                                <div className="cell-question">{placeholders.painPointQuestion.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</div>
                                                <div className="cell-example">{placeholders.painPointExample}</div>
                                            </>
                                        )}
                                    </td>
                                    {renderInputCells(3)}
                                </tr>
                                <tr>
                                    {renderInputCells(4)}
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
                                                placeholder={index === 0 ? placeholders.qualitative : ""}
                                            />
                                        ) : outcomes.qualitative[index] ? (
                                            <span>{outcomes.qualitative[index]}</span>
                                        ) : (
                                            <>
                                                <img src={pencil} alt="" className="edit-icon" />
                                                {index === 0 && <span className="help-text">{placeholders.qualitative}</span>}
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
                                                placeholder={index === 0 ? placeholders.quantitative : ""}
                                            />
                                        ) : outcomes.quantitative[index] ? (
                                            <span>{outcomes.quantitative[index]}</span>
                                        ) : (
                                            <>
                                                <img src={pencil} alt="" className="edit-icon" />
                                                {index === 0 && <span className="help-text">{placeholders.quantitative}</span>}
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
                title={tipsModal.title}
                concept={tipsModal.concept}
                method={tipsModal.method}
            />
        </div>
    );
};

export default WinCanvasScreen;
