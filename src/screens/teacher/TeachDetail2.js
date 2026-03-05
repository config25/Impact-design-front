import { useState, useEffect, useRef, useCallback } from "react";
import { getTeachDetail, updateClass, endClass } from "../../services/teachClassService";
import { saveStep, addTeam, addEvaluationTeam, deleteTeam, getDeletedTeams, restoreTeam, getTeamInfo, updateTeamInfo, deleteTeamMembers, setTeamWriter, addTeamMember } from "../../services/teachTeamService";
import { getSubmissionList, getImpactCheckByTeam, getIdentityCanvasByTeam, getFlowCanvasByTeam, getQuickWinByTeam, getBuildWinByTeam, getFundingByTeam, getFundingResultByTeam } from "../../services/teachSubmissionService";
import { getLogoUrl } from "../../utils/logoUtil";
import { getBulkReport } from "../../services/reportService";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { stepConfig, missionRows, formatDate, stepArrToChecked } from "../../constants/teachDetail2Constants";
import TeachDetail2Modals from "../../components/teacher/TeachDetail2Modals";
import "./TeachDetail2.css";
import "../ImpactReviewScreen.css";

const TeachDetail2 = ({ onNavigate, params }) => {
    const [gameId] = useState(params?.gameId);
    const [gameInfo, setGameInfo] = useState(null);
    const [teams, setTeams] = useState([]);
    const [checkedSteps, setCheckedSteps] = useState([]);
    const [loading, setLoading] = useState(true);

    /* 미션 열람 모달 */
    const [showMissionModal, setShowMissionModal] = useState(false);
    const [missionModalTitle, setMissionModalTitle] = useState("");
    const [missionModalData, setMissionModalData] = useState(null);
    const [missionModalTeamId, setMissionModalTeamId] = useState(null);

    /* 정체성 설계 열람 모달 */
    const [showIdentityModal, setShowIdentityModal] = useState(false);
    const [identityModalTitle, setIdentityModalTitle] = useState("");
    const [identityModalData, setIdentityModalData] = useState(null);

    /* 성과경로 설계 열람 모달 */
    const [showFlowModal, setShowFlowModal] = useState(false);
    const [flowModalTitle, setFlowModalTitle] = useState("");
    const [flowModalData, setFlowModalData] = useState(null);

    /* 전술적 실행과제 열람 모달 */
    const [showQuickWinModal, setShowQuickWinModal] = useState(false);
    const [quickWinModalTitle, setQuickWinModalTitle] = useState("");
    const [quickWinModalData, setQuickWinModalData] = useState(null);

    /* 전략적 실행과제 열람 모달 */
    const [showBuildWinModal, setShowBuildWinModal] = useState(false);
    const [buildWinModalTitle, setBuildWinModalTitle] = useState("");
    const [buildWinModalData, setBuildWinModalData] = useState(null);

    /* 실행과제 검증 열람 모달 (F-1, F-2) */
    const [showFundingModal, setShowFundingModal] = useState(false);
    const [fundingModalTitle, setFundingModalTitle] = useState("");
    const [fundingModalData, setFundingModalData] = useState(null);
    const [fundingModalType, setFundingModalType] = useState("quick");

    /* 최종 결과 열람 모달 (F-3) */
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultModalTitle, setResultModalTitle] = useState("");
    const [resultModalData, setResultModalData] = useState(null);

    const [showDeletedModal, setShowDeletedModal] = useState(false);
    const [deletedTeams, setDeletedTeams] = useState([]);
    const [selectedDeleted, setSelectedDeleted] = useState([]);

    /* 팀/참여자 정보입력 모달 */
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [modalTeam, setModalTeam] = useState(null);
    const [modalTeamName, setModalTeamName] = useState("");
    const [modalMembers, setModalMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    /* 보고서(파일 다운) 모달 */
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportTeamId, setReportTeamId] = useState(null);

    /* 전체 PDF 다운 */
    const [pdfAllRunning, setPdfAllRunning] = useState(false);
    const [pdfProgress, setPdfProgress] = useState({ current: 0, total: 0, teamName: "", done: false, error: null });
    const pdfReportRef = useRef(null);
    const pdfReadyResolveRef = useRef(null);
    const [pdfRenderTeamId, setPdfRenderTeamId] = useState(null);
    const [pdfRenderData, setPdfRenderData] = useState(null);

    /* 강의실 수정 모달 */
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [modifyName, setModifyName] = useState("");
    const [modifyMonth, setModifyMonth] = useState(new Date().getMonth() + 1);
    const [modifyDay, setModifyDay] = useState(new Date().getDate());
    const [modifyHour, setModifyHour] = useState(1);
    const [modifyMinute, setModifyMinute] = useState(0);

    /* 전체 PDF 다운로드 */
    const handlePdfReportReady = useCallback(() => {
        if (pdfReadyResolveRef.current) {
            pdfReadyResolveRef.current();
            pdfReadyResolveRef.current = null;
        }
    }, []);

    const handleDownloadAllPDF = useCallback(async () => {
        if (teams.length === 0) return;
        setPdfAllRunning(true);
        setPdfProgress({ current: 0, total: teams.length, teamName: "데이터 로딩 중...", done: false, error: null });

        // 1) 벌크 API로 전체 리포트 데이터 한번에 가져오기
        const bulkResult = await getBulkReport(gameId);
        if (!bulkResult.success) {
            setPdfProgress(prev => ({ ...prev, error: bulkResult.message }));
            setPdfAllRunning(false);
            return;
        }
        const allReports = bulkResult.data; // List<ReportResponse>

        const zip = new JSZip();

        // 2) 데이터를 이미 가지고 있으므로 PDF 렌더만 순차 실행
        for (let i = 0; i < allReports.length; i++) {
            const report = allReports[i];
            const teamName = report.teamName || `팀${i + 1}`;
            setPdfProgress(prev => ({ ...prev, current: i + 1, teamName }));

            // 이전 리포트 언마운트 → 새 데이터로 마운트
            setPdfRenderTeamId(null);
            setPdfRenderData(null);
            await new Promise(r => setTimeout(r, 100));
            setPdfRenderData(report);
            setPdfRenderTeamId(report.teamId);

            // onReady 대기 (렌더 완료만 대기, API 호출 없음)
            await new Promise((resolve) => {
                pdfReadyResolveRef.current = resolve;
                setTimeout(() => { pdfReadyResolveRef.current = null; resolve(); }, 30000);
            });

            try {
                const blob = await pdfReportRef.current?.generatePDFBlob();
                if (blob) {
                    zip.file(`${teamName}_Report.pdf`, blob);
                }
            } catch (err) {
                console.error(`PDF 생성 실패 (${teamName}):`, err);
            }
        }

        setPdfRenderTeamId(null);
        setPdfRenderData(null);

        try {
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${gameInfo?.name || "강의실"}_전체보고서.zip`);
            setPdfProgress(prev => ({ ...prev, done: true }));
        } catch {
            setPdfProgress(prev => ({ ...prev, error: "ZIP 생성에 실패했습니다." }));
        }
        setPdfAllRunning(false);
    }, [teams, gameInfo, gameId]);

    /* 제출 기한 */
    const now = new Date();
    const [deadlineYear, setDeadlineYear] = useState(now.getFullYear());
    const [deadlineMonth, setDeadlineMonth] = useState(now.getMonth() + 1);
    const [deadlineDay, setDeadlineDay] = useState(now.getDate());
    const [deadlineHour, setDeadlineHour] = useState(1);
    const [deadlineMinute, setDeadlineMinute] = useState(0);

    /* API 데이터 로드 */
    useEffect(() => {
        if (!gameId) return;
        const fetchData = async () => {
            const [detailResult, submissionResult] = await Promise.all([
                getTeachDetail(gameId),
                getSubmissionList(gameId),
            ]);

            if (detailResult.success) {
                const d = detailResult.data;
                setGameInfo({
                    name: d.name,
                    numTeam: d.numTeam,
                    startdate: d.mission ? formatDate(d.mission.startdate) : "-",
                    enddate: d.mission ? formatDate(d.mission.enddate) : "-",
                    code: d.code,
                    logoUrl: getLogoUrl(d.gameLogo),
                });

                // 제출 현황 데이터를 teamId 기준으로 매핑
                const submissionMap = {};
                if (submissionResult.success) {
                    (submissionResult.data || []).forEach(s => {
                        submissionMap[s.teamId] = s;
                    });
                }

                setTeams((d.teams || []).map(t => {
                    const sub = submissionMap[t.teamId] || {};
                    return {
                        teamId: t.teamId,
                        teamName: t.teamName,
                        numUser: t.numUser,
                        submitA: sub.submitA || t.submitA,
                        submitB: sub.submitB || t.submitB,
                        submitC: sub.submitC || t.submitC,
                        submitD: sub.submitD || t.submitD,
                        submitE: sub.submitE || t.submitE,
                        submitF: sub.submitF || t.submitF,
                    };
                }));
                setCheckedSteps(stepArrToChecked(d.stepArr));

                // 제출 기한 초기값 (mission enddate 기준)
                if (d.mission?.enddate) {
                    const ed = new Date(d.mission.enddate);
                    setDeadlineYear(ed.getFullYear());
                    setDeadlineMonth(ed.getMonth() + 1);
                    setDeadlineDay(ed.getDate());
                    setDeadlineHour(ed.getHours());
                    setDeadlineMinute(Math.floor(ed.getMinutes() / 10) * 10);
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [gameId]);

    /* 강의실 수정 모달 열기 */
    const handleOpenModify = () => {
        if (gameInfo) setModifyName(gameInfo.name);
        setShowModifyModal(true);
    };

    /* 강의실 수정 저장 */
    const handleModifySave = async () => {
        if (!modifyName.trim()) {
            alert("강의실 명을 입력해주세요.");
            return;
        }

        const year = new Date().getFullYear();
        const mm = String(modifyMonth).padStart(2, "0");
        const dd = String(modifyDay).padStart(2, "0");
        const hh = String(modifyHour).padStart(2, "0");
        const min = String(modifyMinute).padStart(2, "0");
        const enddate = `${year}-${mm}-${dd} ${hh}:${min}`;

        const result = await updateClass(gameId, {
            name: modifyName,
            enddate: enddate,
        });

        if (result.success) {
            alert("강의실이 수정되었습니다.");
            setGameInfo(prev => ({ ...prev, name: modifyName }));
            setShowModifyModal(false);
        } else {
            alert(result.message);
        }
    };

    /* 강의실 종료 */
    const handleEndGame = async () => {
        if (!window.confirm("강의실을 종료하시겠습니까?")) return;

        const result = await endClass(gameId);
        if (result.success) {
            alert("강의실이 종료되었습니다.");
            onNavigate("teach_list");
        } else {
            alert(result.message);
        }
    };

    /* 단계 체크박스 */
    const handleStepCheck = (value) => {
        setCheckedSteps(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    /* 단계 저장 - checkedSteps → step 문자열 변환 ("A-1,B-1,F-1,F-2") */
    const handleStepSave = async () => {
        if (checkedSteps.length === 0) {
            alert("단계를 선택해주세요.");
            return;
        }
        if (!window.confirm("저장하시겠습니까?")) return;

        const step = checkedSteps.join(",");

        const result = await saveStep(gameId, step);
        if (result.success) {
            alert("저장되었습니다.");
        } else {
            alert(result.message);
        }
    };

    /* 팀 추가 */
    const handleTeamAdd = async () => {
        if (!window.confirm("팀을 추가하시겠습니까?")) return;

        const result = await addTeam(gameId);
        if (result.success) {
            alert("팀이 추가되었습니다.");
            await refreshTeams();
        } else {
            alert(result.message);
        }
    };

    /* 팀/참여자 정보입력 모달 열기 */
    const handleOpenTeamModal = async (teamId) => {
        const result = await getTeamInfo(teamId);
        if (result.success) {
            setModalTeam(result.data);
            setModalTeamName(result.data.teamName || "");
            setModalMembers(result.data.members || []);
            setSelectedMembers([]);
            setShowTeamModal(true);
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 팀원 체크박스 */
    const handleMemberCheck = (userId) => {
        setSelectedMembers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    /* 모달 - 선택된 팀원 삭제 */
    const handleDeleteMembers = async () => {
        if (selectedMembers.length === 0) {
            alert("삭제할 팀원을 선택해주세요.");
            return;
        }
        if (!window.confirm(`선택된 ${selectedMembers.length}명의 팀원을 삭제하시겠습니까?`)) return;

        const result = await deleteTeamMembers(selectedMembers);
        if (result.success) {
            setModalMembers(prev => prev.filter(m => !selectedMembers.includes(m.userId)));
            setSelectedMembers([]);
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 팀원 추가 */
    const handleAddMember = async () => {
        const result = await addTeamMember(modalTeam.teamId, gameId);
        if (result.success) {
            alert(`팀원이 추가되었습니다. (ID: ${result.loginId})`);
            const refreshed = await getTeamInfo(modalTeam.teamId);
            if (refreshed.success) setModalMembers(refreshed.data.members || []);
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 대표 작성자 지정 (대표작성자 체크박스 기준) */
    const handleSetWriter = async () => {
        const writerMember = modalMembers.find(m => m.writer === "1");
        if (!writerMember) {
            alert("대표 작성자로 지정할 팀원의 체크박스를 선택해주세요.");
            return;
        }
        const result = await setTeamWriter(modalTeam.teamId, writerMember.userId);
        if (result.success) {
            alert("대표 작성자가 지정되었습니다.");
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 입력완료 (저장) */
    const handleTeamModalSave = async () => {
        const result = await updateTeamInfo(modalTeam.teamId, {
            teamName: modalTeamName,
            sequence: modalTeam.sequence,
            isDoing: modalTeam.isDoing,
            aiPlay: 0,
        });

        if (result.success) {
            alert("저장되었습니다.");
            setShowTeamModal(false);
            await refreshTeams();
        } else {
            alert(result.message);
        }
    };

    /* 미션 아이템 클릭 (팀별 열람) */
    const handleMissionClick = async (missionCode, teamId, teamName) => {
        if (missionCode === "A-1") {
            const result = await getImpactCheckByTeam(teamId);
            if (result.success) {
                setMissionModalTitle(`${teamName} - 성과관리 현황진단`);
                setMissionModalData(result.data);
                setMissionModalTeamId(teamId);
                setShowMissionModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "B-1") {
            const result = await getIdentityCanvasByTeam(teamId);
            if (result.success) {
                setIdentityModalTitle(`${teamName} - 정체성 설계`);
                setIdentityModalData(result.data);
                setShowIdentityModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "C-1") {
            const result = await getFlowCanvasByTeam(teamId);
            if (result.success) {
                setFlowModalTitle(`${teamName} - 성과경로 설계`);
                setFlowModalData(result.data);
                setShowFlowModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "D-1") {
            const result = await getQuickWinByTeam(teamId);
            if (result.success) {
                setQuickWinModalTitle(`${teamName} - 전술적 실행과제`);
                setQuickWinModalData(result.data);
                setShowQuickWinModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "E-1") {
            const result = await getBuildWinByTeam(teamId);
            if (result.success) {
                setBuildWinModalTitle(`${teamName} - 전략적 실행과제`);
                setBuildWinModalData(result.data);
                setShowBuildWinModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "F-1") {
            const result = await getFundingByTeam("quick", teamId);
            if (result.success) {
                setFundingModalTitle(`${teamName} - Quick Win 평가`);
                setFundingModalData(result.data);
                setFundingModalType("quick");
                setShowFundingModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "F-2") {
            const result = await getFundingByTeam("build", teamId);
            if (result.success) {
                setFundingModalTitle(`${teamName} - Build Win 평가`);
                setFundingModalData(result.data);
                setFundingModalType("build");
                setShowFundingModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "F-3") {
            const result = await getFundingResultByTeam(teamId);
            if (result.success) {
                setResultModalTitle(`${teamName} - 최종 결과 확인`);
                setResultModalData(result.data);
                setShowResultModal(true);
            } else {
                alert(result.message);
            }
        } else {
            alert("준비 중인 기능입니다.");
        }
    };

    /* 팀 목록 갱신 헬퍼 */
    const refreshTeams = async () => {
        const [refreshed, submissionResult] = await Promise.all([
            getTeachDetail(gameId),
            getSubmissionList(gameId),
        ]);
        if (refreshed.success) {
            const submissionMap = {};
            if (submissionResult.success) {
                (submissionResult.data || []).forEach(s => {
                    submissionMap[s.teamId] = s;
                });
            }
            setTeams((refreshed.data.teams || []).map(t => {
                const sub = submissionMap[t.teamId] || {};
                return {
                    teamId: t.teamId,
                    teamName: t.teamName,
                    numUser: t.numUser,
                    submitA: sub.submitA || t.submitA,
                    submitB: sub.submitB || t.submitB,
                    submitC: sub.submitC || t.submitC,
                    submitD: sub.submitD || t.submitD,
                    submitE: sub.submitE || t.submitE,
                    submitF: sub.submitF || t.submitF,
                };
            }));
            setGameInfo(prev => ({ ...prev, numTeam: refreshed.data.numTeam }));
        }
    };

    /* 평가팀 추가 */
    const handleEvalTeamAdd = async () => {
        if (!window.confirm("평가팀을 추가하시겠습니까?")) return;

        const result = await addEvaluationTeam(gameId);
        if (result.success) {
            alert("평가팀이 추가되었습니다.");
            await refreshTeams();
        } else {
            alert(result.message);
        }
    };

    /* 팀 삭제 */
    const handleDeleteTeam = async (team) => {
        if (!window.confirm(`'${team.teamName}' 팀을 삭제하시겠습니까?\n\n※ 삭제된 팀은 '삭제된 팀 보기'에서 복구할 수 있습니다.`)) return;

        const result = await deleteTeam(team.teamId, gameId);
        if (result.success) {
            alert("팀이 삭제되었습니다.");
            await refreshTeams();
        } else {
            alert(result.message);
        }
    };

    /* 삭제된 팀 보기 */
    const handleShowDeleted = async () => {
        const result = await getDeletedTeams(gameId);
        if (result.success) {
            if (result.data.length === 0) {
                alert("삭제된 팀이 없습니다.");
                return;
            }
            setDeletedTeams(result.data);
            setSelectedDeleted([]);
            setShowDeletedModal(true);
        } else {
            alert(result.message);
        }
    };

    /* 삭제된 팀 복구 */
    const handleRestore = async () => {
        if (selectedDeleted.length === 0) {
            alert("복구할 팀을 선택해주세요.");
            return;
        }
        const names = deletedTeams.filter(t => selectedDeleted.includes(t.teamId)).map(t => t.teamName);
        if (!window.confirm(`${names.join(", ")} 팀을 복구하시겠습니까?`)) return;

        let successCount = 0;
        for (const teamId of selectedDeleted) {
            const result = await restoreTeam(teamId, gameId);
            if (result.success) successCount++;
        }

        if (successCount > 0) {
            alert(`${successCount}개 팀이 복구되었습니다.`);
            setShowDeletedModal(false);
            await refreshTeams();
        } else {
            alert("팀 복원에 실패했습니다.");
        }
    };

    /* 다음 단계 시작 */
    const handleNextStep = () => {
        if (window.confirm("다음 단계를 시작하시겠습니까?")) {
            // TODO: API 호출
            alert("다음 단계가 시작되었습니다.");
        }
    };

    const renderSubmitStatus = (status) => {
        const isSubmit = status === "Y" || status === "제출";
        return (
            <span className={isSubmit ? "td2-status-submit" : "td2-status-not"}>
                {isSubmit ? "제출" : "미제출"}
            </span>
        );
    };

    const rangeArray = (start, end) => {
        const arr = [];
        for (let i = start; i <= end; i++) arr.push(i);
        return arr;
    };

    if (loading) {
        return <div className="td2-container" style={{ padding: 40, textAlign: "center", color: "#999" }}>로딩 중...</div>;
    }

    if (!gameInfo) {
        return <div className="td2-container" style={{ padding: 40, textAlign: "center", color: "#999" }}>강의실 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="td2-container">
            {/* 상단바: 강의실 정보 + 종료 버튼 */}
            <div className="td2-topbar">
                <span className="td2-topbar-label">강의실 정보</span>
                <span className="td2-topbar-name">{gameInfo.name}</span>
                <button className="td2-btn-end" onClick={handleEndGame}>강의실 종료</button>
            </div>

            {/* 2컬럼: 기본정보 + 진행현황 */}
            <div className="td2-row">
                {/* 좌: 강의실 기본정보 + 제출기한 설정 */}
                <div className="td2-col-left">
                    {/* 강의실 기본정보 */}
                    <div className="td2-panel">
                        <div className="td2-panel-heading">
                            <span className="td2-panel-title">강의실 기본정보</span>
                        </div>
                        <div className="td2-panel-body">
                            <table className="td2-info-table">
                                <tbody>
                                    <tr><th>강의실</th><td>{gameInfo.name}</td></tr>
                                    <tr><th>팀 수</th><td>{gameInfo.numTeam}</td></tr>
                                    <tr><th>교육시간</th><td>{gameInfo.startdate} ~ {gameInfo.enddate}</td></tr>
                                    <tr><th>강의실 코드</th><td>{gameInfo.code}</td></tr>
                                    <tr>
                                        <th>강의실 로고</th>
                                        <td>
                                            {gameInfo.logoUrl && <img src={gameInfo.logoUrl} alt="logo" className="td2-logo-img" />}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="td2-panel-footer">
                            <button className="td2-btn-primary" onClick={handleOpenModify}>강의실 수정</button>
                        </div>
                    </div>

                    {/* 제출 기한 설정 */}
                    <div className="td2-panel">
                        <div className="td2-panel-heading">
                            <span className="td2-panel-title">제출 기한 설정</span>
                        </div>
                        <div className="td2-deadline-body">
                            <div className="td2-deadline-row">
                                <span className="td2-deadline-label">제출시간</span>
                                <select className="td2-deadline-select" value={deadlineYear} onChange={e => setDeadlineYear(Number(e.target.value))}>
                                    {rangeArray(now.getFullYear(), now.getFullYear() + 5).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <span className="td2-deadline-unit">년</span>
                                <select className="td2-deadline-select" value={deadlineMonth} onChange={e => setDeadlineMonth(Number(e.target.value))}>
                                    {rangeArray(1, 12).map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <span className="td2-deadline-unit">월</span>
                                <select className="td2-deadline-select" value={deadlineDay} onChange={e => setDeadlineDay(Number(e.target.value))}>
                                    {rangeArray(1, 31).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <span className="td2-deadline-unit">일</span>
                                <select className="td2-deadline-select" value={deadlineHour} onChange={e => setDeadlineHour(Number(e.target.value))}>
                                    {rangeArray(0, 23).map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                                <span className="td2-deadline-unit">시</span>
                                <select className="td2-deadline-select" value={deadlineMinute} onChange={e => setDeadlineMinute(Number(e.target.value))}>
                                    {rangeArray(0, 5).map(m => (
                                        <option key={m} value={m * 10}>{m * 10}</option>
                                    ))}
                                </select>
                                <span className="td2-deadline-unit">분</span>
                            </div>
                        </div>
                        <div className="td2-panel-footer">
                            <button className="td2-btn-primary" onClick={handleNextStep}>다음 단계 시작</button>
                        </div>
                    </div>
                </div>

                {/* 우: 진행 현황 */}
                <div className="td2-col-right">
                    <div className="td2-panel">
                        <div className="td2-panel-heading">
                            <span className="td2-panel-title">진행 현황</span>
                            <button className="td2-btn-pdf-all" onClick={handleDownloadAllPDF} disabled={pdfAllRunning}>
                                {pdfAllRunning ? "생성 중..." : "전체 PDF 다운"}
                            </button>
                        </div>
                        <div className="td2-panel-body">
                            <div className="td2-scroll-area">
                                <table className="td2-progress-table">
                                    <thead>
                                        <tr>
                                            <th>팀명</th>
                                            <th>참여자수</th>
                                            <th>진행 현황</th>
                                            <th>미션 제출본 다운</th>
                                            <th>미션 팀 제출 파일</th>
                                            <th>삭제</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teams.length === 0 ? (
                                            <tr><td colSpan="6" style={{ textAlign: "center", padding: 20, color: "#999" }}>등록된 팀이 없습니다.</td></tr>
                                        ) : teams.map(t => (
                                            <tr key={t.teamId}>
                                                <td>
                                                    <button className="td2-team-link" onClick={() => handleOpenTeamModal(t.teamId)}>
                                                        {t.teamName}
                                                    </button>
                                                </td>
                                                <td>{t.numUser}명</td>
                                                <td>
                                                    [A]{renderSubmitStatus(t.submitA)} / [B]{renderSubmitStatus(t.submitB)} / [C]{renderSubmitStatus(t.submitC)}
                                                    <br />
                                                    [D]{renderSubmitStatus(t.submitD)} / [E]{renderSubmitStatus(t.submitE)} / [F]{renderSubmitStatus(t.submitF)}
                                                </td>
                                                <td>
                                                    <button className="td2-btn-pptx" style={{ marginRight: 5 }}>PPTX</button>
                                                    <button className="td2-btn-pdf">PDF</button>
                                                </td>
                                                <td>
                                                    <button className="td2-btn-file-down" onClick={() => { setReportTeamId(t.teamId); setShowReportModal(true); }}>파일 다운</button>
                                                </td>
                                                <td>
                                                    <button className="td2-btn-delete" onClick={() => handleDeleteTeam(t)} title="팀 삭제">
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="td2-panel-footer">
                            <div className="td2-team-btns">
                                <button className="td2-btn-default" onClick={handleTeamAdd}>팀 추가</button>
                                <button className="td2-btn-default" onClick={() => onNavigate("student_list", { gameId })}>교육생 목록</button>
                                <button className="td2-btn-default" onClick={handleEvalTeamAdd}>평가팀 추가</button>
                                <button className="td2-btn-warning" onClick={handleShowDeleted}>삭제된 팀 보기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 다음 단계 설정 */}
            <div className="td2-panel">
                <div className="td2-panel-heading">
                    <span className="td2-panel-title">다음 단계 설정</span>
                </div>
                <div className="td2-step-body">
                    {stepConfig.map(group => (
                        <div className="td2-step-group" key={group.key}>
                            <div className={`td2-step-group-title ${group.colorClass}`}>{group.label}</div>
                            <div className="td2-step-checks">
                                {group.items.map(item => (
                                    <label className="td2-step-check-label" key={item.value}>
                                        <input
                                            type="checkbox"
                                            checked={checkedSteps.includes(item.value)}
                                            onChange={() => handleStepCheck(item.value)}
                                        />
                                        {item.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div style={{ textAlign: "center", marginTop: 10 }}>
                        <button className="td2-btn-primary" onClick={handleStepSave}>저장</button>
                    </div>
                </div>
            </div>

            {/* 미션확인 */}
            <div className="td2-mission-section">
                <div className="td2-mission-header">
                    <div>
                        <h3 className="td2-mission-title">미션확인</h3>
                        <p className="td2-mission-desc">팀을 선택한 후 미션 버튼을 클릭하여 상세내용을 확인하세요.</p>
                    </div>
                    <div className="td2-mission-team-select">
                        <span className="td2-mission-team-label">팀 선택</span>
                        <select
                            className="td2-deadline-select"
                            value={missionModalTeamId || ""}
                            onChange={e => setMissionModalTeamId(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">선택</option>
                            {teams.map(t => (
                                <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {missionRows.map(row => (
                    <div className="td2-mission-row" key={row.code}>
                        <div className={`td2-mission-head ${row.bgHead}`}>
                            <span className="td2-mission-head-code">{row.code}</span>
                            <span className="td2-mission-head-name">{row.name}</span>
                        </div>
                        <div className="td2-mission-items">
                            {row.items.map(item => (
                                <div
                                    className={`td2-mission-item td2-mission-clickable ${row.bgItem}`}
                                    key={item.code}
                                    onClick={() => {
                                        if (!missionModalTeamId) {
                                            alert("팀을 먼저 선택해주세요.");
                                            return;
                                        }
                                        const team = teams.find(t => t.teamId === missionModalTeamId);
                                        handleMissionClick(item.code, missionModalTeamId, team?.teamName || "");
                                    }}
                                >
                                    <span className="td2-mission-item-code">{item.code}</span>
                                    <span className="td2-mission-item-name">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <TeachDetail2Modals
                showMissionModal={showMissionModal} setShowMissionModal={setShowMissionModal}
                missionModalTitle={missionModalTitle} missionModalData={missionModalData}
                showIdentityModal={showIdentityModal} setShowIdentityModal={setShowIdentityModal}
                identityModalTitle={identityModalTitle} identityModalData={identityModalData}
                showFlowModal={showFlowModal} setShowFlowModal={setShowFlowModal}
                flowModalTitle={flowModalTitle} flowModalData={flowModalData}
                showQuickWinModal={showQuickWinModal} setShowQuickWinModal={setShowQuickWinModal}
                quickWinModalTitle={quickWinModalTitle} quickWinModalData={quickWinModalData}
                showBuildWinModal={showBuildWinModal} setShowBuildWinModal={setShowBuildWinModal}
                buildWinModalTitle={buildWinModalTitle} buildWinModalData={buildWinModalData}
                showFundingModal={showFundingModal} setShowFundingModal={setShowFundingModal}
                fundingModalTitle={fundingModalTitle} fundingModalData={fundingModalData}
                fundingModalType={fundingModalType} missionModalTeamId={missionModalTeamId}
                showResultModal={showResultModal} setShowResultModal={setShowResultModal}
                resultModalTitle={resultModalTitle} resultModalData={resultModalData}
                showDeletedModal={showDeletedModal} setShowDeletedModal={setShowDeletedModal}
                deletedTeams={deletedTeams} selectedDeleted={selectedDeleted}
                setSelectedDeleted={setSelectedDeleted} handleRestore={handleRestore}
                showTeamModal={showTeamModal} setShowTeamModal={setShowTeamModal}
                modalTeam={modalTeam} modalTeamName={modalTeamName} setModalTeamName={setModalTeamName}
                modalMembers={modalMembers} setModalMembers={setModalMembers}
                selectedMembers={selectedMembers}
                handleMemberCheck={handleMemberCheck} handleDeleteMembers={handleDeleteMembers}
                handleAddMember={handleAddMember} handleSetWriter={handleSetWriter}
                handleTeamModalSave={handleTeamModalSave}
                showReportModal={showReportModal} setShowReportModal={setShowReportModal}
                reportTeamId={reportTeamId}
                pdfRenderTeamId={pdfRenderTeamId} pdfReportRef={pdfReportRef}
                pdfRenderData={pdfRenderData} handlePdfReportReady={handlePdfReportReady}
                pdfAllRunning={pdfAllRunning} pdfProgress={pdfProgress} setPdfProgress={setPdfProgress}
                showModifyModal={showModifyModal} setShowModifyModal={setShowModifyModal}
                gameInfo={gameInfo}
                modifyName={modifyName} setModifyName={setModifyName}
                modifyMonth={modifyMonth} setModifyMonth={setModifyMonth}
                modifyDay={modifyDay} setModifyDay={setModifyDay}
                modifyHour={modifyHour} setModifyHour={setModifyHour}
                modifyMinute={modifyMinute} setModifyMinute={setModifyMinute}
                handleModifySave={handleModifySave} rangeArray={rangeArray}
            />
        </div>
    );
};

export default TeachDetail2;
