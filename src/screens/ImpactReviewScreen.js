import { useState } from "react";
import GNB from "../components/common/GNB";
import { useGameStep } from "../contexts/GameStepContext";
import "./ImpactReviewScreen.css";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, LineController, LineElement, PointElement, CategoryScale, LinearScale, BarController, BarElement } from "chart.js";
import { QUICK_WIN_QUESTIONS, BUILD_WIN_QUESTIONS } from "../constants/teachDetail2Constants";
import EvalForm from "../components/review/EvalForm";
import RightPanel from "../components/review/RightPanel";
import ResultTab from "../components/review/ResultTab";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, LineController, LineElement, PointElement, CategoryScale, LinearScale, BarController, BarElement);

const ImpactReviewScreen = () => {
    const { gameStep } = useGameStep();
    const steps = gameStep ? gameStep.split(",").map(s => s.trim()) : [];
    const hasSubStep = (code) => !gameStep || steps.includes(code) || steps.includes("F");
    const tabAllowed = [hasSubStep("F-1"), hasSubStep("F-2"), hasSubStep("F-3")];
    const firstAllowed = tabAllowed.indexOf(true);
    const [activeTab, setActiveTab] = useState(firstAllowed >= 0 ? firstAllowed : 0);

    const handleTab = (idx) => {
        if (tabAllowed[idx]) setActiveTab(idx);
    };

    return (
        <div className="ir-container">
            <GNB activeScreen="review" />

            <div className="ir-sub-header">
                <div className="ir-tab-bar">
                    <button
                        className={`ir-tab-btn ${activeTab === 0 ? "active" : ""}`}
                        onClick={() => handleTab(0)}
                        disabled={!tabAllowed[0]}
                        style={!tabAllowed[0] ? { opacity: 0.3, cursor: "not-allowed" } : {}}
                    >
                        1차 - Quick Win 평가
                    </button>
                    <div className="ir-tab-divider" />
                    <button
                        className={`ir-tab-btn ${activeTab === 1 ? "active" : ""}`}
                        onClick={() => handleTab(1)}
                        disabled={!tabAllowed[1]}
                        style={!tabAllowed[1] ? { opacity: 0.3, cursor: "not-allowed" } : {}}
                    >
                        2차 - Build Win 평가
                    </button>
                    <div className="ir-tab-divider" />
                    <button
                        className={`ir-tab-btn ${activeTab === 2 ? "active" : ""}`}
                        onClick={() => handleTab(2)}
                        disabled={!tabAllowed[2]}
                        style={!tabAllowed[2] ? { opacity: 0.3, cursor: "not-allowed" } : {}}
                    >
                        완료 - 최종 결과
                    </button>
                </div>
            </div>

            {/* 탭 컨텐츠 */}
            {activeTab === 0 && (
                <div className="ir-body">
                    <EvalForm
                        type="quickwin"
                        questions={QUICK_WIN_QUESTIONS}
                        title="Quick Win 실행과제 평가"
                    />
                    <RightPanel type="quickwin" />
                </div>
            )}

            {activeTab === 1 && (
                <div className="ir-body">
                    <EvalForm
                        type="buildwin"
                        questions={BUILD_WIN_QUESTIONS}
                        title="Build Win 실행과제 평가"
                    />
                    <RightPanel type="buildwin" />
                </div>
            )}

            {activeTab === 2 && (
                <ResultTab />
            )}
        </div>
    );
};

export default ImpactReviewScreen;
