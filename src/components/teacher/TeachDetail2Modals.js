import { useState } from "react";
import ReportScreen from "../../screens/teacher/ReportScreen";
import { FundingModalBody, FundingResultModalBody, impactQuestions } from "../../constants/teachDetail2Constants";

/* ── 클릭하면 전체 내용 팝오버로 표시하는 td ── */
const extractText = (node) => {
    if (node == null) return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node.props?.children) return extractText(node.props.children);
    return "";
};

const ClickableTd = ({ children, className, rowSpan, colSpan }) => {
    const [show, setShow] = useState(false);
    const text = extractText(children).trim();
    return (
        <td
            className={`${className || ""} td2-clickable-cell`}
            rowSpan={rowSpan}
            colSpan={colSpan}
            onClick={() => { if (text) setShow(true); }}
        >
            {children}
            {show && text && (
                <div className="td2-popover-overlay" onClick={e => { e.stopPropagation(); setShow(false); }}>
                    <div className="td2-popover" onClick={e => e.stopPropagation()}>
                        <div className="td2-popover-body">{text}</div>
                        <button className="td2-popover-close" onClick={() => setShow(false)}>닫기</button>
                    </div>
                </div>
            )}
        </td>
    );
};

/* ── 클릭하면 전체 내용 팝오버로 표시하는 div ── */
const ClickableDiv = ({ children, className, text }) => {
    const [show, setShow] = useState(false);
    const content = text || "";
    return (
        <div
            className={`${className || ""} td2-clickable-cell`}
            onClick={() => { if (content) setShow(true); }}
        >
            {children}
            {show && content && (
                <div className="td2-popover-overlay" onClick={e => { e.stopPropagation(); setShow(false); }}>
                    <div className="td2-popover" onClick={e => e.stopPropagation()}>
                        <div className="td2-popover-body">{content}</div>
                        <button className="td2-popover-close" onClick={() => setShow(false)}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

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

const TeachDetail2Modals = ({
    /* ImpactCheck 모달 */
    showMissionModal, setShowMissionModal, missionModalTitle, missionModalData,
    /* 정체성 설계 모달 */
    showIdentityModal, setShowIdentityModal, identityModalTitle, identityModalData,
    /* 성과경로 설계 모달 */
    showFlowModal, setShowFlowModal, flowModalTitle, flowModalData,
    /* 전술적 실행과제 모달 */
    showQuickWinModal, setShowQuickWinModal, quickWinModalTitle, quickWinModalData,
    /* 전략적 실행과제 모달 */
    showBuildWinModal, setShowBuildWinModal, buildWinModalTitle, buildWinModalData,
    /* 실행과제 검증 모달 (F-1, F-2) */
    showFundingModal, setShowFundingModal, fundingModalTitle, fundingModalData, fundingModalType, missionModalTeamId,
    /* 최종 결과 모달 (F-3) */
    showResultModal, setShowResultModal, resultModalTitle, resultModalData,
    /* 삭제된 팀 모달 */
    showDeletedModal, setShowDeletedModal, deletedTeams, selectedDeleted, setSelectedDeleted, handleRestore,
    /* 팀/참여자 정보입력 모달 */
    showTeamModal, setShowTeamModal, modalTeam, modalTeamName, setModalTeamName,
    modalMembers, setModalMembers, selectedMembers,
    handleMemberCheck, handleDeleteMembers, handleAddMember, handleSetWriter, handleTeamModalSave,
    /* 보고서 모달 */
    showReportModal, setShowReportModal, reportTeamId,
    /* 전체 PDF */
    pdfReportRef, pdfRenderData, pdfRenderTeamCanvas, handlePdfReportReady,
    pdfAllRunning, pdfProgress, setPdfProgress,
    /* 강의실 수정 모달 */
    showModifyModal, setShowModifyModal, gameInfo,
    modifyName, setModifyName, modifyTarget, setModifyTarget, modifyMonth, setModifyMonth, modifyDay, setModifyDay,
    modifyHour, setModifyHour, modifyMinute, setModifyMinute,
    handleModifySave, rangeArray,
    /* 모달 내 팀 선택 */
    activeTeamId, handleModalTeamChange,
    teams,
}) => {
    /* 모달 안 팀 선택 바 */
    const TeamSelectBar = () => (
        <div className="td2-modal-team-bar">
            {(teams || []).map(t => (
                <button
                    key={t.teamId}
                    className={`td2-modal-team-btn ${activeTeamId === t.teamId ? "active" : ""}`}
                    onClick={() => handleModalTeamChange(t.teamId, t.teamName)}
                >
                    {t.teamName}
                </button>
            ))}
        </div>
    );

    return (
        <>
            {/* 미션 열람 모달 (ImpactCheck) - 학생 UI 동일 */}
            {showMissionModal && missionModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowMissionModal(false)}>
                    <div className="td2-impact-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{missionModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowMissionModal(false)}>&times;</button>
                        </div>
                        <TeamSelectBar />
                        <div className="td2-impact-modal-body">
                            {/* 헤더 */}
                            <div className="td2-impact-header">
                                <h2 className="td2-impact-header-title">IMPACT Check 16</h2>
                                <p className="td2-impact-header-desc">
                                    본 진단은 우리 조직이 단순히 열심히 일하는 것을 넘어, 실질적인 성과(Impact)를 창출할 수 있는
                                    건전한 구조를 갖추고 있는지 점검하는 'Health Check' 도구입니다.
                                </p>
                            </div>
                            <div className="td2-impact-table-wrap">
                                <table className="td2-impact-table">
                                    <thead>
                                        <tr>
                                            <th className="td2-impact-no">No.</th>
                                            <th className="td2-impact-q" colSpan="2">Questionnaires</th>
                                            <th className="td2-impact-rating">매우 부정</th>
                                            <th className="td2-impact-rating"></th>
                                            <th className="td2-impact-rating"></th>
                                            <th className="td2-impact-rating"></th>
                                            <th className="td2-impact-rating">매우 긍정</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {impactQuestions.map(q =>
                                            q.type === "text" ? (
                                                <tr key={q.no} className="td2-impact-text-row">
                                                    <td className="td2-impact-no-cell">{q.no}</td>
                                                    <td className="td2-impact-q-cell">{q.text}</td>
                                                    <td colSpan={6} className="td2-impact-text-cell">
                                                        {missionModalData[`q${q.no}Text`] || ""}
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr key={q.no}>
                                                    <td className="td2-impact-no-cell">{q.no}</td>
                                                    <td className="td2-impact-q-cell" colSpan="2">{q.text}</td>
                                                    {[1, 2, 3, 4, 5].map(r => (
                                                        <td key={r} className="td2-impact-rating-cell">
                                                            <span className={`td2-impact-rating-dot ${missionModalData[`q${q.no}Score`] === r ? "td2-impact-selected" : ""}`}>
                                                                {r}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 정체성 설계 열람 모달 */}
            {showIdentityModal && identityModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowIdentityModal(false)}>
                    <div className="td2-identity-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{identityModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowIdentityModal(false)}>&times;</button>
                        </div>
                        <TeamSelectBar />
                        <div className="td2-identity-modal-body">
                            {/* 헤더 */}
                            <div className="td2-id-header">
                                <h2 className="td2-id-header-title">Strategic Identity Canvas</h2>
                                <p className="td2-id-header-desc">성과창출의 첫 걸음은, 무엇을 할 것인가가 아니라 달성하고자 하는 미래를 먼저 그리는 것입니다.
                                </p>
                                <p className="td2-id-header-desc">우리의 미래는 무엇입니까? 앞으로 우리가 도달해야 할 ‘새로운 미래’를 여러분의 언어로 제시해보십시오
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
                                                <span className="td2-id-card-value">{identityModalData.mission || ""}</span>
                                            </div>
                                        </div>
                                        <div className="td2-id-card">
                                            <div className="td2-id-card-title">비전 (Vision)</div>
                                            <div className="td2-id-card-body">
                                                <span className="td2-id-card-value">{identityModalData.vision || ""}</span>
                                            </div>
                                        </div>
                                        <div className="td2-id-card">
                                            <div className="td2-id-card-title">핵심가치 (Value)</div>
                                            <div className="td2-id-card-body">
                                                <span className="td2-id-card-value">{identityModalData.value || ""}</span>
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
                                                    <div className="td2-id-mini-body">{identityModalData.macro || ""}</div>
                                                </div>
                                                <div className="td2-id-mini-card">
                                                    <div className="td2-id-mini-title">기술<br/>(Tech)</div>
                                                    <div className="td2-id-mini-body">{identityModalData.tech || ""}</div>
                                                </div>
                                                <div className="td2-id-mini-card">
                                                    <div className="td2-id-mini-title">고객/사회<br/>(Customer)</div>
                                                    <div className="td2-id-mini-body">{identityModalData.customer || ""}</div>
                                                </div>
                                                <div className="td2-id-mini-card">
                                                    <div className="td2-id-mini-title">경쟁<br/>(Competitor)</div>
                                                    <div className="td2-id-mini-body">{identityModalData.competitor || ""}</div>
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
                                                    <div className="td2-id-mini-body">{identityModalData.capability || ""}</div>
                                                </div>
                                                <div className="td2-id-mini-card">
                                                    <div className="td2-id-mini-title">문화<br/>(Culture)</div>
                                                    <div className="td2-id-mini-body">{identityModalData.culture || ""}</div>
                                                </div>
                                                <div className="td2-id-mini-card">
                                                    <div className="td2-id-mini-title">구조<br/>(Structure)</div>
                                                    <div className="td2-id-mini-body">{identityModalData.structure || ""}</div>
                                                </div>
                                                <div className="td2-id-mini-card">
                                                    <div className="td2-id-mini-title">기타</div>
                                                    <div className="td2-id-mini-body">{identityModalData.etc || ""}</div>
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
                                                <span className="td2-id-card-value">{identityModalData.newMission || ""}</span>
                                            </div>
                                        </div>
                                        <div className="td2-id-card">
                                            <div className="td2-id-card-title td2-id-card-title-bold">New 비전 (Vision)</div>
                                            <div className="td2-id-card-body">
                                                <span className="td2-id-card-value">{identityModalData.newVision || ""}</span>
                                            </div>
                                        </div>
                                        <div className="td2-id-card">
                                            <div className="td2-id-card-title td2-id-card-title-bold">New 핵심가치 (Value)</div>
                                            <div className="td2-id-card-body">
                                                <span className="td2-id-card-value">{identityModalData.newValue || ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 성과경로 설계 열람 모달 */}
            {showFlowModal && flowModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowFlowModal(false)}>
                    <div className="td2-flow-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{flowModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowFlowModal(false)}>&times;</button>
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
                                <span className="td2-flow-vision-text">{flowModalData.newVision || ""}</span>
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
                                            {(flowModalData.goals || []).map((goal, idx) => (
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
                                            {(flowModalData.goals || []).map((goal, idx) => (
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
                                            {(flowModalData.goals || []).map((goal, idx) => (
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
            )}

            {/* 전술적 실행과제 열람 모달 */}
            {showQuickWinModal && quickWinModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowQuickWinModal(false)}>
                    <div className="td2-qw-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{quickWinModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowQuickWinModal(false)}>&times;</button>
                        </div>
                        <TeamSelectBar />
                        <WinCanvasModalBody
                            data={quickWinModalData}
                            sideLabel="전술적<br/>실행과제"
                            winColor="#25AEA7"
                            title="Quick Win Canvas"
                            titleSub="(전술적 실행과제)"
                            headerDescs={[
                                "Quick Win은 전략목표 달성을 가로막는 장애물을 빠르게 제거하여 단기적으로 가시적인 성과를 만들어내는 실행과제입니다.",
                                "이 Quick Win이 실행되지 않으면, 우리는 지금 만들 수 있는 성과를 계속 ‘놓치게’ 됩니다."
                            ]}
                        />
                    </div>
                </div>
            )}

            {/* 전략적 실행과제 열람 모달 */}
            {showBuildWinModal && buildWinModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowBuildWinModal(false)}>
                    <div className="td2-qw-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{buildWinModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowBuildWinModal(false)}>&times;</button>
                        </div>
                        <TeamSelectBar />
                        <WinCanvasModalBody
                            data={buildWinModalData}
                            sideLabel="전략적<br/>실행과제"
                            winColor="#5E4FB1"
                            title="Build Win Canvas"
                            titleSub="(전략적 실행과제)"
                            headerDescs={[
                                "Build Win은 단기 성과를 만드는 과제가 아니라, 성과가 반복되게 만드는 ‘체질’을 바꾸는 과제입니다.",
                                "이 Build Win이 성공하면, 우리는 한 차원 높은 성과창출 역량을 확보하게 됩니다."
                            ]}
                        />
                    </div>
                </div>
            )}

            {/* 실행과제 검증 열람 모달 (F-1, F-2) */}
            {showFundingModal && fundingModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowFundingModal(false)}>
                    <div className="td2-funding-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{fundingModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowFundingModal(false)}>&times;</button>
                        </div>
                        <TeamSelectBar />
                        <div className="td2-funding-modal-body">
                            {fundingModalData.length === 0 ? (
                                <div style={{ textAlign: "center", padding: 40, color: "#999" }}>등록된 평가 데이터가 없습니다.</div>
                            ) : (
                                <FundingModalBody data={fundingModalData} type={fundingModalType} teamId={missionModalTeamId} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 최종 결과 열람 모달 (F-3) */}
            {showResultModal && resultModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowResultModal(false)}>
                    <div className="td2-result-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{resultModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowResultModal(false)}>&times;</button>
                        </div>
                        <TeamSelectBar />
                        <FundingResultModalBody data={resultModalData} />
                    </div>
                </div>
            )}

            {/* 삭제된 팀 모달 */}
            {showDeletedModal && (
                <div className="td2-modal-overlay" onClick={() => setShowDeletedModal(false)}>
                    <div className="td2-modal-box" onClick={e => e.stopPropagation()}>
                        <h4>삭제된 팀 목록</h4>
                        <div className="td2-modal-list">
                            {deletedTeams.map(t => (
                                <label className="td2-modal-item" key={t.teamId}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDeleted.includes(t.teamId)}
                                        onChange={() => setSelectedDeleted(prev =>
                                            prev.includes(t.teamId) ? prev.filter(id => id !== t.teamId) : [...prev, t.teamId]
                                        )}
                                    />
                                    <span>{t.teamName}</span>
                                </label>
                            ))}
                        </div>
                        <div className="td2-modal-footer">
                            <button className="td2-btn-cancel" onClick={() => setShowDeletedModal(false)}>취소</button>
                            <button className="td2-btn-restore" onClick={handleRestore}>선택 팀 복구</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 팀/참여자 정보입력 모달 */}
            {showTeamModal && modalTeam && (
                <div className="td2-modal-overlay" onClick={() => setShowTeamModal(false)}>
                    <div className="td2-team-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-team-modal-header">
                            <span className="td2-team-modal-title">팀/참여자 정보입력</span>
                            <button className="td2-modify-close" onClick={() => setShowTeamModal(false)}>&times;</button>
                        </div>
                        <div className="td2-team-modal-body">
                            <h4 className="td2-team-modal-subtitle">참여자 정보입력</h4>

                            {/* 팀 기본정보 */}
                            <table className="td2-team-modal-info">
                                <tbody>
                                    <tr>
                                        <th>팀 번호</th>
                                        <td>{modalTeam.sequence}</td>
                                    </tr>
                                    <tr>
                                        <th>팀 이름</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="td2-team-modal-input"
                                                value={modalTeamName}
                                                onChange={e => setModalTeamName(e.target.value)}
                                                placeholder="팀 이름"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* 참여자 테이블 */}
                            <table className="td2-member-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: 40 }}></th>
                                        <th>번호</th>
                                        <th>User ID</th>
                                        <th>성명</th>
                                        <th>메일주소</th>
                                        <th>대표작성자</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalMembers.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: "center", padding: 20, color: "#999" }}>등록된 팀원이 없습니다.</td></tr>
                                    ) : (
                                        modalMembers.map((m, idx) => (
                                            <tr key={m.userId}>
                                                <td style={{ textAlign: "center" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(m.userId)}
                                                        onChange={() => handleMemberCheck(m.userId)}
                                                    />
                                                </td>
                                                <td>{idx + 1}</td>
                                                <td>{m.loginId}</td>
                                                <td className="td2-member-editable">{m.name || m.loginId}</td>
                                                <td className="td2-member-editable">{m.mail || "@"}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={m.writer === "1"}
                                                        onChange={() => {
                                                            setModalMembers(prev => prev.map(mb => ({
                                                                ...mb,
                                                                writer: mb.userId === m.userId ? "1" : null
                                                            })));
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* 하단 버튼 + 안내문구 */}
                            <div className="td2-team-modal-actions">
                                <div className="td2-team-modal-btns">
                                    <button className="td2-modal-btn-gray" onClick={handleDeleteMembers}>선택된 팀원삭제</button>
                                    <button className="td2-modal-btn-blue" onClick={handleAddMember}>팀원추가</button>
                                    <button className="td2-modal-btn-blue" onClick={handleSetWriter}>대표 작성자 지정</button>
                                    <button className="td2-modal-btn-blue" onClick={handleTeamModalSave}>입력완료</button>
                                </div>
                                <p className="td2-team-modal-note">CEO와 각 계정당 직책은 오직 1명만 가능합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 보고서(파일 다운) 모달 - 개별 보기용 */}
            {showReportModal && reportTeamId && (
                <div className="td2-modal-overlay">
                    <div className="td2-report-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">팀 보고서</span>
                            <button className="td2-modify-close" onClick={() => setShowReportModal(false)}>&times;</button>
                        </div>
                        <div className="td2-report-modal-body">
                            <ReportScreen teamId={reportTeamId} onClose={() => setShowReportModal(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* 전체 PDF 다운 - 숨겨진 렌더링 영역 */}
            {pdfRenderData && pdfRenderTeamCanvas && (
                <div style={{ position: "fixed", left: "-10000px", top: 0, width: 1000, overflow: "hidden" }}>
                    <ReportScreen
                        ref={pdfReportRef}
                        initialData={pdfRenderData}
                        hideControls
                        bulkMode
                        bulkCanvasData={pdfRenderTeamCanvas}
                        onReady={handlePdfReportReady}
                    />
                </div>
            )}

            {/* 전체 PDF 다운 - 진행상황 오버레이 */}
            {pdfAllRunning && (
                <div className="td2-modal-overlay" style={{ zIndex: 99999 }}>
                    <div className="td2-pdf-all-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">전체 PDF 다운로드</span>
                        </div>
                        <div className="td2-pdf-all-modal-body">
                            <div className="td2-pdf-all-progress">
                                <p>PDF 생성 중... ({pdfProgress.current}/{pdfProgress.total})</p>
                                <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{pdfProgress.teamName}</p>
                                <div className="td2-pdf-all-bar-bg" style={{ marginTop: 12 }}>
                                    <div className="td2-pdf-all-bar-fill" style={{ width: `${pdfProgress.total > 0 ? (pdfProgress.current / pdfProgress.total) * 100 : 0}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 전체 PDF 다운 완료/에러 알림 */}
            {pdfProgress.done && (
                <div className="td2-modal-overlay" onClick={() => setPdfProgress(prev => ({ ...prev, done: false }))}>
                    <div className="td2-pdf-all-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">전체 PDF 다운로드</span>
                            <button className="td2-modify-close" onClick={() => setPdfProgress(prev => ({ ...prev, done: false }))}>&times;</button>
                        </div>
                        <div className="td2-pdf-all-modal-body">
                            <div className="td2-pdf-all-progress">
                                <p className="td2-pdf-all-complete">다운로드가 완료되었습니다!</p>
                                <div style={{ textAlign: "center", marginTop: 16 }}>
                                    <button className="td2-btn-primary" onClick={() => setPdfProgress(prev => ({ ...prev, done: false }))}>닫기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {pdfProgress.error && (
                <div className="td2-modal-overlay" onClick={() => setPdfProgress(prev => ({ ...prev, error: null }))}>
                    <div className="td2-pdf-all-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">전체 PDF 다운로드</span>
                            <button className="td2-modify-close" onClick={() => setPdfProgress(prev => ({ ...prev, error: null }))}>&times;</button>
                        </div>
                        <div className="td2-pdf-all-modal-body">
                            <div className="td2-pdf-all-progress">
                                <p className="td2-pdf-all-error">{pdfProgress.error}</p>
                                <div style={{ textAlign: "center", marginTop: 16 }}>
                                    <button className="td2-btn-primary" onClick={() => setPdfProgress(prev => ({ ...prev, error: null }))}>닫기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 강의실 수정 모달 */}
            {showModifyModal && (
                <div className="td2-modal-overlay" onClick={() => setShowModifyModal(false)}>
                    <div className="td2-modify-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-modify-header">
                            <span className="td2-modify-title">
                                <i className="fa fa-hand-o-down" style={{ marginRight: 6 }}></i>
                                강의실 기본정보 입력
                            </span>
                            <button className="td2-modify-close" onClick={() => setShowModifyModal(false)}>&times;</button>
                        </div>
                        <div className="td2-modify-body">
                            <div className="td2-modify-row">
                                <label className="td2-modify-label">강의실 명</label>
                                <div className="td2-modify-field">
                                    <input
                                        type="text"
                                        className="td2-modify-input"
                                        value={modifyName}
                                        onChange={e => setModifyName(e.target.value)}
                                        placeholder="강의실 명"
                                    />
                                </div>
                            </div>
                            <div className="td2-modify-row">
                                <label className="td2-modify-label">강의대상</label>
                                <div className="td2-modify-field">
                                    <input
                                        type="text"
                                        className="td2-modify-input"
                                        value={modifyTarget}
                                        onChange={e => setModifyTarget(e.target.value)}
                                        placeholder="강의대상"
                                    />
                                </div>
                            </div>
                            <div className="td2-modify-row">
                                <label className="td2-modify-label">팀 수</label>
                                <div className="td2-modify-field">
                                    <span className="td2-modify-static">{gameInfo.numTeam} 팀</span>
                                </div>
                            </div>
                            <div className="td2-modify-row">
                                <label className="td2-modify-label">팀원 수</label>
                                <div className="td2-modify-field">
                                    <span className="td2-modify-static">1 팀</span>
                                </div>
                            </div>
                            <div className="td2-modify-row">
                                <label className="td2-modify-label">제출시간</label>
                                <div className="td2-modify-field">
                                    <div className="td2-modify-time-row">
                                        <select className="td2-deadline-select" value={modifyMonth} onChange={e => setModifyMonth(Number(e.target.value))}>
                                            {rangeArray(1, 12).map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <span className="td2-deadline-unit">월</span>
                                        <select className="td2-deadline-select" value={modifyDay} onChange={e => setModifyDay(Number(e.target.value))}>
                                            {rangeArray(1, 31).map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        <span className="td2-deadline-unit">일</span>
                                    </div>
                                    <div className="td2-modify-time-row" style={{ marginTop: 6 }}>
                                        <select className="td2-deadline-select" value={modifyHour} onChange={e => setModifyHour(Number(e.target.value))}>
                                            {rangeArray(0, 23).map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                        <span className="td2-deadline-unit">시</span>
                                        <select className="td2-deadline-select" value={modifyMinute} onChange={e => setModifyMinute(Number(e.target.value))}>
                                            {rangeArray(0, 5).map(m => <option key={m} value={m * 10}>{m * 10}</option>)}
                                        </select>
                                        <span className="td2-deadline-unit">분</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: "center", marginTop: 20 }}>
                                <button className="td2-btn-primary" onClick={handleModifySave}>강의실 수정</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeachDetail2Modals;
