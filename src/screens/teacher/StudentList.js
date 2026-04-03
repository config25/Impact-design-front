import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentList } from "../../services/teachClassService";
import { updateTeamMember } from "../../services/teachTeamService";
import "./StudentList.css";

const StudentList = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [teamList, setTeamList] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterTeam, setFilterTeam] = useState("");
    const [moveToTeam, setMoveToTeam] = useState("");
    const [checkedUserIds, setCheckedUserIds] = useState([]);

    /* API 데이터 로드 */
    const fetchData = async () => {
        const result = await getStudentList(gameId);
        if (result.success) {
            setTeamList(result.data.teamList || []);
            setStudents(result.data.studentList || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!gameId) return;
        fetchData();
    }, [gameId]);

    /* 팀 필터 */
    const filteredStudents = filterTeam
        ? students.filter(s => s.teamId === Number(filterTeam))
        : students;

    /* 체크박스 (다중 선택) */
    const handleCheck = (userId) => {
        setCheckedUserIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    /* 전체 선택/해제 */
    const handleCheckAll = () => {
        const allIds = filteredStudents.map(s => s.userId);
        const allChecked = allIds.every(id => checkedUserIds.includes(id));
        if (allChecked) {
            setCheckedUserIds(prev => prev.filter(id => !allIds.includes(id)));
        } else {
            setCheckedUserIds(prev => [...new Set([...prev, ...allIds])]);
        }
    };

    const isAllChecked = filteredStudents.length > 0 &&
        filteredStudents.every(s => checkedUserIds.includes(s.userId));

    /* 팀 이동 */
    const handleTeamMove = async () => {
        if (checkedUserIds.length === 0) {
            alert("팀을 이동할 사용자를 선택해주세요.");
            return;
        }
        if (!moveToTeam) {
            alert("이동할 팀을 선택해주세요.");
            return;
        }

        const targetTeamId = Number(moveToTeam);
        const targetTeam = teamList.find(t => t.teamId === targetTeamId);

        /* 같은 팀인 학생 필터링 */
        const movable = checkedUserIds.filter(uid => {
            const student = students.find(s => s.userId === uid);
            return student && student.teamId !== targetTeamId;
        });

        if (movable.length === 0) {
            alert("선택된 학생이 모두 같은 팀에 속해 있습니다.");
            return;
        }

        if (!window.confirm(`${movable.length}명을 '${targetTeam?.name}' 팀으로 이동하시겠습니까?`)) return;

        let successCount = 0;
        for (const userId of movable) {
            const result = await updateTeamMember(userId, targetTeamId);
            if (result.success) successCount++;
        }

        if (successCount > 0) {
            alert(`${successCount}명이 이동되었습니다.`);
            setCheckedUserIds([]);
            setMoveToTeam("");
            await fetchData();
        } else {
            alert("팀 이동에 실패했습니다.");
        }
    };

    /* 목록으로 돌아가기 */
    const handleBack = () => {
        navigate(`/teacher/detail2/${gameId}`);
    };

    return (
        <div className="sl-container">
            {/* 타이틀 */}
            <div className="sl-title-heading">
                <h2>교육생 정보</h2>
            </div>

            {/* 필터 + 이동할 팀 */}
            <div className="sl-filter">
                <table className="sl-filter-table">
                    <tbody>
                        <tr>
                            <th>팀 필터</th>
                            <td>
                                <select
                                    className="sl-team-select"
                                    value={filterTeam}
                                    onChange={e => { setFilterTeam(e.target.value); setCheckedUserIds([]); }}
                                >
                                    <option value="">전체</option>
                                    {teamList.map(t => (
                                        <option key={t.teamId} value={t.teamId}>{t.name}</option>
                                    ))}
                                </select>
                            </td>
                            <th>이동할 팀</th>
                            <td>
                                <select
                                    className="sl-team-select"
                                    value={moveToTeam}
                                    onChange={e => setMoveToTeam(e.target.value)}
                                >
                                    <option value="">선택</option>
                                    {teamList.map(t => (
                                        <option key={t.teamId} value={t.teamId}>{t.name}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 교육생 테이블 */}
            <div className="sl-panel-body">
                <table className="sl-table">
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}>
                                <input
                                    type="checkbox"
                                    checked={isAllChecked}
                                    onChange={handleCheckAll}
                                />
                            </th>
                            <th>번호</th>
                            <th>User ID</th>
                            <th>성명</th>
                            <th>메일주소</th>
                            <th>팀명</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="sl-empty">로딩 중...</td></tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr><td colSpan="6" className="sl-empty">교육생이 없습니다.</td></tr>
                        ) : (
                            filteredStudents.map((s, idx) => (
                                <tr key={s.userId}>
                                    <td className="sl-check-cell">
                                        <input
                                            type="checkbox"
                                            checked={checkedUserIds.includes(s.userId)}
                                            onChange={() => handleCheck(s.userId)}
                                        />
                                    </td>
                                    <td>{idx + 1}</td>
                                    <td>{s.loginId}</td>
                                    <td>{s.name || "-"}</td>
                                    <td>{s.mail || "-"}</td>
                                    <td>{s.teamName}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 하단 버튼 */}
            <div className="sl-actions">
                <button className="sl-btn-default" onClick={handleBack}>목록</button>
                <button className="sl-btn-primary" onClick={handleTeamMove}>팀 이동</button>
            </div>
        </div>
    );
};

export default StudentList;
