import ReportScreen from "../../screens/teacher/ReportScreen";
import { FundingModalBody, FundingResultModalBody } from "../../constants/teachDetail2Constants";
import WinCanvasModalBody from "./modals/WinCanvasModalBody";
import MissionModal from "./modals/MissionModal";
import IdentityModal from "./modals/IdentityModal";
import FlowModal from "./modals/FlowModal";
import TeamModal from "./modals/TeamModal";
import ModifyModal from "./modals/ModifyModal";

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
    pdfReportRef, pdfRenderData, pdfRenderTeamCanvas, pdfRenderCanvasType, handlePdfReportReady,
    pdfAllRunning, pdfProgress, setPdfProgress,
    /* 강의실 수정 모달 */
    showModifyModal, setShowModifyModal, gameInfo,
    modifyName, setModifyName, modifyTarget, setModifyTarget, modifyMonth, setModifyMonth, modifyDay, setModifyDay,
    modifyHour, setModifyHour, modifyMinute, setModifyMinute,
    handleModifySave, rangeArray,
    /* 모달 내 팀 선택 */
    activeTeamId, handleModalTeamChange,
    teams,
    /* 미션 Rollback */
    handleRollback,
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
            <MissionModal
                show={showMissionModal} onClose={() => setShowMissionModal(false)}
                title={missionModalTitle} data={missionModalData} TeamSelectBar={TeamSelectBar}
                onRollback={handleRollback}
            />

            <IdentityModal
                show={showIdentityModal} onClose={() => setShowIdentityModal(false)}
                title={identityModalTitle} data={identityModalData} TeamSelectBar={TeamSelectBar}
                onRollback={handleRollback}
            />

            <FlowModal
                show={showFlowModal} onClose={() => setShowFlowModal(false)}
                title={flowModalTitle} data={flowModalData} TeamSelectBar={TeamSelectBar}
                onRollback={handleRollback}
            />

            {/* 전술적 실행과제 열람 모달 */}
            {showQuickWinModal && quickWinModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowQuickWinModal(false)}>
                    <div className="td2-qw-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{quickWinModalTitle}</span>
                            <div className="td2-modal-header-actions">
                                <button className="td2-rollback-btn" type="button" onClick={handleRollback}>
                                    <span className="td2-rollback-btn-icon">↶</span> Rollback
                                </button>
                                <button className="td2-modify-close" onClick={() => setShowQuickWinModal(false)}>&times;</button>
                            </div>
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
                                "이 Quick Win이 실행되지 않으면, 우리는 지금 만들 수 있는 성과를 계속 '놓치게' 됩니다."
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
                            <div className="td2-modal-header-actions">
                                <button className="td2-rollback-btn" type="button" onClick={handleRollback}>
                                    <span className="td2-rollback-btn-icon">↶</span> Rollback
                                </button>
                                <button className="td2-modify-close" onClick={() => setShowBuildWinModal(false)}>&times;</button>
                            </div>
                        </div>
                        <TeamSelectBar />
                        <WinCanvasModalBody
                            data={buildWinModalData}
                            sideLabel="전략적<br/>실행과제"
                            winColor="#5E4FB1"
                            title="Build Win Canvas"
                            titleSub="(전략적 실행과제)"
                            headerDescs={[
                                "Build Win은 단기 성과를 만드는 과제가 아니라, 성과가 반복되게 만드는 '체질'을 바꾸는 과제입니다.",
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
                            <div className="td2-modal-header-actions">
                                <button className="td2-rollback-btn" type="button" onClick={handleRollback}>
                                    <span className="td2-rollback-btn-icon">↶</span> Rollback
                                </button>
                                <button className="td2-modify-close" onClick={() => setShowFundingModal(false)}>&times;</button>
                            </div>
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

            <TeamModal
                show={showTeamModal} onClose={() => setShowTeamModal(false)}
                modalTeam={modalTeam} modalTeamName={modalTeamName} setModalTeamName={setModalTeamName}
                modalMembers={modalMembers} setModalMembers={setModalMembers} selectedMembers={selectedMembers}
                handleMemberCheck={handleMemberCheck} handleDeleteMembers={handleDeleteMembers}
                handleAddMember={handleAddMember} handleSetWriter={handleSetWriter} handleTeamModalSave={handleTeamModalSave}
            />

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
                        bulkCanvasType={pdfRenderCanvasType}
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

            <ModifyModal
                show={showModifyModal} onClose={() => setShowModifyModal(false)} gameInfo={gameInfo}
                modifyName={modifyName} setModifyName={setModifyName}
                modifyTarget={modifyTarget} setModifyTarget={setModifyTarget}
                modifyMonth={modifyMonth} setModifyMonth={setModifyMonth}
                modifyDay={modifyDay} setModifyDay={setModifyDay}
                modifyHour={modifyHour} setModifyHour={setModifyHour}
                modifyMinute={modifyMinute} setModifyMinute={setModifyMinute}
                handleModifySave={handleModifySave} rangeArray={rangeArray}
            />
        </>
    );
};

export default TeachDetail2Modals;
