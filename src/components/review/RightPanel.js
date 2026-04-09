import { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { getFundingPortfolio, getFundingScores } from "../../services/fundingService";
import { CHART_COLORS, CHART_BORDERS, formatNumber } from "../../constants/teachDetail2Constants";

const RightPanel = ({ type }) => {
    const donutRef = useRef(null);
    const lineRef = useRef(null);
    const donutChart = useRef(null);
    const lineChart = useRef(null);
    const [portfolio, setPortfolio] = useState(null);
    const [scores, setScores] = useState(null);
    const [donutHidden, setDonutHidden] = useState({});
    const [lineHidden, setLineHidden] = useState({});

    const toggleDonut = (i) => {
        const chart = donutChart.current;
        if (!chart) return;
        const meta = chart.getDatasetMeta(0);
        const isHidden = !donutHidden[i];
        meta.data[i].hidden = isHidden;
        chart.update();
        setDonutHidden(prev => ({ ...prev, [i]: isHidden }));
    };

    const toggleLine = (i) => {
        const chart = lineChart.current;
        if (!chart) return;
        const isHidden = !lineHidden[i];
        chart.setDatasetVisibility(i, !isHidden);
        chart.update();
        setLineHidden(prev => ({ ...prev, [i]: isHidden }));
    };

    const canvasType = type === "quickwin" ? "quick" : "build";

    useEffect(() => {
        const fetchData = async () => {
            const [pResult, sResult] = await Promise.all([
                getFundingPortfolio(canvasType),
                getFundingScores(canvasType),
            ]);
            if (pResult.success) setPortfolio(pResult.data);
            if (sResult.success) setScores(sResult.data);
        };
        fetchData();
    }, [canvasType]);

    // 도넛 차트
    useEffect(() => {
        if (donutChart.current) { donutChart.current.destroy(); donutChart.current = null; }
        if (!portfolio || !donutRef.current || !donutRef.current.isConnected) return;

        const items = portfolio.investments || [];
        donutChart.current = new Chart(donutRef.current, {
            type: "doughnut",
            data: {
                labels: items.map(p => p.teamName),
                datasets: [{
                    data: items.map(p => p.investmentPrice),
                    backgroundColor: CHART_COLORS.slice(0, items.length),
                    borderColor: "#fff",
                    borderWidth: 2,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 200,
                cutout: "45%",
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatNumber(ctx.raw)}원` } },
                },
                animation: { animateRotate: true, animateScale: true, duration: 1000 },
            },
        });

        return () => { if (donutChart.current) { donutChart.current.destroy(); donutChart.current = null; } };
    }, [portfolio]);

    // 라인 차트
    useEffect(() => {
        if (lineChart.current) { lineChart.current.destroy(); lineChart.current = null; }
        if (!scores || !lineRef.current || !lineRef.current.isConnected) return;

        const teams = scores.teamScores || [];
        lineChart.current = new Chart(lineRef.current, {
            type: "line",
            data: {
                labels: [["Problem", "(문제정의)"], ["Solution", "(솔루션)"], type === "quickwin" ? ["Action", "(실행력)"] : ["Scale up", "(성장성)"], ["Effect", "(파급효과)"]],
                datasets: teams.map((t, i) => ({
                    label: t.teamName,
                    data: [t.problemScore, t.solutionScore, t.scaleUpScore, t.effectScore],
                    borderColor: CHART_BORDERS[i % CHART_BORDERS.length],
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                    tension: 0,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 2,
                    fill: false,
                })),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 200,
                layout: { padding: { top: 8 } },
                scales: {
                    y: {
                        suggestedMin: 0,
                        suggestedMax: 30,
                        ticks: {
                            stepSize: 5,
                            padding: 8,
                            font: { family: "Inter", size: 12, weight: "400" },
                            color: "#999999",
                        },
                        grid: { color: "#D7D7D7" },
                        border: { display: false },
                    },
                    x: {
                        offset: true,
                        ticks: {
                            padding: 10,
                            font: { family: "Pretendard", size: 14, weight: "600" },
                            color: "#555555",
                        },
                        grid: { display: true, color: "#EBEBEB" },
                        border: { display: true, color: "#D7D7D7" },
                    },
                },
                plugins: {
                    legend: { display: false },
                },
                animation: { duration: 1200, easing: "easeOutQuart" },
            },
        });

        return () => { if (lineChart.current) { lineChart.current.destroy(); lineChart.current = null; } };
    }, [scores, type]);

    const investments = portfolio?.investments || [];

    return (
        <div className="ir-right">
            {/* 예산 투자 포트폴리오 */}
            <div className="ir-right-card ir-card-portfolio">
                <div className="ir-right-card-title">예산 투자 포트폴리오</div>
                <div className="ir-portfolio-scroll">
                    <div className="ir-portfolio-header">
                        <span>투자 대상</span>
                        <span>투자 금액</span>
                    </div>
                    {investments.map((p) => (
                        <div key={p.teamName} className="ir-portfolio-row">
                            <span className="ir-portfolio-name">{p.teamName}</span>
                            <span className="ir-portfolio-amount">{formatNumber(p.investmentPrice)} 원</span>
                        </div>
                    ))}
                    {investments.length === 0 && (
                        <div className="ir-portfolio-row" style={{ justifyContent: "center", color: "#999" }}>
                            투자 내역이 없습니다.
                        </div>
                    )}
                </div>
            </div>

            {/* 투자 포트폴리오 현황 (도넛) */}
            <div className="ir-right-card ir-card-donut">
                <div className="ir-right-card-title">투자 포트폴리오 현황</div>
                <div className="ir-line-legend">
                    {investments.map((p, i) => (
                        <div key={p.teamName} className="ir-line-legend-item" onClick={() => toggleDonut(i)} style={{ cursor: "pointer", opacity: donutHidden[i] ? 0.4 : 1 }}>
                            <span className="ir-line-legend-box" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                            <span className="ir-line-legend-label">{p.teamName}</span>
                        </div>
                    ))}
                </div>
                <div className="ir-chart-box ir-chart-donut">
                    <canvas ref={donutRef} />
                </div>
            </div>

            {/* 나의 아이디어 및 BM 평가 현황 (라인) */}
            <div className="ir-right-card ir-card-line">
                <div className="ir-right-card-title">나의 아이디어 및 BM 평가 현황</div>
                <div className="ir-line-legend">
                    {(scores?.teamScores || []).map((t, i) => (
                        <div key={t.teamName} className="ir-line-legend-item" onClick={() => toggleLine(i)} style={{ cursor: "pointer", opacity: lineHidden[i] ? 0.4 : 1 }}>
                            <span className="ir-line-legend-box" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                            <span className="ir-line-legend-label">{t.teamName}</span>
                        </div>
                    ))}
                </div>
                <div className="ir-chart-box ir-chart-line">
                    <canvas ref={lineRef} />
                </div>
            </div>
        </div>
    );
};

export default RightPanel;
