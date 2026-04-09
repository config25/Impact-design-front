import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

/* ── F-3 최종 결과 모달 본문 ── */
const FundingResultModalBody = ({ data }) => {
    const qwBarRef = useRef(null);
    const bwBarRef = useRef(null);
    const qwChart = useRef(null);
    const bwChart = useRef(null);

    useEffect(() => {
        if (!data) return;

        const qwScores = data.quick?.scores;
        const bwScores = data.build?.scores;

        if (qwBarRef.current) {
            if (qwChart.current) qwChart.current.destroy();
            qwChart.current = createBarChart(qwBarRef.current,
                qwScores ? [qwScores.problemScore, qwScores.solutionScore, qwScores.scaleUpScore, qwScores.effectScore] : [0, 0, 0, 0],
                ["Problem\n(문제정의)", "Solution\n(솔루션)", "Action\n(실행력)", "Effect\n(파급효과)"]
            );
        }
        if (bwBarRef.current) {
            if (bwChart.current) bwChart.current.destroy();
            bwChart.current = createBarChart(bwBarRef.current,
                bwScores ? [bwScores.problemScore, bwScores.solutionScore, bwScores.scaleUpScore, bwScores.effectScore] : [0, 0, 0, 0],
                ["Problem\n(문제정의)", "Solution\n(솔루션)", "Scale up\n(확장성)", "Effect\n(파급효과)"]
            );
        }

        return () => {
            if (qwChart.current) qwChart.current.destroy();
            if (bwChart.current) bwChart.current.destroy();
        };
    }, [data]);

    const createBarChart = (canvas, chartData, labels) => {
        if (!canvas) return null;
        return new Chart(canvas, {
            type: "bar",
            data: {
                labels: labels.map(l => l.split("\n")),
                datasets: [{
                    label: "청중평가",
                    data: chartData,
                    backgroundColor: "#7B87F5",
                    hoverBackgroundColor: "#5364F7",
                    borderRadius: 0,
                    barPercentage: 0.45,
                    categoryPercentage: 0.6,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: { top: 10 } },
                scales: {
                    y: {
                        min: 0, max: 10,
                        ticks: { stepSize: 1, font: { family: "Inter", size: 12, weight: "400" }, color: "#999999" },
                        grid: { color: "#D7D7D7" },
                        border: { display: false },
                    },
                    x: {
                        ticks: { font: { family: "Pretendard", size: 14, weight: "600" }, color: "#555555" },
                        grid: { display: false },
                        border: { display: true, color: "#D7D7D7" },
                    },
                },
                plugins: {
                    legend: { display: false },
                    title: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: "#fff",
                        borderColor: "#CACACA",
                        borderWidth: 1,
                        titleColor: "#999",
                        bodyColor: "#999999",
                        bodyFont: { family: "Pretendard", size: 14, weight: "600" },
                        displayColors: false,
                        callbacks: { label: (ctx) => ctx.raw.toFixed(1) },
                    },
                },
                animations: {
                    y: {
                        from: (ctx) => ctx.chart.scales.y.getPixelForValue(0),
                        duration: 1500,
                        easing: "easeOutBounce",
                        delay: (ctx) => ctx.type === "data" ? ctx.dataIndex * 300 : 0,
                    },
                },
            },
        });
    };

    const qwOpinions = data?.quick?.opinions || [];
    const bwOpinions = data?.build?.opinions || [];

    return (
        <div className="fr-body">
            {/* Quick Win 행 */}
            <div className="fr-row">
                <div className="fr-card">
                    <div className="ir-result-title" style={{ fontSize: 20 }}>Quick Win 실행과제평가</div>
                    <div className="ir-result-chart-subtitle">부문별 획득 점수</div>
                    <div className="ir-result-legend"><span className="ir-legend-box" /><span className="ir-legend-label">청중평가</span></div>
                    <div style={{ position: "relative", flex: 1, minHeight: 300 }}>
                        <canvas ref={qwBarRef} />
                    </div>
                </div>
                <div className="fr-card">
                    <div className="ir-opinions-header" style={{ fontSize: 20 }}>평가 참가자 의견</div>
                    <div className="ir-opinions-list">
                        {qwOpinions.length > 0 ? qwOpinions.map((o, i) => (
                            <div key={i} className="ir-opinion-card">{o}</div>
                        )) : (
                            <div className="ir-opinion-card" style={{ color: "#999", textAlign: "center" }}>아직 등록된 의견이 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Build Win 행 */}
            <div className="fr-row">
                <div className="fr-card">
                    <div className="ir-result-title" style={{ fontSize: 20 }}>Build Win 실행과제평가</div>
                    <div className="ir-result-chart-subtitle">부문별 획득 점수</div>
                    <div className="ir-result-legend"><span className="ir-legend-box" /><span className="ir-legend-label">청중평가</span></div>
                    <div style={{ position: "relative", flex: 1, minHeight: 300 }}>
                        <canvas ref={bwBarRef} />
                    </div>
                </div>
                <div className="fr-card">
                    <div className="ir-opinions-header" style={{ fontSize: 20 }}>평가 참가자 의견</div>
                    <div className="ir-opinions-list">
                        {bwOpinions.length > 0 ? bwOpinions.map((o, i) => (
                            <div key={i} className="ir-opinion-card">{o}</div>
                        )) : (
                            <div className="ir-opinion-card" style={{ color: "#999", textAlign: "center" }}>아직 등록된 의견이 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundingResultModalBody;
