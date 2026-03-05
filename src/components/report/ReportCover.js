import polygonImage from "../../resource/report/Polygon 4.png";
import polygon5Image from "../../resource/report/Polygon 5.png";
import coverMainImage from "../../resource/report/image.png";

const ReportCover = ({ reportData }) => (
    <div className="report-page report-page-cover">
        <div className="cover-vertical-left">MAKE IMPACT</div>
        <div className="cover-vertical-right">KEEP BALANCE</div>
        <div className="cover-line-1" />
        <div className="cover-line-2" />

        <p className="cover-subtitle">
            <span className="cover-subtitle-bar">|</span>&nbsp;&nbsp;성과 최적화를 위한 전략적 진단 및 제안
        </p>

        <h1 className="cover-main-title">
            THE IMPACT<br />
            <span className="cover-main-title-thin">REPORT</span>
        </h1>

        <img src={polygonImage} alt="" className="cover-polygon1" />
        <p className="cover-tagline">Make Impact. Keep Balance.</p>
        <div className="cover-divider" />
        <img src={coverMainImage} alt="" className="cover-main-image" />

        <div className="cover-info">
            <div className="cover-info-item">
                <p className="cover-info-label"><span className="cover-info-bar">|</span>&nbsp;&nbsp;Project Date</p>
                <p className="cover-info-value">{reportData?.projectDate ? reportData.projectDate.replaceAll("-", ". ") : "-"}</p>
            </div>
            <div className="cover-info-item">
                <p className="cover-info-label"><span className="cover-info-bar">|</span>&nbsp;&nbsp;과정명</p>
                <p className="cover-info-value">{reportData?.className || "-"}</p>
            </div>
            <div className="cover-info-item">
                <p className="cover-info-label"><span className="cover-info-bar">|</span>&nbsp;&nbsp;대상</p>
                <p className="cover-info-value">{reportData?.target || "-"}</p>
            </div>
            <div className="cover-info-item">
                <p className="cover-info-label"><span className="cover-info-bar">|</span>&nbsp;&nbsp;Facilitator</p>
                <p className="cover-info-value">㈜퀀텀에듀솔루션</p>
            </div>
        </div>

        <img src={polygon5Image} alt="" className="cover-polygon5" />
        <img src={process.env.PUBLIC_URL + "/q_logo.png"} alt="Quantum Edu Solution" className="cover-logo" />
        <p className="cover-powered">Powered by Quantum Edu Solution Methodology</p>
    </div>
);

export default ReportCover;
