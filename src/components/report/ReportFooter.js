import logoImage from "../../resource/report/logo01.png";

const ReportFooter = ({ page }) => (
    <div className="p2-footer">
        <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
        <span className="p2-footer-page">{page}</span>
        <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
    </div>
);

export default ReportFooter;
