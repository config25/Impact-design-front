import { truncateText } from "../../utils/reportUtils";
import ReportTopBar from "./ReportTopBar";
import ReportSectionHeader from "./ReportSectionHeader";
import ReportFooter from "./ReportFooter";

const ReportGoalsTable = ({ logoUrl, reportData, page, isSecondPage }) => {
    const goals = reportData?.flowCanvasGoals?.goals || [];
    const keywords = reportData?.flowCanvasGoals?.keywords;

    if (isSecondPage) {
        const page2Goals = goals.slice(20, Math.min(49, goals.length));
        return (
            <div className="report-page report-page-11">
                <ReportTopBar logoUrl={logoUrl} />
                <ReportSectionHeader title="III. Performance Stream (전략 목표에 대한 인식)" />

                <div className="p10-title-row p11-title-row">
                    <div className="p10-title-left">
                        <span className="p10-title-kr">전략 목표</span>
                        <span className="p10-title-en">(Strategic Goal)</span>
                    </div>
                    <span className="p10-title-note">(중복 포함)</span>
                </div>

                <table className="p10-table">
                    <colgroup>
                        <col style={{ width: '76px' }} />
                        <col style={{ width: '226px' }} />
                        <col style={{ width: '578px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>전략목표</th>
                            <th>주요 내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const rows = page2Goals.map((goal, i) => (
                                <tr key={goal.goalId || i}>
                                    <td>{i + 21}</td>
                                    <td>{truncateText(goal.title, 20)}</td>
                                    <td>{truncateText(goal.description || "", 50)}</td>
                                </tr>
                            ));
                            if (goals.length >= 50) {
                                rows.push(
                                    <tr key="ellipsis">
                                        <td>...</td>
                                        <td>...</td>
                                        <td>...</td>
                                    </tr>
                                );
                            }
                            return rows;
                        })()}
                    </tbody>
                </table>

                <ReportFooter page={11} />
            </div>
        );
    }

    const has11P = goals.length >= 21;
    const displayGoals = goals.slice(0, 20);

    return (
        <div className="report-page report-page-10">
            <ReportTopBar logoUrl={logoUrl} />
            <ReportSectionHeader title="III. Performance Stream (전략 목표에 대한 인식)" />

            <div className="p4-desc-box">
                <p className="p4-desc-text">
                    Strategic Identity는 조직을 둘러싼 위협적인 '외부 변화'와 이를 극복하기 위한 '내부 한계점'에 대한 구성원들의 생생한 목소리를 담고 있습니다. 우리 조직의 존재 이유와 목표를 재정의하고, 구성원들이 도출한 새로운 미션, 비전, 핵심가치를 통해 위기를 돌파할 실질적인 미래 청사진을 제안합니다.
                </p>
            </div>

            <div className="p10-divider"></div>

            <p className="p10-result-text">
                구성원들이 제시한 전략목표의 주요 키워드는 다음과 같습니다.
            </p>

            <div className="p10-keyword-row">
                {keywords?.slice(0, 4).map((keyword, idx) => (
                    <div className="p10-keyword-box" key={idx}><span className="p10-keyword-text"># {keyword}</span></div>
                )) || (
                    <>
                        <div className="p10-keyword-box"><span className="p10-keyword-text"># -</span></div>
                        <div className="p10-keyword-box"><span className="p10-keyword-text"># -</span></div>
                        <div className="p10-keyword-box"><span className="p10-keyword-text"># -</span></div>
                        <div className="p10-keyword-box"><span className="p10-keyword-text"># -</span></div>
                    </>
                )}
            </div>

            <div className="p10-info-bar">
                <span className="p10-info-text">본 과정에서 구성원들은 비전달성을 위한 전략목표</span>
                <span className="p10-count-badge">{goals.length}개</span>
                <span className="p10-info-text">를 제시했습니다.</span>
            </div>

            <div className="p10-title-row">
                <div className="p10-title-left">
                    <span className="p10-title-kr">전략 목표</span>
                    <span className="p10-title-en">(Strategic Goal)</span>
                </div>
                <span className="p10-title-note">(중복 포함)</span>
            </div>

            <table className="p10-table">
                <colgroup>
                    <col style={{ width: '76px' }} />
                    <col style={{ width: '226px' }} />
                    <col style={{ width: '578px' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>전략목표</th>
                        <th>주요 내용</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const rows = displayGoals.map((goal, i) => (
                            <tr key={goal.goalId || i}>
                                <td>{i + 1}</td>
                                <td>{truncateText(goal.title, 20)}</td>
                                <td>{truncateText(goal.description || "", 50)}</td>
                            </tr>
                        ));
                        if (goals.length >= 50 && !has11P) {
                            rows.push(
                                <tr key="ellipsis">
                                    <td>...</td>
                                    <td>...</td>
                                    <td>...</td>
                                </tr>
                            );
                        }
                        return rows.length > 0 ? rows : Array.from({ length: 20 }, (_, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        ));
                    })()}
                </tbody>
            </table>

            <ReportFooter page={10} />
        </div>
    );
};

export default ReportGoalsTable;
