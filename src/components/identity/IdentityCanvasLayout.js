import "./identity.css";
import LegacySection from "./LegacySection";
import ThreatSection from "./ThreatSection";
import NewIdentitySection from "./NewIdentitySection";
import component1Img from "../../resource/identity/Component 1.png";
import vector3Img from "../../resource/identity/Vector 3.png";
import shinhanLogo from "../../resource/flow/신한은행.png";

const IdentityCanvasLayout = () => {
    return (
        <div className="identity-container">
            <div className="identity-canvas-wrapper">
                <header className="identity-header">
                    <div className="header-left">
                        <div className="step-badge-wrapper">
                            <img src={component1Img} alt="" className="step-badge-img" />
                            <span className="step-badge-number">1</span>
                            <img src={vector3Img} alt="" className="step-badge-shadow" />
                        </div>
                        <div className="header-text">
                            <h1>Strategic Identity Canvas</h1>
                            <p className="header-desc">
                                성과창출의 첫 걸음은, 무엇을 할 것인가가 아니라 달성하고자 하는 미래를 먼저 그리는 것입니다.
                            </p>
                            <p className="header-desc">
                                우리의 미래는 무엇입니까? 앞으로 우리가 도달해야 할 '새로운 미래'를 여러분의 언어로 제시해보십시오
                            </p>
                        </div>
                    </div>

                    <div className="logo-wrapper">
                        <img src={shinhanLogo} alt="신한은행" className="logo-img" />
                    </div>
                </header>

                <div className="identity-grid">
                    <LegacySection />
                    <ThreatSection />
                    <NewIdentitySection />
                </div>
            </div>
        </div>
    );
};

export default IdentityCanvasLayout;
