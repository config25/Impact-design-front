import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTeachList } from "../../services/teachClassService";
import useFetchData from "../../hooks/useFetchData";
import formatDate from "../../utils/formatDate";
import "./TeachList.css";

const TeachList = () => {
    const navigate = useNavigate();
    const fetchFn = useCallback(() => getTeachList(), []);
    const { data, loading } = useFetchData(fetchFn);

    const inProgress = data?.inProgress || [];
    const setting = data?.setting || [];
    const closed = data?.completed || [];

    return (
        <div className="tls-container">
            {/* 타이틀 */}
            <div className="tls-title-heading">
                <h2>강의실 현황</h2>
                <p>현재 진행중인 강의실과 종료된 강의실 현황을 파악하고 정보를 수정하실 수 있습니다.</p>
            </div>

            <div className="tls-row">
                {/* 좌: 진행중 강의실 */}
                <div className="tls-col-left">
                    <div className="tls-panel">
                        <div className="tls-panel-heading">
                            <span className="tls-panel-title">1. 진행중 강의실</span>
                        </div>
                        <div className="tls-panel-body">
                            <div className="tls-scroll-xl">
                                <table className="tls-table tls-primary">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "30%" }}>강의실명</th>
                                            <th style={{ width: "15%" }}>진행분기</th>
                                            <th>의사결정기간</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="3" className="tls-empty">로딩 중...</td></tr>
                                        ) : inProgress.length === 0 ? (
                                            <tr><td colSpan="3" className="tls-empty">진행중인 강의실이 없습니다.</td></tr>
                                        ) : (
                                            inProgress.map(c => (
                                                <tr key={c.gameId}>
                                                    <td>
                                                        <button
                                                            className="tls-btn-primary"
                                                            onClick={() => navigate(`/teacher/detail2/${c.gameId}`)}
                                                        >
                                                            {c.name}
                                                        </button>
                                                    </td>
                                                    <td>{c.ddYear}년 {c.ddTerm}분기</td>
                                                    <td>{formatDate(c.startdate)} ~ {formatDate(c.enddate)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 우: 설정중 + 종료된 강의실 */}
                <div className="tls-col-right">
                    {/* 설정중 강의실 */}
                    <div className="tls-panel">
                        <div className="tls-panel-heading">
                            <span className="tls-panel-title">2. 설정중 강의실</span>
                        </div>
                        <div className="tls-panel-body">
                            <div className="tls-scroll-sm">
                                <table className="tls-table tls-danger">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "30%" }}>강의실명</th>
                                            <th style={{ width: "20%" }}>진행분기</th>
                                            <th>의사결정기간</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="3" className="tls-empty">로딩 중...</td></tr>
                                        ) : setting.length === 0 ? (
                                            <tr><td colSpan="3" className="tls-empty">설정중인 강의실이 없습니다.</td></tr>
                                        ) : (
                                            setting.map(c => (
                                                <tr key={c.gameId}>
                                                    <td>
                                                        <button
                                                            className="tls-btn-danger"
                                                            onClick={() => navigate(`/teacher/detail/${c.gameId}?status=setting`)}
                                                        >
                                                            {c.name}
                                                        </button>
                                                    </td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 종료된 강의실 */}
                    <div className="tls-panel">
                        <div className="tls-panel-heading">
                            <span className="tls-panel-title">3. 종료된 강의실</span>
                        </div>
                        <div className="tls-panel-body">
                            <div className="tls-scroll-sm">
                                <table className="tls-table tls-dark">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "30%" }}>강의실명</th>
                                            <th style={{ width: "20%" }}>진행분기</th>
                                            <th>의사결정기간</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="3" className="tls-empty">로딩 중...</td></tr>
                                        ) : closed.length === 0 ? (
                                            <tr><td colSpan="3" className="tls-empty">종료된 강의실이 없습니다.</td></tr>
                                        ) : (
                                            closed.map(c => (
                                                <tr key={c.gameId}>
                                                    <td>
                                                        <button
                                                            className="tls-btn-default"
                                                            onClick={() => navigate(`/teacher/detail/${c.gameId}?status=closed`)}
                                                        >
                                                            {c.name}
                                                        </button>
                                                    </td>
                                                    <td>{c.ddYear}년 {c.ddTerm}분기</td>
                                                    <td>{formatDate(c.startdate)} ~ {formatDate(c.enddate)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeachList;
