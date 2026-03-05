import image7Bg from "../../resource/report/Image 7.png";

const ReportSectionHeader = ({ title }) => (
    <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
        {title}
    </div>
);

export default ReportSectionHeader;
