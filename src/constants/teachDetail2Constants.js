import { useState, useEffect, useRef, useMemo } from "react";
import { Chart, BarController, BarElement, DoughnutController, ArcElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarController, BarElement, DoughnutController, ArcElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export const CHART_COLORS = [
    "#7B87F5", "#8AEAFF", "#3CDFC2", "#F5D562",
    "#F5A623", "#E86B6B",
];
export const CHART_BORDERS = [
    "#7B87F5", "#8AEAFF", "#3CDFC2", "#F5D562",
    "#F5A623", "#E86B6B",
];

export const formatNumber = (num) => Number(num).toLocaleString();

export const SCORE_MAP = { A1: "score1", A2: "score2", B1: "score3", B2: "score4", B3: "score5", C1: "score6", C2: "score7", D1: "score8", D2: "score9" };

export const QUICK_WIN_QUESTIONS = [
    { category: "Problem\n(문제정의)", rowSpan: 2, items: [
        { no: "A1", q: "[현실성] 성과를 가로막는 구체적인 병목(Bottleneck)이나 장애요인을 정확히 포착했는가?", score: 10 },
        { no: "A2", q: "[시급성] 왜 '지금 당장' 이 문제를 해결해야 하는지에 대한 이유가 설득력 있는가?", score: 5 },
    ]},
    { category: "Solution\n(솔루션)", rowSpan: 3, items: [
        { no: "B1", q: "[구체성] 내일 당장 실행에 옮길 수 있을 만큼 행동 계획(Action Plan)이 구체적인가?", score: 10 },
        { no: "B2", q: "[신속성] 거창한 예산이나 긴 시간 없이, 현재 자원으로 즉시 해결 가능한 방법인가?", score: 5 },
        { no: "B3", q: "[차별성] 기존의 관행을 깨고 장애물을 단숨에 제거할 수 있는 차별화된 접근인가?", score: 15 },
    ]},
    { category: "Action\n(실행력)", rowSpan: 2, items: [
        { no: "C1", q: "[검증성] 완벽함보다 빠르게 시도(Test)하고 수정(Fix)할 수 있는 구조인가?", score: 10 },
        { no: "C2", q: "[가시성] 실행 결과가 모호하지 않고, O/X로 명확하게 확인 가능한 과제인가?", score: 15 },
    ]},
    { category: "Effect\n(파급효과)", rowSpan: 2, items: [
        { no: "D1", q: "[성과] 6개월 이내에 조직 분위기를 바꿀 수 있는 '작은 성공(Small Success)'을 만드는가?", score: 15 },
        { no: "D2", q: "[효율] 실행 즉시, 일하는 방식이나 판단 흐름에 눈에 보이는 변화를 만드는가?", score: 15 },
    ]},
];

export const BUILD_WIN_QUESTIONS = [
    { category: "Problem\n(문제정의)", rowSpan: 2, items: [
        { no: "A1", q: "[중요성] 표면적 현상이 아닌, 조직 경쟁력을 강화하는 수준의 과제인가?", score: 10 },
        { no: "A2", q: "[정합성] 과제의 해결이 조직의 장기적 비전 및 핵심가치와 긴밀하게 연결(Align)되는가?", score: 15 },
    ]},
    { category: "Solution\n(솔루션)", rowSpan: 3, items: [
        { no: "B1", q: "[타당성] 단순히 감이나 주장이 아닌, 합리적인 근거(Facts/Logic)에 기반하여 제시하고 있는가?", score: 10 },
        { no: "B2", q: "[지속성] 특정인의 역량에 의존하지 않고, '프로세스'에 의해 일관된 결과가 나올 수 있는가?", score: 10 },
        { no: "B3", q: "[자산화] 일회성 해결을 넘어, 우리 조직만의 고유한 자산(노하우, 방법론)으로 남는가?", score: 10 },
    ]},
    { category: "Scale up\n(확장성)", rowSpan: 2, items: [
        { no: "C1", q: "[확장성] 특정 개인/부서를 넘어, 전사적으로 연계될 수 있는 제안인가?", score: 10 },
        { no: "C2", q: "[표준화] 이해당사자들이 누구나 직관적으로 이해하고 실행할 수 있는가?", score: 10 },
    ]},
    { category: "Effect\n(파급효과)", rowSpan: 2, items: [
        { no: "D1", q: "[펀더멘털] 미래의 시장 변화나 위기에 대응할 수 있는 펀더멘털을 높이는가?", score: 15 },
        { no: "D2", q: "[내재화] 일회성 이벤트로 끝나지 않고, 새로운 문화나 제도로 정착(Embed)될 수 있는가?", score: 10 },
    ]},
];

/* ── 실행과제 검증 모달 본문 (ImpactReviewScreen 1차/2차 탭과 동일 레이아웃) ── */
export const FundingModalBody = ({ data, type, teamId }) => {
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
        if (!donutRef.current) return;
        if (donutChartRef.current) donutChartRef.current.destroy();
        if (investments.length === 0) return;

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

        return () => { if (donutChartRef.current) donutChartRef.current.destroy(); };
    }, [filtered]);

    // 라인 차트
    useEffect(() => {
        if (!lineRef.current) return;
        if (lineChartRef.current) lineChartRef.current.destroy();
        if (filtered.length === 0) return;

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

        return () => { if (lineChartRef.current) lineChartRef.current.destroy(); };
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

/* ── F-3 최종 결과 모달 본문 ── */
export const FundingResultModalBody = ({ data }) => {
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

/* 단계 설정 데이터 */
export const stepConfig = [
    {
        key: "A", label: "[A] 성과관리 현황진단", colorClass: "step-a",
        items: [
            { value: "A-1", label: "A-1 성과관리 현황진단" },
        ]
    },
    {
        key: "B", label: "[B] 정체성 설계", colorClass: "step-b",
        items: [
            { value: "B-1", label: "B-1 정체성 설계" },
        ]
    },
    {
        key: "C", label: "[C] 성과경로 설계", colorClass: "step-c",
        items: [
            { value: "C-1", label: "C-1 성과경로 설계" },
        ]
    },
    {
        key: "D", label: "[D] 전술적 실행과제", colorClass: "step-d",
        items: [
            { value: "D-1", label: "D-1 전술적 실행과제" },
        ]
    },
    {
        key: "E", label: "[E] 전략적 실행과제", colorClass: "step-e",
        items: [
            { value: "E-1", label: "E-1 전략적 실행과제" },
        ]
    },
    {
        key: "F", label: "[F] 실행과제 검증", colorClass: "step-f",
        items: [
            { value: "F-1", label: "F-1 quick win평가" },
            { value: "F-2", label: "F-2 build win평가" },
            { value: "F-3", label: "F-3 최종결과 확인" },
        ]
    },
];

/* 미션확인 데이터 */
export const missionRows = [
    {
        code: "A", name: "성과관리 현황진단", bgHead: "td2-bg-a", bgItem: "td2-bg-a-light",
        items: [{ code: "A-1", name: "성과관리 현황진단" }]
    },
    {
        code: "B", name: "정체성 설계", bgHead: "td2-bg-b", bgItem: "td2-bg-b-light",
        items: [{ code: "B-1", name: "정체성 설계" }]
    },
    {
        code: "C", name: "성과경로 설계", bgHead: "td2-bg-c", bgItem: "td2-bg-c-light",
        items: [{ code: "C-1", name: "성과경로 설계" }]
    },
    {
        code: "D", name: "전술적 실행과제", bgHead: "td2-bg-d", bgItem: "td2-bg-d-light",
        items: [{ code: "D-1", name: "전술적 실행과제" }]
    },
    {
        code: "E", name: "전략적 실행과제", bgHead: "td2-bg-e", bgItem: "td2-bg-e-light",
        items: [{ code: "E-1", name: "전략적 실행과제" }]
    },
    {
        code: "F", name: "실행과제 검증", bgHead: "td2-bg-f", bgItem: "td2-bg-f-light",
        items: [{ code: "F-1", name: "quickwin평가" }, { code: "F-2", name: "buildwin평가" }, { code: "F-3", name: "최종결과 확인" }]
    },
];


/* stepArr → checkedSteps 변환
   새 포맷: ["A-1","B-1","F-1","F-2"] → 그대로 사용
   구 포맷: ["A","B"] → 그룹 키를 하위 항목으로 확장 */
export const stepArrToChecked = (stepArr) => {
    if (!stepArr || stepArr.length === 0) return [];
    const checked = [];
    stepArr.forEach(val => {
        if (val.includes("-")) {
            checked.push(val);
        } else {
            const group = stepConfig.find(g => g.key === val);
            if (group) group.items.forEach(item => checked.push(item.value));
        }
    });
    return checked;
};

/* ImpactCheck 질문 목록 */
export const impactQuestions = [
    { no: 1, text: "[방향성] 나는 우리 조직이 나아가려는 '미래의 모습(Vision)'이 무엇인지 머릿속에 명확하게 그려진다." },
    { no: 2, text: "[필요성] 현재의 방식에 머무르기보다, 더 큰 성과를 위해 '변화가 필요하다'는 점에 깊이 공감한다." },
    { no: 3, text: "[수용성] 더 나은 결과를 위해서라면, 익숙했던 기존의 관행이나 내 방식을 '새롭게 바꿀 의지'가 있다." },
    { no: 4, text: "[지표화] 나의 목표는 모호한 표현이 아닌, 달성 여부를 O/X로 가릴 수 있는 '명확한 지표(숫자)'로 설정되어 있다." },
    { no: 5, text: "[연계성] 내가 매일 수행하는 업무의 80% 이상은 우리 팀의 '핵심 목표(KPI) 달성'과 직접적으로 연결되어 있다." },
    { no: 6, text: "[합의] 리더와 나는 올해 달성해야 할 성과의 수준(기대치)에 대해 동일하게 인식하고 있다." },
    { no: 7, text: "[속도] 우리 조직은 완벽한 계획을 세우는 것보다, 일단 실행하고 빠르게 개선(Test & Fix)하는 것을 더 선호한다." },
    { no: 8, text: "[장애물] 성과 창출을 방해하는 장애물(불필요한 보고 등)이 발견되면, 이를 즉시 제거하거나 간소화한다." },
    { no: 9, text: "[작은승리] 최근 3개월 이내에, 업무 현장에서 작지만 확실하게 개선해낸 '성공 사례(Small Success)'가 있다." },
    { no: 10, text: "[시스템] 핵심 인재(Ace)가 퇴사하더라도, 기존의 성과 수준을 유지할 수 있는 '매뉴얼'이나 '시스템'이 있다." },
    { no: 11, text: "[자산화] 주요 과업이나 프로젝트가 마무리되면 수행 과정을 돌아보고 '조직의 자산(매뉴얼/노하우)'으로 남긴다." },
    { no: 12, text: "[데이터] 개인의 감이나 경험이 아닌, 축적된 데이터와 '프로세스'에 기반하여 의사결정을 내린다." },
    { no: 13, text: "현재 귀하가 인지하고 있는 우리 조직의 '핵심가치'는 무엇입니까?", type: "text" },
    { no: 14, text: "올해 귀하의 성과 평가를 결정짓는 '핵심 목표(KPI) 1가지'는 무엇입니까?", type: "text" },
    { no: 15, text: "경쟁력 강화를 위해 장기적으로 추진 중인 조직의 '핵심 과제'는 무엇입니까?", type: "text" },
    { no: 16, text: "지금 당장 성과를 내는 데 방해가 되는 '결정적 장애물'은 무엇입니까?", type: "text" },
];
