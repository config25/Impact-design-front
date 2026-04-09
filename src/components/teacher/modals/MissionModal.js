import { impactQuestions } from "../../../constants/teachDetail2Constants";

const MissionModal = ({ show, onClose, title, data, TeamSelectBar }) => {
    if (!show || !data) return null;

    return (
        <div className="td2-modal-overlay" onClick={onClose}>
            <div className="td2-impact-modal" onClick={e => e.stopPropagation()}>
                <div className="td2-impact-modal-header">
                    <span className="td2-impact-modal-title">{title}</span>
                    <button className="td2-modify-close" onClick={onClose}>&times;</button>
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
                                                {data[`q${q.no}Text`] || ""}
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={q.no}>
                                            <td className="td2-impact-no-cell">{q.no}</td>
                                            <td className="td2-impact-q-cell" colSpan="2">{q.text}</td>
                                            {[1, 2, 3, 4, 5].map(r => (
                                                <td key={r} className="td2-impact-rating-cell">
                                                    <span className={`td2-impact-rating-dot ${data[`q${q.no}Score`] === r ? "td2-impact-selected" : ""}`}>
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
    );
};

export default MissionModal;
