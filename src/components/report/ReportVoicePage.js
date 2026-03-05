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
    dataMaxWidth,
    fallbackWidth,
    fallbackWidthLast,
}) => {
    const aiSummary = data?.aiSummary;
    const top4 = data?.top4;
    const keywords = data?.keywords;

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
                            <p className="p6-threat-text">{idx + 1}. {summary}</p>
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
                <h3 className="p6-voice-title">Voice of Employee</h3>
                <div className="p6-voice-bubbles">
                    {top4?.slice(0, 4).map((item, idx) => (
                        <div className="p6-voice-bubble" key={idx} style={{ width: 'auto', maxWidth: dataMaxWidth }}>
                            <p className="p6-voice-text">"{item.content}"</p>
                        </div>
                    )) || (
                        <>
                            {Array.from({ length: 3 }, (_, i) => (
                                <div className="p6-voice-bubble" key={i} style={{ width: fallbackWidth }}><p className="p6-voice-text">-</p></div>
                            ))}
                            <div className="p6-voice-bubble" style={{ width: fallbackWidthLast || fallbackWidth }}><p className="p6-voice-text">-</p></div>
                        </>
                    )}
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
