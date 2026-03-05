import ReportScreen from "../../screens/teacher/ReportScreen";
import { FundingModalBody, FundingResultModalBody, impactQuestions } from "../../constants/teachDetail2Constants";

/* ── QuickWin / BuildWin 통합 모달 본문 ── */
const WinCanvasModalBody = ({ data, sideLabel }) => {
    const inputs = data.taskInputs || [];
    const activities = data.taskActivities || [];
    const maxRows = Math.max(inputs.length, activities.length, 1);

    return (
        <div className="td2-qw-modal-body">
            {/* 전략목표 Alignment */}
            <div className="td2-qw-align-row">
                <span className="td2-qw-align-label">전략목표 Alignment</span>
                <span className="td2-qw-align-value">{data.strategicGoal || ""}</span>
            </div>

            {/* 과제명 + 주요내용 */}
            <div className="td2-qw-task-row">
                <div className="td2-qw-task-side-label" dangerouslySetInnerHTML={{ __html: sideLabel }} />
                <div className="td2-qw-task-fields">
                    <div className="td2-qw-task-field">
                        <span className="td2-qw-task-label">과제명</span>
                        <span className="td2-qw-task-value highlight">{data.taskName || ""}</span>
                    </div>
                    <div className="td2-qw-task-field">
                        <span className="td2-qw-task-label">주요 내용</span>
                        <span className="td2-qw-task-value">{data.taskDescription || ""}</span>
                    </div>
                </div>
            </div>

            {/* 메인 테이블 */}
            <table className="td2-qw-table">
                <thead>
                    <tr>
                        <th className="td2-qw-th-situation" rowSpan="2">상황(Situation)</th>
                        <th className="td2-qw-th-input" colSpan="2">투입(Input)</th>
                        <th className="td2-qw-th-activity" colSpan="4">활동(Activity)</th>
                        <th className="td2-qw-th-output">산출(Outputs)</th>
                    </tr>
                    <tr>
                        <th className="td2-qw-th-sub">필요 자원</th>
                        <th className="td2-qw-th-sub">수량</th>
                        <th className="td2-qw-th-sub">추진 절차</th>
                        <th className="td2-qw-th-sub">주요 내용</th>
                        <th className="td2-qw-th-sub">소요기간</th>
                        <th className="td2-qw-th-sub">팀워크</th>
                        <th className="td2-qw-th-sub">산출물</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const rows = [];
                        for (let i = 0; i < maxRows; i++) {
                            rows.push(
                                <tr key={i}>
                                    {i === 0 && (
                                        <td rowSpan={maxRows} className="td2-qw-situation-cell">
                                            <div className="td2-qw-situation-top">
                                                <strong>위기의 신호</strong>
                                                <div>{data.crisisSignal || ""}</div>
                                            </div>
                                            <div className="td2-qw-situation-divider">Pain/Touch point</div>
                                            <div className="td2-qw-situation-bottom">
                                                {data.painTouchPoint || ""}
                                            </div>
                                        </td>
                                    )}
                                    <td>{inputs[i]?.resourceName || ""}</td>
                                    <td className="td2-qw-center">{inputs[i]?.quantity != null ? inputs[i].quantity : ""}</td>
                                    <td>{activities[i]?.processStep || ""}</td>
                                    <td>{activities[i]?.activityContent || ""}</td>
                                    <td>{activities[i]?.duration || ""}</td>
                                    {i === 0 && (
                                        <>
                                            <td rowSpan={maxRows} className="td2-qw-teamwork-cell">
                                                {data.teamwork?.activityTeamwork || ""}
                                            </td>
                                            <td rowSpan={maxRows} className="td2-qw-teamwork-cell">
                                                {data.teamwork?.workType || ""}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        }
                        return rows;
                    })()}
                </tbody>
            </table>

            {/* 성과(Outcomes) */}
            <div className="td2-qw-outcomes">
                <div className="td2-qw-outcomes-header">성과(Outcomes)</div>
                <div className="td2-qw-outcomes-grid">
                    <div className="td2-qw-outcomes-col">
                        <div className="td2-qw-outcomes-col-title">정성적 효과 (체감되는 변화)</div>
                        {(data.taskOutcomes || [])
                            .filter(o => o.outcomeType === "QUALITATIVE")
                            .sort((a, b) => a.orderNo - b.orderNo)
                            .map((o, i) => (
                                <div className="td2-qw-outcomes-item" key={o.outcomeNo || i}>
                                    {i + 1}. {o.outcomeContent || ""}
                                </div>
                            ))}
                        {(data.taskOutcomes || []).filter(o => o.outcomeType === "QUALITATIVE").length === 0 && (
                            <div className="td2-qw-outcomes-item">-</div>
                        )}
                    </div>
                    <div className="td2-qw-outcomes-col">
                        <div className="td2-qw-outcomes-col-title">정량적 효과 (측정가능한 변화)</div>
                        {(data.taskOutcomes || [])
                            .filter(o => o.outcomeType === "QUANTITATIVE")
                            .sort((a, b) => a.orderNo - b.orderNo)
                            .map((o, i) => (
                                <div className="td2-qw-outcomes-item" key={o.outcomeNo || i}>
                                    {i + 1}. {o.outcomeContent || ""}
                                </div>
                            ))}
                        {(data.taskOutcomes || []).filter(o => o.outcomeType === "QUANTITATIVE").length === 0 && (
                            <div className="td2-qw-outcomes-item">-</div>
                        )}
                    </div>
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
    pdfRenderTeamId, pdfReportRef, pdfRenderData, handlePdfReportReady,
    pdfAllRunning, pdfProgress, setPdfProgress,
    /* 강의실 수정 모달 */
    showModifyModal, setShowModifyModal, gameInfo,
    modifyName, setModifyName, modifyMonth, setModifyMonth, modifyDay, setModifyDay,
    modifyHour, setModifyHour, modifyMinute, setModifyMinute,
    handleModifySave, rangeArray,
}) => {
    return (
        <>
            {/* 미션 열람 모달 (ImpactCheck) */}
            {showMissionModal && missionModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowMissionModal(false)}>
                    <div className="td2-impact-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{missionModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowMissionModal(false)}>&times;</button>
                        </div>
                        <div className="td2-impact-modal-body">
                            <table className="td2-impact-table">
                                <thead>
                                    <tr>
                                        <th className="td2-impact-no">No.</th>
                                        <th className="td2-impact-q">Questionnaires</th>
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
                                                <td colSpan={5} className="td2-impact-text-cell">
                                                    {missionModalData[`q${q.no}Text`] || ""}
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={q.no}>
                                                <td className="td2-impact-no-cell">{q.no}</td>
                                                <td className="td2-impact-q-cell">{q.text}</td>
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
            )}

            {/* 정체성 설계 열람 모달 */}
            {showIdentityModal && identityModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowIdentityModal(false)}>
                    <div className="td2-identity-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{identityModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowIdentityModal(false)}>&times;</button>
                        </div>
                        <div className="td2-identity-modal-body">
                            {/* 3단 레이아웃 */}
                            <div className="td2-id-grid">
                                {/* 좌: 기존 가치체계 */}
                                <div className="td2-id-col">
                                    <div className="td2-id-section-header td2-id-legacy">기존 가치체계 (Current Legacy)</div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">미션 (Mission)</div>
                                        <div className="td2-id-card-body">{identityModalData.mission || ""}</div>
                                    </div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">비전 (Vision)</div>
                                        <div className="td2-id-card-body">{identityModalData.vision || ""}</div>
                                    </div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">핵심가치 (Value)</div>
                                        <div className="td2-id-card-body">{identityModalData.value || ""}</div>
                                    </div>
                                </div>

                                {/* 중: 외부의 위협 신호 + 내부의 한계점 */}
                                <div className="td2-id-col-center">
                                    <div className="td2-id-section-header td2-id-threat">외부의 위협 신호 (External Threats)</div>
                                    <div className="td2-id-threat-grid">
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">정책/경제</div>
                                            <div className="td2-id-mini-body">{identityModalData.macro || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">기술</div>
                                            <div className="td2-id-mini-body">{identityModalData.tech || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">고객/사회</div>
                                            <div className="td2-id-mini-body">{identityModalData.customer || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">경쟁</div>
                                            <div className="td2-id-mini-body">{identityModalData.competitor || ""}</div>
                                        </div>
                                    </div>

                                    <div className="td2-id-section-header td2-id-threat" style={{ marginTop: 12 }}>내부의 한계점 (Internal Limits)</div>
                                    <div className="td2-id-threat-grid">
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">역량</div>
                                            <div className="td2-id-mini-body">{identityModalData.capability || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">문화</div>
                                            <div className="td2-id-mini-body">{identityModalData.culture || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">구조</div>
                                            <div className="td2-id-mini-body">{identityModalData.structure || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">기타</div>
                                            <div className="td2-id-mini-body">{identityModalData.etc || ""}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 우: 미래 방향성 */}
                                <div className="td2-id-col">
                                    <div className="td2-id-section-header td2-id-new">미래 방향성 (New Identity)</div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">New 미션 (Mission)</div>
                                        <div className="td2-id-card-body">{identityModalData.newMission || ""}</div>
                                    </div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">New 비전 (Vision)</div>
                                        <div className="td2-id-card-body">{identityModalData.newVision || ""}</div>
                                    </div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">New 핵심가치 (Value)</div>
                                        <div className="td2-id-card-body">{identityModalData.newValue || ""}</div>
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
                        <div className="td2-flow-modal-body">
                            {/* New Vision 배너 */}
                            <div className="td2-flow-vision">
                                <span className="td2-flow-vision-label">New Vision</span>
                                <span className="td2-flow-vision-text">{flowModalData.newVision || ""}</span>
                            </div>

                            {/* 전략목표 카드 */}
                            <div className="td2-flow-section-title">1. 3대 전략목표 (Strategic Goal)</div>
                            <div className="td2-flow-goal-cards">
                                {(flowModalData.goals || []).map((goal, idx) => (
                                    <div className="td2-flow-goal-card" key={goal.goalId || idx}>
                                        <div className="td2-flow-goal-title">{goal.goalTitle || `전략목표 ${idx + 1}`}</div>
                                        <div className="td2-flow-goal-desc">{goal.goalDescription || ""}</div>
                                    </div>
                                ))}
                            </div>

                            {/* 전술적 성과 */}
                            <div className="td2-flow-section-title">2. 전술적 성과 (성과)</div>
                            <div className="td2-flow-tables">
                                {(flowModalData.goals || []).map((goal, idx) => (
                                    <table className="td2-flow-table" key={`t-${goal.goalId || idx}`}>
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
                                                    <td>{t.tacticalMetric || ""}</td>
                                                    <td>{t.tacticalGoal || ""}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ))}
                            </div>

                            {/* 전략적 활동 */}
                            <div className="td2-flow-section-title">3. 전략적 활동 (체질)</div>
                            <div className="td2-flow-tables">
                                {(flowModalData.goals || []).map((goal, idx) => (
                                    <table className="td2-flow-table" key={`s-${goal.goalId || idx}`}>
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
                                                    <td>{a.activityMetric || ""}</td>
                                                    <td>{a.interCriteria || ""}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ))}
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
                        <WinCanvasModalBody data={quickWinModalData} sideLabel="전술적<br/>실행과제" />
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
                        <WinCanvasModalBody data={buildWinModalData} sideLabel="전략적<br/>실행과제" />
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
                <div className="td2-modal-overlay" onClick={() => setShowReportModal(false)}>
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
            {pdfRenderTeamId && (
                <div style={{ position: "fixed", left: "-10000px", top: 0, width: 1000, height: 1415, overflow: "hidden" }}>
                    <ReportScreen ref={pdfReportRef} teamId={pdfRenderTeamId} initialData={pdfRenderData} hideControls onReady={handlePdfReportReady} />
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
