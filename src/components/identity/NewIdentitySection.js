import pencil from "../../resource/start/pencil.png";

const NewIdentitySection = () => {
    return (
        <section className="new-identity-section">
            {/* 미래 방향성 헤더 - 440 x 100 */}
            <div className="new-identity-header">
                미래 방향성 (New Identity)
            </div>

            <div className="new-identity-content">
                {/* New 미션 */}
                <div className="new-identity-item">
                    <div className="new-item-title">New 미션(Mission)</div>
                    <div className="new-item-body">
                        <img src={pencil} alt="" className="edit-icon" />
                        <span className="new-item-subtitle">(재정의된 존재 이유)</span>
                        <span className="new-item-desc">우리가 선택한 존재 이유</span>
                    </div>
                </div>

                {/* New 비전 */}
                <div className="new-identity-item">
                    <div className="new-item-title">New 비전(Vision)</div>
                    <div className="new-item-body">
                        <img src={pencil} alt="" className="edit-icon" />
                        <span className="new-item-subtitle">(새롭게 그리는 미래)</span>
                        <span className="new-item-desc">우리가 도달할 구체적 모습</span>
                    </div>
                </div>

                {/* New 핵심가치 */}
                <div className="new-identity-item">
                    <div className="new-item-title">New 핵심가치(Value)</div>
                    <div className="new-item-body">
                        <img src={pencil} alt="" className="edit-icon" />
                        <span className="new-item-subtitle">(새로운 행동/판단기준)</span>
                        <span className="new-item-desc">비전 달성을 위한 새로운 원칙</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewIdentitySection;
