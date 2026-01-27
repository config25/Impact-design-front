import "./IdentityCanvasScreen.css";
import GNB from "../components/common/GNB";
import IdentityCanvasLayout from "../components/identity/IdentityCanvasLayout";
import pencil2 from "../resource/quick/pencil2.png";

const IdentityCanvasScreen = ({ onNavigate }) => {
    return (
        <div className="identity-screen">
            <GNB activeScreen="identity" onNavigate={onNavigate} />

            <div className="identity-toolbar">
                <h2 className="identity-page-title">1. Strategic Identity Canvas</h2>

                <div className="identity-toolbar-actions">
                    <button className="tips-button">
                        <img src={pencil2} alt="" className="pencil-icon" />
                        <span className="tips-text">
                            <span className="tips-text-bold">작성 Tips</span>
                            <span className="tips-text-regular">를 확인해보세요!</span>
                        </span>
                    </button>
                    <button className="save-button">저장</button>
                    <button className="submit-button">제출완료</button>
                </div>
            </div>

            <IdentityCanvasLayout />
        </div>
    );
};

export default IdentityCanvasScreen;
