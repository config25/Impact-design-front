const ReportTopBar = ({ logoUrl }) => (
    <div className="p4-topbar">
        {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
        <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
    </div>
);

export default ReportTopBar;
