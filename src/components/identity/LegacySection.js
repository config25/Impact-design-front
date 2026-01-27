import pencil from "../../resource/start/pencil.png";

const LegacySection = () => {
    return (
        <section className="legacy-section">
            <div className="legacy-header">
                기존 가치체계 (Current Legacy)
            </div>

            <div className="legacy-content">
                <div className="legacy-item">
                    <div className="legacy-item-title">미션(Mission)</div>
                    <div className="legacy-item-body">
                        <img src={pencil} alt="" className="edit-icon" />
                        <span className="legacy-item-subtitle">(존재 이유)</span>
                    </div>
                </div>

                <div className="legacy-item">
                    <div className="legacy-item-title">비전 (Vision)</div>
                    <div className="legacy-item-body">
                        <img src={pencil} alt="" className="edit-icon" />
                        <span className="legacy-item-subtitle">(지향하는 미래)</span>
                    </div>
                </div>

                <div className="legacy-item">
                    <div className="legacy-item-title">핵심가치 (Value)</div>
                    <div className="legacy-item-body">
                        <img src={pencil} alt="" className="edit-icon" />
                        <span className="legacy-item-subtitle">(행동 원칙)</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LegacySection;
