import { useState, useEffect, useCallback } from "react";
import { getTeachDetail, endClass } from "../../services/teachClassService";
import { saveStep, addTeam, addEvaluationTeam, deleteTeam } from "../../services/teachTeamService";
import { getSubmissionList } from "../../services/teachSubmissionService";
import { getLogoUrl } from "../../utils/logoUtil";
import { stepConfig, missionRows, formatDate, stepArrToChecked } from "../../constants/teachDetail2Constants";
import useTeachDetail2Modals from "../../hooks/useTeachDetail2Modals";
import usePdfDownload from "../../hooks/usePdfDownload";
import TeachDetail2Modals from "../../components/teacher/TeachDetail2Modals";
import "./TeachDetail2.css";
import "../ImpactReviewScreen.css";

const TeachDetail2 = ({ onNavigate, params }) => {
    const [gameId] = useState(params?.gameId);
    const [gameInfo, setGameInfo] = useState(null);
    const [teams, setTeams] = useState([]);
    const [checkedSteps, setCheckedSteps] = useState([]);
    const [loading, setLoading] = useState(true);

    /* 제출 기한 */
    const now = new Date();
    const [deadlineYear, setDeadlineYear] = useState(now.getFullYear());
    const [deadlineMonth, setDeadlineMonth] = useState(now.getMonth() + 1);
    const [deadlineDay, setDeadlineDay] = useState(now.getDate());
    const [deadlineHour, setDeadlineHour] = useState(1);
    const [deadlineMinute, setDeadlineMinute] = useState(0);

    /* 팀 목록 갱신 헬퍼 */
    const refreshTeams = useCallback(async () => {
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
    }, [gameId]);

    /* Custom Hooks */
    const modals = useTeachDetail2Modals({
        gameId,
        gameInfo,
        refreshTeams,
        onGameInfoUpdate: (name) => setGameInfo(prev => ({ ...prev, name })),
    });

    const pdf = usePdfDownload({ gameId, teams, gameInfo });

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

    /* 단계 저장 */
    const handleStepSave = async () => {
        if (checkedSteps.length === 0) {
            alert("단계를 선택해주세요.");
            return;
        }
        if (!window.confirm("저장하시겠습니까?")) return;
        const result = await saveStep(gameId, checkedSteps.join(","));
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

    /* 다음 단계 시작 */
    const handleNextStep = () => {
        if (window.confirm("다음 단계를 시작하시겠습니까?")) {
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
                            <button className="td2-btn-primary" onClick={modals.handleOpenModify}>강의실 수정</button>
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
                            <button className="td2-btn-pdf-all" onClick={pdf.handleDownloadAllPDF} disabled={pdf.pdfAllRunning}>
                                {pdf.pdfAllRunning ? "생성 중..." : "전체 PDF 다운"}
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
                                                    <button className="td2-team-link" onClick={() => modals.handleOpenTeamModal(t.teamId)}>
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
                                                    <button className="td2-btn-file-down" onClick={() => { modals.setReportTeamId(t.teamId); modals.setShowReportModal(true); }}>파일 다운</button>
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
                                <button className="td2-btn-warning" onClick={modals.handleShowDeleted}>삭제된 팀 보기</button>
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
                            value={modals.missionModalTeamId || ""}
                            onChange={e => modals.setMissionModalTeamId(e.target.value ? Number(e.target.value) : null)}
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
                                        if (!modals.missionModalTeamId) {
                                            alert("팀을 먼저 선택해주세요.");
                                            return;
                                        }
                                        const team = teams.find(t => t.teamId === modals.missionModalTeamId);
                                        modals.handleMissionClick(item.code, modals.missionModalTeamId, team?.teamName || "");
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
                {...modals}
                {...pdf}
                gameInfo={gameInfo}
                rangeArray={rangeArray}
            />
        </div>
    );
};

export default TeachDetail2;
