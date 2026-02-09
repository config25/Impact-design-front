import { useState, useEffect, useContext } from "react";
import "./IdentityCanvasScreen.css";
import GNB from "../components/common/GNB";
import IdentityCanvasLayout from "../components/identity/IdentityCanvasLayout";
import pencil2 from "../resource/quick/pencil2.png";
import { getIdentityCanvas, saveIdentityCanvas, submitIdentityCanvas } from "../services/identityCanvasService";
import { IdentityCanvasProvider, IdentityCanvasContext } from "../contexts/IdentityCanvasContext";

const IdentityCanvasInner = ({ onNavigate }) => {
    const { values, loadFromResponse } = useContext(IdentityCanvasContext);
    const [submitted, setSubmitted] = useState(false);

    const handleSave = async () => {
        const result = await saveIdentityCanvas(values);
        if (result.success) {
            alert("저장되었습니다.");
        } else {
            alert(result.message);
        }
    };

    const handleSubmit = async () => {
        if (submitted) return;
        if (!window.confirm("제출완료 후에는 수정이 불가능합니다. 제출하시겠습니까?")) return;
        const result = await submitIdentityCanvas();
        if (result.success) {
            setSubmitted(true);
            alert("제출이 완료되었습니다.");
        } else {
            alert(result.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getIdentityCanvas();
            if (result.success && result.data) {
                loadFromResponse(result.data);
                setSubmitted(result.data.submitted || false);
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
                    <button className="save-button" onClick={handleSave} disabled={submitted}>저장</button>
                    <button className="submit-button" onClick={handleSubmit} disabled={submitted}>{submitted ? "제출됨" : "제출완료"}</button>
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
