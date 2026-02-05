import { useEffect, useContext } from "react";
import "./IdentityCanvasScreen.css";
import GNB from "../components/common/GNB";
import IdentityCanvasLayout from "../components/identity/IdentityCanvasLayout";
import pencil2 from "../resource/quick/pencil2.png";
import { getIdentityCanvas, saveIdentityCanvas } from "../services/identityCanvasService";
import { IdentityCanvasProvider, IdentityCanvasContext } from "../contexts/IdentityCanvasContext";

const IdentityCanvasInner = ({ onNavigate }) => {
    const { values, loadFromResponse } = useContext(IdentityCanvasContext);

    const handleSave = async () => {
        const result = await saveIdentityCanvas(values);
        if (result.success) {
            alert("저장되었습니다.");
        } else {
            alert(result.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getIdentityCanvas();
            if (result.success && result.data) {
                loadFromResponse(result.data);
            }
        };
        fetchData();
    }, []);

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
                    <button className="save-button" onClick={handleSave}>저장</button>
                    <button className="submit-button">제출완료</button>
                </div>
            </div>

            <IdentityCanvasLayout />
        </div>
    );
};

const IdentityCanvasScreen = ({ onNavigate }) => {
    return (
        <IdentityCanvasProvider>
            <IdentityCanvasInner onNavigate={onNavigate} />
        </IdentityCanvasProvider>
    );
};

export default IdentityCanvasScreen;
