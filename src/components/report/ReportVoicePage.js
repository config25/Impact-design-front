import unionImage from "../../resource/report/union.png";
import ReportTopBar from "./ReportTopBar";
import ReportSectionHeader from "./ReportSectionHeader";
import ReportFooter from "./ReportFooter";

const ReportVoicePage = ({
    logoUrl,
    pageNumber,
    descText,
    resultHighlight,
    boxTitle,
    boxSubtitle,
    data,
}) => {
    const aiSummary = data?.aiSummary;
    const top12 = data?.top12;
    const keywords = data?.keywords;
    const totalCount = data?.totalCount;
    const truncate = (text, max = 55) => text && text.length > max ? text.substring(0, max) + "..." : text;

    // 항목 수에 따라 표시 슬롯 결정: 12+ → 12, 8~11 → 8, 그 외 → 4
    const voiceCount = top12?.length || 0;
    const slotCount = voiceCount >= 12 ? 12 : voiceCount >= 8 ? 8 : 4;

    return (
        <div className={`report-page report-page-${pageNumber}`}>
            <ReportTopBar logoUrl={logoUrl} />
            <ReportSectionHeader title="II. Strategic Identity (미래 방향성에 대한 인식)" />

            <div className="p4-desc-box">
                <p className="p4-desc-text">{descText}</p>
            </div>

            <p className="p6-result-text">
                귀사 구성원들이 느끼는 <span className="p6-result-highlight">{resultHighlight}</span>에 대한 체감하는 내용은 다음과 같습니다.
            </p>

            <div className="p6-threats-box">
                <h3 className="p6-threats-title">{boxTitle}</h3>
                <p className="p6-threats-subtitle">({boxSubtitle})</p>
                <div className="p6-threat-items">
                    {aiSummary?.map((summary, idx) => (
                        <div className="p6-threat-item" key={idx}>
                            <p className="p6-threat-text">{idx + 1}. {truncate(summary)}</p>
                        </div>
                    )) || (
                        <>
                            <div className="p6-threat-item"><p className="p6-threat-text">1. -</p></div>
                            <div className="p6-threat-item"><p className="p6-threat-text">2. -</p></div>
                            <div className="p6-threat-item"><p className="p6-threat-text">3. -</p></div>
                        </>
                    )}
                </div>
            </div>

            <div className="p6-voice-section">
                <h3 className="p6-voice-title">Voice of Employee {totalCount != null && <span className="p6-voice-count">({totalCount}개)</span>}</h3>
                <div className={`p6-voice-bubbles p6-voice-bubbles-grid p6-voice-bubbles-cols-${slotCount / 4}`}>
                    {Array.from({ length: slotCount }, (_, idx) => {
                        const item = top12?.[idx];
                        return (
                            <div className="p6-voice-bubble" key={idx}>
                                <p className="p6-voice-text">{item?.content ? `"${item.content}"` : "-"}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '189px' }} />
            <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '388px' }} />
            <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '588px' }} />
            <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '787px' }} />

            <div className="p6-keywords-row">
                {keywords?.slice(0, 4).map((keyword, idx) => (
                    <div className="p6-keyword-box" key={idx}><span className="p6-keyword-text"># {keyword}</span></div>
                )) || (
                    <>
                        <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                        <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                        <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                        <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                    </>
                )}
            </div>

            <ReportFooter page={pageNumber} />
        </div>
    );
};

export default ReportVoicePage;
