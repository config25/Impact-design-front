import { ClickableTd, ClickableDiv } from "./ClickablePopover";

/* ── QuickWin / BuildWin 통합 모달 본문 (학생 UI 동일 — 고정 5행) ── */
const WinCanvasModalBody = ({ data, sideLabel, winColor, title, titleSub, headerDescs }) => {
    const inputs = data.taskInputs || [];
    const activities = data.taskActivities || [];
    const qualitative = (data.taskOutcomes || []).filter(o => o.outcomeType === "QUALITATIVE").sort((a, b) => a.orderNo - b.orderNo);
    const quantitative = (data.taskOutcomes || []).filter(o => o.outcomeType === "QUANTITATIVE").sort((a, b) => a.orderNo - b.orderNo);

    /* 5개 행에 맞춰 데이터 셀 렌더 */
    const renderDataCells = (rowIdx) => (
        <>
            <ClickableTd>{inputs[rowIdx]?.resourceName || ""}</ClickableTd>
            <ClickableTd className="td2-qw-center">{inputs[rowIdx]?.quantity != null ? String(inputs[rowIdx].quantity) : ""}</ClickableTd>
            <ClickableTd>{activities[rowIdx]?.processStep || ""}</ClickableTd>
            <ClickableTd>{activities[rowIdx]?.activityContent || ""}</ClickableTd>
            <ClickableTd>{activities[rowIdx]?.duration || ""}</ClickableTd>
        </>
    );

    return (
        <div className="td2-qw-modal-body" style={{ "--win-color": winColor }}>
            {/* 헤더 */}
            <div className="td2-qw-header">
                <h2 className="td2-qw-header-title">{title} <span className="td2-qw-header-sub">{titleSub}</span></h2>
                {headerDescs.map((desc, i) => (
                    <p key={i} className="td2-qw-header-desc">{desc}</p>
                ))}
            </div>

            {/* 전략목표 Alignment */}
            <div className="td2-qw-align-section">
                <div className="td2-qw-align-label">전략목표 Alignment</div>
                <ClickableDiv className="td2-qw-align-value" text={data.strategicGoal || ""}>{data.strategicGoal || ""}</ClickableDiv>
            </div>

            {/* 과제명 + 주요내용 */}
            <div className="td2-qw-task-grid">
                <div className="td2-qw-task-side" dangerouslySetInnerHTML={{ __html: sideLabel }} />
                <div className="td2-qw-task-label">과제명</div>
                <ClickableDiv className="td2-qw-task-name" text={data.taskName || ""}>{data.taskName || ""}</ClickableDiv>
                <div className="td2-qw-task-label td2-qw-task-label-main">주요 내용</div>
                <ClickableDiv className="td2-qw-task-content" text={data.taskDescription || ""}>{data.taskDescription || ""}</ClickableDiv>
            </div>

            {/* 메인 테이블 — 학생과 동일한 고정 5행 구조 */}
            <div className="td2-qw-table-wrap">
                <table className="td2-qw-table">
                    <thead>
                        <tr className="td2-qw-header-row">
                            <th className="td2-qw-th-situation">상황(Situation)</th>
                            <th colSpan="2">투입(Input)</th>
                            <th colSpan="4">활동(Activity)</th>
                            <th colSpan="2">산출(Outputs)</th>
                        </tr>
                        <tr className="td2-qw-subheader-row">
                            <th className="td2-qw-sub-crisis">위기의 신호 (Crisis Signal)</th>
                            <th>필요 자원</th>
                            <th>수량</th>
                            <th>추진 절차</th>
                            <th>주요 내용</th>
                            <th>소요기간</th>
                            <th>팀 워크</th>
                            <th>팀 워크</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 행 0: 위기의 신호 시작 (rowSpan=2) + 팀워크(rowSpan=5) + 산출(rowSpan=5) */}
                        <tr>
                            <ClickableTd rowSpan={2} className="td2-qw-crisis-cell">{data.crisisSignal || ""}</ClickableTd>
                            {renderDataCells(0)}
                            <ClickableTd rowSpan={5} className="td2-qw-teamwork-cell">{data.teamwork?.activityTeamwork || ""}</ClickableTd>
                            <ClickableTd rowSpan={5} className="td2-qw-output-cell">{data.teamwork?.workType || ""}</ClickableTd>
                        </tr>
                        {/* 행 1: 위기의 신호 계속 */}
                        <tr>
                            {renderDataCells(1)}
                        </tr>
                        {/* 행 2: Pain/Touch point 헤더 */}
                        <tr>
                            <td className="td2-qw-pain-header">Pain/Touch point</td>
                            {renderDataCells(2)}
                        </tr>
                        {/* 행 3: Pain 내용 시작 (rowSpan=2) */}
                        <tr>
                            <ClickableTd rowSpan={2} className="td2-qw-pain-cell">{data.painTouchPoint || ""}</ClickableTd>
                            {renderDataCells(3)}
                        </tr>
                        {/* 행 4: Pain 내용 계속 */}
                        <tr>
                            {renderDataCells(4)}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 성과(Outcomes) */}
            <div className="td2-qw-outcomes">
                <div className="td2-qw-outcomes-header">성과(Outcomes)</div>
                <div className="td2-qw-outcomes-body">
                    <div className="td2-qw-outcomes-titles">
                        <div className="td2-qw-outcomes-title-cell">정성적 효과 (체감되는 변화)</div>
                        <div className="td2-qw-outcomes-title-cell">정량적 효과 (측정가능한 변화)</div>
                    </div>
                    {[0, 1, 2].map(idx => (
                        <div key={idx} className={`td2-qw-outcomes-row ${idx === 2 ? "last" : ""}`}>
                            <ClickableDiv className="td2-qw-outcomes-cell left" text={qualitative[idx]?.outcomeContent || ""}>
                                <span className="td2-qw-outcomes-num">{idx + 1}.</span>
                                <span>{qualitative[idx]?.outcomeContent || ""}</span>
                            </ClickableDiv>
                            <ClickableDiv className="td2-qw-outcomes-cell right" text={quantitative[idx]?.outcomeContent || ""}>
                                <span className="td2-qw-outcomes-num">{idx + 1}.</span>
                                <span>{quantitative[idx]?.outcomeContent || ""}</span>
                            </ClickableDiv>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WinCanvasModalBody;
