import { useState, useEffect } from "react";
import { getTeachDetail2, getTeamInfo, updateTeamInfo, startClass, endClass, restoreClass, deleteTeamMembers, addTeam, addEvaluationTeam, setTeamWriter, addTeamMember } from "../../services/teacherService";
import { getLogoUrl } from "../../utils/logoUtil";
import "./TeachDetail.css";

/* 날짜 포맷 */
const formatDate = (isoStr) => {
    if (!isoStr) return "-";
    const d = new Date(isoStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}시 ${min}분`;
};

/* 상태값 → 표시 텍스트 */
const statusText = (status) => {
    switch (status) {
        case 0: return "설정중";
        case 10: return "진행중";
        case 100: return "종료됨";
        default: return "설정중";
    }
};

const TeachDetail = ({ onNavigate, params }) => {
    const gameStatus = params?.status || "setting"; // "setting" | "closed"
    const [gameId] = useState(params?.gameId);
    const [gameInfo, setGameInfo] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBanner, setShowBanner] = useState(gameStatus === "setting");

    /* 팀/참여자 정보입력 모달 */
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [modalTeam, setModalTeam] = useState(null);
    const [modalTeamName, setModalTeamName] = useState("");
    const [modalMembers, setModalMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    /* 제출 기한 */
    const now = new Date();
    const [deadlineYear, setDeadlineYear] = useState(now.getFullYear());
    const [deadlineMonth, setDeadlineMonth] = useState(now.getMonth() + 1);
    const [deadlineDay, setDeadlineDay] = useState(now.getDate());
    const [deadlineHour, setDeadlineHour] = useState(1);
    const [deadlineMinute, setDeadlineMinute] = useState(0);

    /* API 데이터 로드 */
    const fetchData = async () => {
        if (!gameId) return;
        const result = await getTeachDetail2(gameId);
        if (result.success) {
            const d = result.data;
            setGameInfo({
                name: d.name,
                numTeam: d.numTeam,
                submitTime: d.mission ? formatDate(d.mission.startdate) + " ~ " + formatDate(d.mission.enddate) : "-",
                currentYear: d.mission ? `${d.mission.ddYear}년 ${d.mission.ddTerm}분기` : statusText(d.status),
                status: statusText(d.status),
                code: d.code,
                logoUrl: getLogoUrl(d.gameLogo),
            });
            setTeams((d.teams || []).map(t => ({
                teamId: t.teamId,
                teamName: t.teamName,
                numUser: t.numUser,
            })));

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

    useEffect(() => {
        fetchData();
    }, [gameId]);

    const rangeArray = (start, end) => {
        const arr = [];
        for (let i = start; i <= end; i++) arr.push(i);
        return arr;
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

    /* 강의실 복원 */
    const handleRestoreGame = async () => {
        if (!window.confirm("강의실을 복원하시겠습니까?")) return;

        const result = await restoreClass(gameId);
        if (result.success) {
            alert("강의실이 복원되었습니다.");
            onNavigate("teach_detail2", { gameId });
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
            await fetchData();
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
            await fetchData();
        } else {
            alert(result.message);
        }
    };

    /* 팀/참여자 정보입력 모달 열기 */
    const handleOpenTeamModal = async (team) => {
        const result = await getTeamInfo(team.teamId);
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
    const handleSetLeader = async () => {
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
        } else {
            alert(result.message);
        }
    };

    /* 교육 시작하기 */
    const handleStartEducation = async () => {
        if (!window.confirm("교육을 시작하시겠습니까?")) return;

        const result = await startClass(gameId);
        if (result.success) {
            alert("교육이 시작되었습니다.");
            onNavigate("teach_detail2", { gameId });
        } else {
            alert(result.message);
        }
    };

    if (loading) {
        return <div className="tdt-container" style={{ padding: 40, textAlign: "center", color: "#999" }}>로딩 중...</div>;
    }

    if (!gameInfo) {
        return <div className="tdt-container" style={{ padding: 40, textAlign: "center", color: "#999" }}>강의실 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="tdt-container">
            {/* 타이틀 + 버튼 */}
            <div className="tdt-title-row">
                <div>
                    <h2 className="tdt-title">강의실 상세정보</h2>
                </div>
                <div className="tdt-title-btns">
                    <button className="tdt-btn-end" onClick={handleEndGame}>강의실 종료</button>
                    <button className="tdt-btn-restore" onClick={handleRestoreGame}>강의실 복원</button>
                </div>
            </div>

            {/* 2컬럼: 기본정보 + 팀정보 */}
            <div className="tdt-row">
                {/* 좌: 강의실 기본정보 */}
                <div className="tdt-col-left">
                    <div className="tdt-panel">
                        <div className="tdt-panel-heading">
                            <span className="tdt-panel-title">강의실 기본정보</span>
                        </div>
                        <div className="tdt-panel-body">
                            {/* 설정중 배너 */}
                            {showBanner && (
                                <div className="tdt-banner-warning">
                                    <span className="tdt-banner-icon">!</span>
                                    <span className="tdt-banner-text">교육이 아직 시작되지 않았습니다.</span>
                                    <button className="tdt-banner-close" onClick={() => setShowBanner(false)}>&times;</button>
                                </div>
                            )}

                            <table className="tdt-info-table">
                                <tbody>
                                    <tr>
                                        <th>강의실 명</th>
                                        <td>{gameInfo.name}</td>
                                    </tr>
                                    <tr>
                                        <th>팀 수</th>
                                        <td>{gameInfo.numTeam}</td>
                                    </tr>
                                    <tr>
                                        <th>제출시간</th>
                                        <td>{gameInfo.submitTime}</td>
                                    </tr>
                                    <tr>
                                        <th>현재 연도</th>
                                        <td>{gameInfo.currentYear}</td>
                                    </tr>
                                    <tr>
                                        <th>강의실 상태</th>
                                        <td>{gameInfo.status}</td>
                                    </tr>
                                    <tr>
                                        <th>강의실 코드</th>
                                        <td>{gameInfo.code}</td>
                                    </tr>
                                    <tr>
                                        <th>강의실 로고</th>
                                        <td>
                                            {gameInfo.logoUrl ? (
                                                <img src={gameInfo.logoUrl} alt="logo" className="tdt-logo-img" />
                                            ) : null}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 우: 팀 정보입력 */}
                <div className="tdt-col-right">
                    <div className="tdt-panel">
                        <div className="tdt-panel-heading">
                            <span className="tdt-panel-title">팀 정보입력</span>
                        </div>
                        <div className="tdt-panel-body">
                            <table className="tdt-team-table">
                                <thead>
                                    <tr>
                                        <th>팀명</th>
                                        <th>참여자수</th>
                                        <th>입력/수정</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teams.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="tdt-empty">등록된 팀이 없습니다.</td>
                                        </tr>
                                    ) : (
                                        teams.map(t => (
                                            <tr key={t.teamId}>
                                                <td>{t.teamName}</td>
                                                <td>{t.numUser}명</td>
                                                <td>
                                                    <button
                                                        className="tdt-btn-team-edit"
                                                        onClick={() => handleOpenTeamModal(t)}
                                                    >
                                                        팀/참여자 정보입력
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="tdt-panel-footer">
                            <button className="tdt-btn-default" onClick={handleTeamAdd}>팀 추가</button>
                            <button className="tdt-btn-default" onClick={() => onNavigate("student_list", { gameId })}>교육생 목록</button>
                            <button className="tdt-btn-default" onClick={handleEvalTeamAdd}>평가팀 추가</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 제출 기한 설정 */}
            <div className="tdt-panel">
                <div className="tdt-panel-heading">
                    <span className="tdt-panel-title">제출 기한 설정</span>
                </div>
                <div className="tdt-deadline-body">
                    <div className="tdt-deadline-row">
                        <span className="tdt-deadline-label">제출 시간</span>
                        <select className="tdt-deadline-select" value={deadlineYear} onChange={e => setDeadlineYear(Number(e.target.value))}>
                            {rangeArray(now.getFullYear(), now.getFullYear() + 5).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <span className="tdt-deadline-unit">년</span>
                        <select className="tdt-deadline-select" value={deadlineMonth} onChange={e => setDeadlineMonth(Number(e.target.value))}>
                            {rangeArray(1, 12).map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <span className="tdt-deadline-unit">월</span>
                        <select className="tdt-deadline-select" value={deadlineDay} onChange={e => setDeadlineDay(Number(e.target.value))}>
                            {rangeArray(1, 31).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <span className="tdt-deadline-unit">일</span>
                        <select className="tdt-deadline-select" value={deadlineHour} onChange={e => setDeadlineHour(Number(e.target.value))}>
                            {rangeArray(0, 23).map(h => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
                        <span className="tdt-deadline-unit">시</span>
                        <select className="tdt-deadline-select" value={deadlineMinute} onChange={e => setDeadlineMinute(Number(e.target.value))}>
                            {rangeArray(0, 5).map(m => (
                                <option key={m} value={m * 10}>{m * 10}</option>
                            ))}
                        </select>
                        <span className="tdt-deadline-unit">분</span>
                    </div>
                </div>
                {gameStatus === "setting" && (
                    <div className="tdt-panel-footer" style={{ textAlign: "center" }}>
                        <button className="tdt-btn-start" onClick={handleStartEducation}>교육 시작하기</button>
                    </div>
                )}
            </div>

            {/* 팀/참여자 정보입력 모달 */}
            {showTeamModal && modalTeam && (
                <div className="tdt-modal-overlay" onClick={() => setShowTeamModal(false)}>
                    <div className="tdt-team-modal" onClick={e => e.stopPropagation()}>
                        <div className="tdt-team-modal-header">
                            <span className="tdt-team-modal-title">팀/참여자 정보입력</span>
                        </div>
                        <div className="tdt-team-modal-body">
                            <h4 className="tdt-team-modal-subtitle">참여자 정보입력</h4>

                            {/* 팀 기본정보 */}
                            <table className="tdt-team-modal-info">
                                <tbody>
                                    <tr>
                                        <th>팀 번호</th>
                                        <td>{modalTeam.teamId}</td>
                                    </tr>
                                    <tr>
                                        <th>팀 이름</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="tdt-team-modal-input"
                                                value={modalTeamName}
                                                onChange={e => setModalTeamName(e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* 참여자 테이블 */}
                            <table className="tdt-member-table">
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
                                        <tr><td colSpan="6" className="tdt-empty">등록된 팀원이 없습니다.</td></tr>
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
                                                <td className="tdt-member-link">{m.name || m.loginId}</td>
                                                <td>{m.mail || ""}</td>
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
                            <div className="tdt-team-modal-actions">
                                <div className="tdt-team-modal-btns">
                                    <button className="tdt-modal-btn-gray" onClick={handleDeleteMembers}>선택된 팀원삭제</button>
                                    <button className="tdt-modal-btn-blue" onClick={handleAddMember}>팀원추가</button>
                                    <button className="tdt-modal-btn-blue" onClick={handleSetLeader}>대표 작성자 지정</button>
                                    <button className="tdt-modal-btn-dark" onClick={handleTeamModalSave}>인쇄완료</button>
                                </div>
                                <p className="tdt-team-modal-note">CEO의 각 게시물 작성은 오직 1명만 가능합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeachDetail;
