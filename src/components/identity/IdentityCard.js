const IdentityCard = ({ title, subtitle, question }) => {
    return (
        <div className="identity-card">
            <div className="card-title">{title}</div>
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
            {question && <div className="card-question">{question}</div>}
        </div>
    );
};

export default IdentityCard;