import ReportTopBar from "./ReportTopBar";
import ReportSectionHeader from "./ReportSectionHeader";
import ReportFooter from "./ReportFooter";

const ReportNewFuture = ({ logoUrl, reportData }) => {
    const vmv = reportData?.visionMissionValue;

    return (
        <div className="report-page report-page-9">
            <ReportTopBar logoUrl={logoUrl} />
            <ReportSectionHeader title="III. Performance Stream (전략 목표에 대한 인식)" />

            <p className="p9-result-text">
                귀사 구성원들의 의견을 토대로 AI가 그려본 새로운 미래는 다음과 같습니다
            </p>

            <div className="p9-future-box">
                <h3 className="p9-future-title">우리 조직의 새로운 미래</h3>
                <div className="p9-future-columns">
                    {[
                        { label: "미션 (Mission)", value: vmv?.aiMission, fallback: "(재정의된 존재 이유)" },
                        { label: "비전 (Vision)", value: vmv?.aiVision, fallback: "(재정의된 목표)" },
                        { label: "핵심가치 (Value)", value: vmv?.aiValue, fallback: "(재정의된 핵심가치)" },
                    ].map((col, i) => (
                        <div className="p9-col-outer" key={i}>
                            <div className="p9-col-header">
                                <span className="p9-new-badge">NEW</span>
                                <span className="p9-col-label">{col.label}</span>
                            </div>
                            <div className="p9-col-content">
                                <p className="p9-col-text">{col.value || col.fallback}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p9-triangle" style={{ top: '720px' }}></div>
            <div className="p9-triangle" style={{ top: '733px' }}></div>

            <p className="p9-result-text p9-result-text2">
                귀사 구성원들이 제안한 새로운 미래 방향성은 아래와 같습니다
            </p>

            <div className="p9-stream-row">
                {[
                    { title: "Mission", items: vmv?.missionTop4 },
                    { title: "Vision", items: vmv?.visionTop4 },
                    { title: "Value", items: vmv?.valueTop4 },
                ].map((col, i) => (
                    <div className="p9-stream-col" key={i}>
                        <h4 className="p9-stream-title">{col.title}</h4>
                        {col.items?.slice(0, 4).map((item, idx) => (
                            <div className="p9-stream-item" key={idx}>{item.content}</div>
                        )) || Array.from({ length: 4 }, (_, j) => <div className="p9-stream-item" key={j}></div>)}
                    </div>
                ))}
            </div>

            <ReportFooter page={9} />
        </div>
    );
};

export default ReportNewFuture;
