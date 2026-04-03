import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTeachIndex } from "../../services/teachClassService";
import useFetchData from "../../hooks/useFetchData";
import formatDate from "../../utils/formatDate";
import "./TeachDashboard.css";

const TeachDashboard = () => {
    const navigate = useNavigate();
    const fetchFn = useCallback(() => getTeachIndex(), []);
    const { data: classrooms, loading } = useFetchData(fetchFn);

    return (
        <div className="tdb-container">
            {/* .title-heading */}
            <div className="tdb-title-heading">
                <h2>강의실 현황</h2>
                <p>현재 진행중인 강의실과 종료된 강의실 현황을 파악하고 정보를 수정하실 수 있습니다.</p>
            </div>

            {/* .panel > .panel-heading + .panel-body */}
            <div className="tdb-panel">
                <div className="tdb-panel-heading">
                    <span className="tdb-panel-title">진행중 강의실</span>
                </div>
                <div className="tdb-panel-body">
                    <table className="tdb-table">
                        <thead>
                            <tr>
                                <th>강의실명</th>
                                <th>진행분기</th>
                                <th>의사결정기간</th>
                                <th>의사결정현황</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="tdb-empty">로딩 중...</td>
                                </tr>
                            ) : !classrooms || classrooms.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="tdb-empty">
                                        진행중인 강의실이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                classrooms.map((c) => (
                                    <tr key={c.gameId}>
                                        <td>
                                            <span>
                                                <button
                                                    className="tdb-btn-classroom"
                                                    onClick={() => navigate(`/teacher/detail2/${c.gameId}`)}
                                                >
                                                    {c.name}
                                                </button>
                                            </span>
                                        </td>
                                        <td><span>{c.ddYear}년 {c.ddTerm}분기</span></td>
                                        <td><span>{formatDate(c.startdate)} ~ {formatDate(c.enddate)}</span></td>
                                        <td>
                                            {c.statusCeo === 20 ? (
                                                <span className="tdb-status-decided">결정완료(통보)</span>
                                            ) : (
                                                <span className="tdb-status-undecided">미결정</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeachDashboard;
