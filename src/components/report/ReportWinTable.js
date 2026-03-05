import { truncateText } from "../../utils/reportUtils";
import ReportTopBar from "./ReportTopBar";
import ReportSectionHeader from "./ReportSectionHeader";
import ReportFooter from "./ReportFooter";

const ReportWinTable = ({
    logoUrl,
    pageNumber,
    title,
    descText,
    infoText,
    subtitleLeft,
    list,
}) => {
    const displayList = list.slice(0, Math.min(22, list.length));

    return (
        <div className="report-page report-page-20">
            <ReportTopBar logoUrl={logoUrl} />
            <ReportSectionHeader title="IV. Quick &amp; Build Win(실행과제 제안과 평가)" />

            <div className="p20-desc-box">
                <h3 className="p20-title">{title}</h3>
                <p className="p20-desc-text">{descText}</p>
            </div>

            <div className="p10-info-bar p20-info-bar">
                <span className="p10-info-text">{infoText}</span>
                <span className="p10-count-badge">{list.length} 개</span>
                <span className="p10-info-text">를 제시했습니다.</span>
            </div>

            <div className="p20-subtitle-row">
                <span className="p20-subtitle-left">{subtitleLeft}</span>
                <span className="p20-subtitle-right">* 점수와 순위는 참여한 교육생들이 평가한 결과입니다</span>
            </div>

            <table className="p20-table">
                <colgroup>
                    <col style={{ width: '245px' }} />
                    <col style={{ width: '435px' }} />
                    <col style={{ width: '100px' }} />
                    <col style={{ width: '100px' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>과제명</th>
                        <th>주요내용</th>
                        <th>점수</th>
                        <th>순위</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const rows = displayList.map((item, i) => (
                            <tr key={i}>
                                <td>{truncateText(item.taskName, 20) || "-"}</td>
                                <td>{truncateText(item.taskDescription, 40) || "-"}</td>
                                <td className="p20-td-center">{item.totalScore || 0}</td>
                                <td className="p20-td-center">{i + 1}</td>
                            </tr>
                        ));
                        if (list.length >= 23) {
                            rows.push(
                                <tr key="ellipsis">
                                    <td>...</td>
                                    <td>...</td>
                                    <td className="p20-td-center">...</td>
                                    <td className="p20-td-center">...</td>
                                </tr>
                            );
                        }
                        return rows.length > 0 ? rows : Array.from({ length: 22 }, (_, i) => (
                            <tr key={i}>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ));
                    })()}
                </tbody>
            </table>

            <ReportFooter page={pageNumber} />
        </div>
    );
};

export default ReportWinTable;
