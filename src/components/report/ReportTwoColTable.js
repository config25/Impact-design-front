import { truncateText } from "../../utils/reportUtils";
import ReportTopBar from "./ReportTopBar";
import ReportSectionHeader from "./ReportSectionHeader";
import ReportFooter from "./ReportFooter";

const ReportTwoColTable = ({
    logoUrl,
    pageNumber,
    pageClassName,
    items,
    totalCount,
    startIdx,
    maxItems,
    headers,
    titleKr,
    infoText,
    contentBox,
    isSecondPage,
    getField1,
    getField2,
    field1MaxLen,
    field2MaxLen,
}) => {
    const displayItems = items.slice(startIdx, startIdx + maxItems);
    const maxRows = Math.ceil(displayItems.length / 2);

    return (
        <div className={`report-page report-page-${pageClassName}`}>
            <ReportTopBar logoUrl={logoUrl} />
            <ReportSectionHeader title="III. Performance Stream (전략 목표에 대한 인식)" />

            {contentBox && !isSecondPage && (
                <div className={`p12-content-box${contentBox.extraClass || ''}`}>
                    <div className="p12-title-line">
                        <span className="p12-kpi-title">{contentBox.title}</span>
                        <div className="p12-badges">
                            <span className={`p12-badge-${contentBox.badge1Class}`}>{contentBox.badge1}</span>
                            <span className={`p12-badge-${contentBox.badge2Class}`}>{contentBox.badge2}</span>
                        </div>
                    </div>
                    <p className="p12-desc-text">{contentBox.desc}</p>
                </div>
            )}

            {!isSecondPage && (
                <div className="p10-info-bar p12-info-bar">
                    <span className="p10-info-text">{infoText}</span>
                    <span className="p10-count-badge">{totalCount} 개</span>
                    <span className="p10-info-text">를 제시했습니다.</span>
                </div>
            )}

            <div className={`p10-title-row ${isSecondPage ? 'p11-title-row' : 'p12-title-row'}`}>
                <span className="p10-title-kr">{titleKr}</span>
            </div>

            <table className="p12-table">
                <colgroup>
                    <col style={{ width: '245px' }} />
                    <col style={{ width: '195px' }} />
                    <col style={{ width: '245px' }} />
                    <col style={{ width: '195px' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>{headers[0]}</th>
                        <th>{headers[1]}</th>
                        <th>{headers[0]}</th>
                        <th>{headers[1]}</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const rows = [];
                        for (let i = 0; i < maxRows; i++) {
                            const leftIdx = startIdx + i * 2;
                            const rightIdx = startIdx + i * 2 + 1;
                            rows.push(
                                <tr key={i}>
                                    <td>{truncateText(getField1(items[leftIdx]), field1MaxLen) || ""}</td>
                                    <td className="p12-td-center">{truncateText(getField2(items[leftIdx]), field2MaxLen) || ""}</td>
                                    <td>{truncateText(getField1(items[rightIdx]), field1MaxLen) || ""}</td>
                                    <td className="p12-td-center">{truncateText(getField2(items[rightIdx]), field2MaxLen) || ""}</td>
                                </tr>
                            );
                        }
                        if (isSecondPage && items.length > startIdx + maxItems) {
                            rows.push(
                                <tr key="ellipsis">
                                    <td>...</td>
                                    <td className="p12-td-center">...</td>
                                    <td>...</td>
                                    <td className="p12-td-center">...</td>
                                </tr>
                            );
                        }
                        return rows;
                    })()}
                </tbody>
            </table>

            <ReportFooter page={pageNumber} />
        </div>
    );
};

export default ReportTwoColTable;
