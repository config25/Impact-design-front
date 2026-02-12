import { useState, useEffect, useContext } from "react";
import "./IdentityCanvasScreen.css";
import GNB from "../components/common/GNB";
import TipsModal from "../components/common/TipsModal";
import IdentityCanvasLayout from "../components/identity/IdentityCanvasLayout";
import pencil2 from "../resource/quick/pencil2.png";
import { getIdentityCanvas, saveIdentityCanvas, submitIdentityCanvas } from "../services/identityCanvasService";
import { getImageUrl } from "../utils/logoUtil";
import { IdentityCanvasProvider, IdentityCanvasContext } from "../contexts/IdentityCanvasContext";

const IdentityCanvasInner = ({ onNavigate }) => {
    const { values, loadFromResponse } = useContext(IdentityCanvasContext);
    const [submitted, setSubmitted] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [logoUrl, setLogoUrl] = useState(null);

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
                if (result.data.imageUrl) setLogoUrl(getImageUrl(result.data.imageUrl));
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
                    <button className="tips-button" onClick={() => setShowTips(true)}>
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

            <IdentityCanvasLayout logoUrl={logoUrl} />

            <TipsModal
                show={showTips}
                onClose={() => setShowTips(false)}
                title="정체성 설계"
                concept={`Strategic Identity Canvas는 조직의 과거 유산(Legacy)과 현재 직면한 위협 요인(Threats)을 분석하고, 이를 바탕으로 새로운 정체성(New Identity)을 설계하는 전략 도구입니다.\n\n조직이 '왜 존재하는가', '무엇을 지켜야 하는가', '어떤 변화가 필요한가'를 체계적으로 정리함으로써, 전략의 출발점이 되는 정체성을 명확히 합니다.`}
                method={`1. Legacy(유산): 우리 조직이 지금까지 쌓아온 핵심 자산, 강점, 문화적 유산을 정리합니다.\n2. Threats(위협): 현재 조직이 직면한 외부 환경 변화, 내부 위협 요인을 분석합니다.\n3. New Identity(새로운 정체성): Legacy를 기반으로 Threats를 극복할 수 있는 새로운 조직 정체성을 선언합니다.\n\n작성 순서: Legacy → Threats → New Identity 순으로, 과거와 현재를 분석한 뒤 미래 방향을 설계하세요.`}
            />
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
