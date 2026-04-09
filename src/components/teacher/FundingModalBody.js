import { useState, useEffect, useRef, useMemo } from "react";
import { Chart } from "chart.js";
import { CHART_COLORS, CHART_BORDERS, QUICK_WIN_QUESTIONS, BUILD_WIN_QUESTIONS, SCORE_MAP, formatNumber } from "../../constants/teachDetail2Constants";

/* ── 실행과제 검증 모달 본문 (ImpactReviewScreen 1차/2차 탭과 동일 레이아웃) ── */
const FundingModalBody = ({ data, type, teamId }) => {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const donutRef = useRef(null);
    const lineRef = useRef(null);
    const donutChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const [donutHidden, setDonutHidden] = useState({});
    const [lineHidden, setLineHidden] = useState({});

    const filtered = useMemo(() => data.filter(d => d.investmentTarget !== teamId), [data, teamId]);
    const questions = type === "quick" ? QUICK_WIN_QUESTIONS : BUILD_WIN_QUESTIONS;
    const current = filtered[selectedIdx] || null;
    const investments = useMemo(() => filtered.filter(d => d.investmentPrice && Number(d.investmentPrice) > 0), [filtered]);

    const toggleDonut = (i) => {
        const chart = donutChartRef.current;
        if (!chart) return;
        const meta = chart.getDatasetMeta(0);
        const isHidden = !donutHidden[i];
        meta.data[i].hidden = isHidden;
        chart.update();
        setDonutHidden(prev => ({ ...prev, [i]: isHidden }));
    };
    const toggleLine = (i) => {
        const chart = lineChartRef.current;
        if (!chart) return;
        const isHidden = !lineHidden[i];
        chart.setDatasetVisibility(i, !isHidden);
        chart.update();
        setLineHidden(prev => ({ ...prev, [i]: isHidden }));
    };

    // 도넛 차트
    useEffect(() => {
        if (donutChartRef.current) { donutChartRef.current.destroy(); donutChartRef.current = null; }
        if (!donutRef.current || investments.length === 0) return;

        donutChartRef.current = new Chart(donutRef.current, {
            type: "doughnut",
            data: {
                labels: investments.map(d => d.teamName),
                datasets: [{
                    data: investments.map(d => Number(d.investmentPrice)),
                    backgroundColor: CHART_COLORS.slice(0, investments.length),
                    borderColor: "#000000",
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "45%",
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatNumber(ctx.raw)}원` } },
                },
                animation: { animateRotate: true, animateScale: true, duration: 1000 },
            },
        });

        return () => { if (donutChartRef.current) { donutChartRef.current.destroy(); donutChartRef.current = null; } };
    }, [filtered]);

    // 라인 차트
    useEffect(() => {
        if (lineChartRef.current) { lineChartRef.current.destroy(); lineChartRef.current = null; }
        if (!lineRef.current || filtered.length === 0) return;

        lineChartRef.current = new Chart(lineRef.current, {
            type: "line",
            data: {
                labels: [["Problem", "(문제정의)"], ["Solution", "(솔루션)"], type === "quick" ? ["Action", "(실행력)"] : ["Scale up", "(성장성)"], ["Effect", "(파급효과)"]],
                datasets: filtered.map((d, i) => ({
                    label: d.teamName,
                    data: [
                        (d.score1 || 0) + (d.score2 || 0),
                        (d.score3 || 0) + (d.score4 || 0) + (d.score5 || 0),
                        (d.score6 || 0) + (d.score7 || 0),
                        (d.score8 || 0) + (d.score9 || 0),
                    ],
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
                layout: { padding: { top: 8 } },
                scales: {
                    y: {
                        suggestedMin: 0, suggestedMax: 30,
                        ticks: { stepSize: 5, padding: 8, font: { family: "Inter", size: 12, weight: "400" }, color: "#999999" },
                        grid: { color: "#D7D7D7" },
                        border: { display: false },
                    },
                    x: {
                        offset: true,
                        ticks: { padding: 10, font: { family: "Pretendard", size: 13, weight: "600" }, color: "#555555" },
                        grid: { display: true, color: "#EBEBEB" },
                        border: { display: true, color: "#D7D7D7" },
                    },
                },
                plugins: { legend: { display: false } },
                animation: { duration: 1200, easing: "easeOutQuart" },
            },
        });

        return () => { if (lineChartRef.current) { lineChartRef.current.destroy(); lineChartRef.current = null; } };
    }, [filtered, type]);

    return (
        <div className="fm-body">
            {/* 왼쪽: 평가 폼 (읽기전용) */}
            <div className="fm-left">
                <div className="fm-left-card">
                    <div className="ir-form-title" style={{ fontSize: 20 }}>
                        {type === "quick" ? "Quick Win 실행과제 평가" : "Build Win 실행과제 평가"}
                    </div>

                    {/* 평가자 */}
                    <div className="ir-field-group">
                        <div className="ir-field-label">평가자</div>
                        <div className="ir-field-box" style={{ width: "100%" }}>
                            <select value={selectedIdx} onChange={(e) => setSelectedIdx(Number(e.target.value))}>
                                {filtered.map((d, i) => (
                                    <option key={d.teamName} value={i}>{d.teamName}{d.submitted ? " (제출완료)" : " (미제출)"}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 실행 과제명 */}
                    <div className="ir-field-group">
                        <div className="ir-field-label">실행 과제명</div>
                        <div className="ir-field-box" style={{ width: "100%" }}>
                            <input value={current?.businessName || ""} readOnly placeholder="과제명 없음" />
                        </div>
                    </div>

                    {/* 투자 예산 */}
                    <div className="ir-field-group">
                        <div className="ir-field-label">투자 예산</div>
                        <div className="ir-field-box" style={{ width: "100%" }}>
                            <input className="ir-budget-value" value={current?.investmentPrice ? formatNumber(Number(current.investmentPrice)) : "-"} readOnly />
                            <span className="ir-field-unit">원</span>
                        </div>
                    </div>

                    {/* 검증 문항 */}
                    <div className="ir-eval-area">
                        {questions.map((group, gi) => (
                            <div className="ir-eval-group" key={gi}>
                                <div className="ir-eval-group-title">{group.category.replace(/\n/g, ' ')}</div>
                                {group.items.map(item => {
                                    const val = current ? current[SCORE_MAP[item.no]] : null;
                                    return (
                                        <div className="ir-eval-row" key={item.no}>
                                            <span className="ir-eval-badge">{item.no}</span>
                                            <span className="ir-eval-text">{item.q}</span>
                                            <div className="ir-eval-score-wrap">
                                                <span style={{ fontFamily: "Pretendard", fontSize: 16, fontWeight: 600, color: "#6B7079" }}>
                                                    {val != null ? val + "점" : "-"}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* 종합의견 */}
                        <div className="ir-opinion-section">
                            <div className="ir-opinion-title">종합의견</div>
                            <div className="ir-opinion-box">
                                <textarea value={current?.opinion || ""} readOnly placeholder="의견 없음" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 오른쪽: 포트폴리오 + 차트 */}
            <div className="fm-right">
                {/* 예산 투자 포트폴리오 */}
                <div className="ir-right-card" style={{ padding: "32px 28px 28px" }}>
                    <div className="ir-right-card-title" style={{ fontSize: 20 }}>예산 투자 포트폴리오</div>
                    <div className="ir-portfolio-header"><span>투자 대상</span><span>투자 금액</span></div>
                    {investments.map((p) => (
                        <div key={p.teamName} className="ir-portfolio-row">
                            <span className="ir-portfolio-name">{p.teamName}</span>
                            <span className="ir-portfolio-amount">{formatNumber(Number(p.investmentPrice))} 원</span>
                        </div>
                    ))}
                    {investments.length === 0 && (
                        <div className="ir-portfolio-row" style={{ justifyContent: "center", color: "#999" }}>투자 내역이 없습니다.</div>
                    )}
                </div>

                {/* 투자 포트폴리오 현황 (도넛) */}
                <div className="ir-right-card" style={{ padding: "32px 28px 28px" }}>
                    <div className="ir-right-card-title" style={{ fontSize: 20 }}>투자 포트폴리오 현황</div>
                    <div className="ir-line-legend">
                        {investments.map((p, i) => (
                            <div key={p.teamName} className="ir-line-legend-item" onClick={() => toggleDonut(i)} style={{ cursor: "pointer", opacity: donutHidden[i] ? 0.4 : 1 }}>
                                <span className="ir-line-legend-box" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                                <span className="ir-line-legend-label">{p.teamName}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ position: "relative", height: 250 }}><canvas ref={donutRef} /></div>
                </div>

                {/* 평가 현황 (라인) */}
                <div className="ir-right-card" style={{ padding: "32px 28px 28px" }}>
                    <div className="ir-right-card-title" style={{ fontSize: 20 }}>나의 아이디어 및 BM 평가 현황</div>
                    <div className="ir-line-legend">
                        {filtered.map((d, i) => (
                            <div key={d.teamName} className="ir-line-legend-item" onClick={() => toggleLine(i)} style={{ cursor: "pointer", opacity: lineHidden[i] ? 0.4 : 1 }}>
                                <span className="ir-line-legend-box" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                                <span className="ir-line-legend-label">{d.teamName}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ position: "relative", height: 250 }}><canvas ref={lineRef} /></div>
                </div>
            </div>
        </div>
    );
};

export default FundingModalBody;
