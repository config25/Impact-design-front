import { useState, useEffect, useRef, useMemo } from "react";
import { getTeachDetail, updateClass, saveStep, addTeam, addEvaluationTeam, deleteTeam, getDeletedTeams, restoreTeam, getTeamInfo, updateTeamInfo, getSubmissionList, getImpactCheckByTeam, getIdentityCanvasByTeam, getFlowCanvasByTeam, getQuickWinByTeam, getBuildWinByTeam, getFundingByTeam, getFundingResultByTeam, endClass, deleteTeamMembers, setTeamWriter } from "../../services/teacherService";
import { getLogoUrl } from "../../utils/logoUtil";
import { Chart, BarController, BarElement, DoughnutController, ArcElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import "./TeachDetail2.css";
import "../ImpactReviewScreen.css";

Chart.register(BarController, BarElement, DoughnutController, ArcElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const CHART_COLORS = [
    "#7B87F5", "#8AEAFF", "#3CDFC2", "#F5D562",
    "#F5A623", "#E86B6B",
];
const CHART_BORDERS = [
    "#7B87F5", "#8AEAFF", "#3CDFC2", "#F5D562",
    "#F5A623", "#E86B6B",
];

const formatNumber = (num) => Number(num).toLocaleString();

const SCORE_MAP = { A1: "score1", A2: "score2", B1: "score3", B2: "score4", B3: "score5", C1: "score6", C2: "score7", D1: "score8", D2: "score9" };

const QUICK_WIN_QUESTIONS = [
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

const BUILD_WIN_QUESTIONS = [
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
                                    <option key={i} value={i}>{d.teamName}{d.submitted ? " (제출완료)" : " (미제출)"}</option>
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
                    {investments.map((p, i) => (
                        <div key={i} className="ir-portfolio-row">
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
                            <div key={i} className="ir-line-legend-item" onClick={() => toggleDonut(i)} style={{ cursor: "pointer", opacity: donutHidden[i] ? 0.4 : 1 }}>
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
                            <div key={i} className="ir-line-legend-item" onClick={() => toggleLine(i)} style={{ cursor: "pointer", opacity: lineHidden[i] ? 0.4 : 1 }}>
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

/* 단계 설정 데이터 */
const stepConfig = [
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
            { value: "F-1", label: "F-1 quickwin평가" },
            { value: "F-2", label: "F-2 buildwin평가" },
            { value: "F-3", label: "F-3 최종결과 확인" },
        ]
    },
];

/* 미션확인 데이터 */
const missionRows = [
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

/* 날짜 포맷 */
const formatDate = (isoStr) => {
    if (!isoStr) return "-";
    const d = new Date(isoStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}시 ${min}분`;
};

/* stepArr → checkedSteps 변환
   새 포맷: ["A-1","B-1","F-1","F-2"] → 그대로 사용
   구 포맷: ["A","B"] → 그룹 키를 하위 항목으로 확장 */
const stepArrToChecked = (stepArr) => {
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
const impactQuestions = [
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

const TeachDetail2 = ({ onNavigate, params }) => {
    const [gameId] = useState(params?.gameId);
    const [gameInfo, setGameInfo] = useState(null);
    const [teams, setTeams] = useState([]);
    const [checkedSteps, setCheckedSteps] = useState([]);
    const [loading, setLoading] = useState(true);

    /* 미션 열람 모달 */
    const [showMissionModal, setShowMissionModal] = useState(false);
    const [missionModalTitle, setMissionModalTitle] = useState("");
    const [missionModalData, setMissionModalData] = useState(null);
    const [missionModalTeamId, setMissionModalTeamId] = useState(null);

    /* 정체성 설계 열람 모달 */
    const [showIdentityModal, setShowIdentityModal] = useState(false);
    const [identityModalTitle, setIdentityModalTitle] = useState("");
    const [identityModalData, setIdentityModalData] = useState(null);

    /* 성과경로 설계 열람 모달 */
    const [showFlowModal, setShowFlowModal] = useState(false);
    const [flowModalTitle, setFlowModalTitle] = useState("");
    const [flowModalData, setFlowModalData] = useState(null);

    /* 전술적 실행과제 열람 모달 */
    const [showQuickWinModal, setShowQuickWinModal] = useState(false);
    const [quickWinModalTitle, setQuickWinModalTitle] = useState("");
    const [quickWinModalData, setQuickWinModalData] = useState(null);

    /* 전략적 실행과제 열람 모달 */
    const [showBuildWinModal, setShowBuildWinModal] = useState(false);
    const [buildWinModalTitle, setBuildWinModalTitle] = useState("");
    const [buildWinModalData, setBuildWinModalData] = useState(null);

    /* 실행과제 검증 열람 모달 (F-1, F-2) */
    const [showFundingModal, setShowFundingModal] = useState(false);
    const [fundingModalTitle, setFundingModalTitle] = useState("");
    const [fundingModalData, setFundingModalData] = useState(null);
    const [fundingModalType, setFundingModalType] = useState("quick");

    /* 최종 결과 열람 모달 (F-3) */
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultModalTitle, setResultModalTitle] = useState("");
    const [resultModalData, setResultModalData] = useState(null);

    const [showDeletedModal, setShowDeletedModal] = useState(false);
    const [deletedTeams, setDeletedTeams] = useState([]);
    const [selectedDeleted, setSelectedDeleted] = useState([]);

    /* 팀/참여자 정보입력 모달 */
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [modalTeam, setModalTeam] = useState(null);
    const [modalTeamName, setModalTeamName] = useState("");
    const [modalMembers, setModalMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    /* 강의실 수정 모달 */
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [modifyName, setModifyName] = useState("");
    const [modifyMonth, setModifyMonth] = useState(new Date().getMonth() + 1);
    const [modifyDay, setModifyDay] = useState(new Date().getDate());
    const [modifyHour, setModifyHour] = useState(1);
    const [modifyMinute, setModifyMinute] = useState(0);

    /* 제출 기한 */
    const now = new Date();
    const [deadlineYear, setDeadlineYear] = useState(now.getFullYear());
    const [deadlineMonth, setDeadlineMonth] = useState(now.getMonth() + 1);
    const [deadlineDay, setDeadlineDay] = useState(now.getDate());
    const [deadlineHour, setDeadlineHour] = useState(1);
    const [deadlineMinute, setDeadlineMinute] = useState(0);

    /* API 데이터 로드 */
    useEffect(() => {
        if (!gameId) return;
        const fetchData = async () => {
            const [detailResult, submissionResult] = await Promise.all([
                getTeachDetail(gameId),
                getSubmissionList(gameId),
            ]);

            if (detailResult.success) {
                const d = detailResult.data;
                setGameInfo({
                    name: d.name,
                    numTeam: d.numTeam,
                    startdate: d.mission ? formatDate(d.mission.startdate) : "-",
                    enddate: d.mission ? formatDate(d.mission.enddate) : "-",
                    code: d.code,
                    logoUrl: getLogoUrl(d.gameLogo),
                });

                // 제출 현황 데이터를 teamId 기준으로 매핑
                const submissionMap = {};
                if (submissionResult.success) {
                    (submissionResult.data || []).forEach(s => {
                        submissionMap[s.teamId] = s;
                    });
                }

                setTeams((d.teams || []).map(t => {
                    const sub = submissionMap[t.teamId] || {};
                    return {
                        teamId: t.teamId,
                        teamName: t.teamName,
                        numUser: t.numUser,
                        submitA: sub.submitA || t.submitA,
                        submitB: sub.submitB || t.submitB,
                        submitC: sub.submitC || t.submitC,
                        submitD: sub.submitD || t.submitD,
                        submitE: sub.submitE || t.submitE,
                        submitF: sub.submitF || t.submitF,
                    };
                }));
                setCheckedSteps(stepArrToChecked(d.stepArr));

                // 제출 기한 초기값 (mission enddate 기준)
                if (d.mission?.enddate) {
                    const ed = new Date(d.mission.enddate);
                    setDeadlineYear(ed.getFullYear());
                    setDeadlineMonth(ed.getMonth() + 1);
                    setDeadlineDay(ed.getDate());
                    setDeadlineHour(ed.getHours());
                    setDeadlineMinute(Math.floor(ed.getMinutes() / 10) * 10);
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [gameId]);

    /* 강의실 수정 모달 열기 */
    const handleOpenModify = () => {
        if (gameInfo) setModifyName(gameInfo.name);
        setShowModifyModal(true);
    };

    /* 강의실 수정 저장 */
    const handleModifySave = async () => {
        if (!modifyName.trim()) {
            alert("강의실 명을 입력해주세요.");
            return;
        }

        const year = new Date().getFullYear();
        const mm = String(modifyMonth).padStart(2, "0");
        const dd = String(modifyDay).padStart(2, "0");
        const hh = String(modifyHour).padStart(2, "0");
        const min = String(modifyMinute).padStart(2, "0");
        const enddate = `${year}-${mm}-${dd} ${hh}:${min}`;

        const result = await updateClass(gameId, {
            name: modifyName,
            enddate: enddate,
        });

        if (result.success) {
            alert("강의실이 수정되었습니다.");
            setGameInfo(prev => ({ ...prev, name: modifyName }));
            setShowModifyModal(false);
        } else {
            alert(result.message);
        }
    };

    /* 강의실 종료 */
    const handleEndGame = async () => {
        if (!window.confirm("강의실을 종료하시겠습니까?")) return;

        const result = await endClass(gameId);
        if (result.success) {
            alert("강의실이 종료되었습니다.");
            onNavigate("teach_list");
        } else {
            alert(result.message);
        }
    };

    /* 단계 체크박스 */
    const handleStepCheck = (value) => {
        setCheckedSteps(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    /* 단계 저장 - checkedSteps → step 문자열 변환 ("A-1,B-1,F-1,F-2") */
    const handleStepSave = async () => {
        if (checkedSteps.length === 0) {
            alert("단계를 선택해주세요.");
            return;
        }
        if (!window.confirm("저장하시겠습니까?")) return;

        const step = checkedSteps.join(",");

        const result = await saveStep(gameId, step);
        if (result.success) {
            alert("저장되었습니다.");
        } else {
            alert(result.message);
        }
    };

    /* 팀 추가 */
    const handleTeamAdd = async () => {
        if (!window.confirm("팀을 추가하시겠습니까?")) return;

        const result = await addTeam(gameId);
        if (result.success) {
            alert("팀이 추가되었습니다.");
            await refreshTeams();
        } else {
            alert(result.message);
        }
    };

    /* 팀/참여자 정보입력 모달 열기 */
    const handleOpenTeamModal = async (teamId) => {
        const result = await getTeamInfo(teamId);
        if (result.success) {
            setModalTeam(result.data);
            setModalTeamName(result.data.teamName || "");
            setModalMembers(result.data.members || []);
            setSelectedMembers([]);
            setShowTeamModal(true);
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 팀원 체크박스 */
    const handleMemberCheck = (userId) => {
        setSelectedMembers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    /* 모달 - 선택된 팀원 삭제 */
    const handleDeleteMembers = async () => {
        if (selectedMembers.length === 0) {
            alert("삭제할 팀원을 선택해주세요.");
            return;
        }
        if (!window.confirm(`선택된 ${selectedMembers.length}명의 팀원을 삭제하시겠습니까?`)) return;

        const result = await deleteTeamMembers(selectedMembers);
        if (result.success) {
            setModalMembers(prev => prev.filter(m => !selectedMembers.includes(m.userId)));
            setSelectedMembers([]);
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 팀원 추가 */
    const handleAddMember = () => {
        // TODO: API 호출
        alert("팀원이 추가되었습니다.");
    };

    /* 모달 - 대표 작성자 지정 */
    const handleSetWriter = async () => {
        if (selectedMembers.length !== 1) {
            alert("대표 작성자로 지정할 1명을 선택해주세요.");
            return;
        }
        const result = await setTeamWriter(modalTeam.teamId, selectedMembers[0]);
        if (result.success) {
            setModalMembers(prev => prev.map(m => ({ ...m, writer: m.userId === selectedMembers[0] ? "Y" : "N" })));
            setSelectedMembers([]);
            alert("대표 작성자가 지정되었습니다.");
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 입력완료 (저장) */
    const handleTeamModalSave = async () => {
        const result = await updateTeamInfo(modalTeam.teamId, {
            teamName: modalTeamName,
            sequence: modalTeam.sequence,
            isDoing: modalTeam.isDoing,
            aiPlay: 0,
        });

        if (result.success) {
            alert("저장되었습니다.");
            setShowTeamModal(false);
            await refreshTeams();
        } else {
            alert(result.message);
        }
    };

    /* 미션 아이템 클릭 (팀별 열람) */
    const handleMissionClick = async (missionCode, teamId, teamName) => {
        if (missionCode === "A-1") {
            const result = await getImpactCheckByTeam(teamId);
            if (result.success) {
                setMissionModalTitle(`${teamName} - 성과관리 현황진단`);
                setMissionModalData(result.data);
                setMissionModalTeamId(teamId);
                setShowMissionModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "B-1") {
            const result = await getIdentityCanvasByTeam(teamId);
            if (result.success) {
                setIdentityModalTitle(`${teamName} - 정체성 설계`);
                setIdentityModalData(result.data);
                setShowIdentityModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "C-1") {
            const result = await getFlowCanvasByTeam(teamId);
            if (result.success) {
                setFlowModalTitle(`${teamName} - 성과경로 설계`);
                setFlowModalData(result.data);
                setShowFlowModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "D-1") {
            const result = await getQuickWinByTeam(teamId);
            if (result.success) {
                setQuickWinModalTitle(`${teamName} - 전술적 실행과제`);
                setQuickWinModalData(result.data);
                setShowQuickWinModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "E-1") {
            const result = await getBuildWinByTeam(teamId);
            if (result.success) {
                setBuildWinModalTitle(`${teamName} - 전략적 실행과제`);
                setBuildWinModalData(result.data);
                setShowBuildWinModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "F-1") {
            const result = await getFundingByTeam("quick", teamId);
            if (result.success) {
                setFundingModalTitle(`${teamName} - Quick Win 평가`);
                setFundingModalData(result.data);
                setFundingModalType("quick");
                setShowFundingModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "F-2") {
            const result = await getFundingByTeam("build", teamId);
            if (result.success) {
                setFundingModalTitle(`${teamName} - Build Win 평가`);
                setFundingModalData(result.data);
                setFundingModalType("build");
                setShowFundingModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "F-3") {
            const result = await getFundingResultByTeam(teamId);
            if (result.success) {
                setResultModalTitle(`${teamName} - 최종 결과 확인`);
                setResultModalData(result.data);
                setShowResultModal(true);
            } else {
                alert(result.message);
            }
        } else {
            alert("준비 중인 기능입니다.");
        }
    };

    /* 팀 목록 갱신 헬퍼 */
    const refreshTeams = async () => {
        const [refreshed, submissionResult] = await Promise.all([
            getTeachDetail(gameId),
            getSubmissionList(gameId),
        ]);
        if (refreshed.success) {
            const submissionMap = {};
            if (submissionResult.success) {
                (submissionResult.data || []).forEach(s => {
                    submissionMap[s.teamId] = s;
                });
            }
            setTeams((refreshed.data.teams || []).map(t => {
                const sub = submissionMap[t.teamId] || {};
                return {
                    teamId: t.teamId,
                    teamName: t.teamName,
                    numUser: t.numUser,
                    submitA: sub.submitA || t.submitA,
                    submitB: sub.submitB || t.submitB,
                    submitC: sub.submitC || t.submitC,
                    submitD: sub.submitD || t.submitD,
                    submitE: sub.submitE || t.submitE,
                    submitF: sub.submitF || t.submitF,
                };
            }));
            setGameInfo(prev => ({ ...prev, numTeam: refreshed.data.numTeam }));
        }
    };

    /* 평가팀 추가 */
    const handleEvalTeamAdd = async () => {
        if (!window.confirm("평가팀을 추가하시겠습니까?")) return;

        const result = await addEvaluationTeam(gameId);
        if (result.success) {
            alert("평가팀이 추가되었습니다.");
            await refreshTeams();
        } else {
            alert(result.message);
        }
    };

    /* 팀 삭제 */
    const handleDeleteTeam = async (team) => {
        if (!window.confirm(`'${team.teamName}' 팀을 삭제하시겠습니까?\n\n※ 삭제된 팀은 '삭제된 팀 보기'에서 복구할 수 있습니다.`)) return;

        const result = await deleteTeam(team.teamId, gameId);
        if (result.success) {
            alert("팀이 삭제되었습니다.");
            await refreshTeams();
        } else {
            alert(result.message);
        }
    };

    /* 삭제된 팀 보기 */
    const handleShowDeleted = async () => {
        const result = await getDeletedTeams(gameId);
        if (result.success) {
            if (result.data.length === 0) {
                alert("삭제된 팀이 없습니다.");
                return;
            }
            setDeletedTeams(result.data);
            setSelectedDeleted([]);
            setShowDeletedModal(true);
        } else {
            alert(result.message);
        }
    };

    /* 삭제된 팀 복구 */
    const handleRestore = async () => {
        if (selectedDeleted.length === 0) {
            alert("복구할 팀을 선택해주세요.");
            return;
        }
        const names = deletedTeams.filter(t => selectedDeleted.includes(t.teamId)).map(t => t.teamName);
        if (!window.confirm(`${names.join(", ")} 팀을 복구하시겠습니까?`)) return;

        let successCount = 0;
        for (const teamId of selectedDeleted) {
            const result = await restoreTeam(teamId, gameId);
            if (result.success) successCount++;
        }

        if (successCount > 0) {
            alert(`${successCount}개 팀이 복구되었습니다.`);
            setShowDeletedModal(false);
            await refreshTeams();
        } else {
            alert("팀 복원에 실패했습니다.");
        }
    };

    /* 다음 단계 시작 */
    const handleNextStep = () => {
        if (window.confirm("다음 단계를 시작하시겠습니까?")) {
            // TODO: API 호출
            alert("다음 단계가 시작되었습니다.");
        }
    };

    const renderSubmitStatus = (status) => {
        const isSubmit = status === "Y" || status === "제출";
        return (
            <span className={isSubmit ? "td2-status-submit" : "td2-status-not"}>
                {isSubmit ? "제출" : "미제출"}
            </span>
        );
    };

    const rangeArray = (start, end) => {
        const arr = [];
        for (let i = start; i <= end; i++) arr.push(i);
        return arr;
    };

    if (loading) {
        return <div className="td2-container" style={{ padding: 40, textAlign: "center", color: "#999" }}>로딩 중...</div>;
    }

    if (!gameInfo) {
        return <div className="td2-container" style={{ padding: 40, textAlign: "center", color: "#999" }}>강의실 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="td2-container">
            {/* 상단바: 강의실 정보 + 종료 버튼 */}
            <div className="td2-topbar">
                <span className="td2-topbar-label">강의실 정보</span>
                <span className="td2-topbar-name">{gameInfo.name}</span>
                <button className="td2-btn-end" onClick={handleEndGame}>강의실 종료</button>
            </div>

            {/* 2컬럼: 기본정보 + 진행현황 */}
            <div className="td2-row">
                {/* 좌: 강의실 기본정보 + 제출기한 설정 */}
                <div className="td2-col-left">
                    {/* 강의실 기본정보 */}
                    <div className="td2-panel">
                        <div className="td2-panel-heading">
                            <span className="td2-panel-title">강의실 기본정보</span>
                        </div>
                        <div className="td2-panel-body">
                            <table className="td2-info-table">
                                <tbody>
                                    <tr><th>강의실</th><td>{gameInfo.name}</td></tr>
                                    <tr><th>팀 수</th><td>{gameInfo.numTeam}</td></tr>
                                    <tr><th>교육시간</th><td>{gameInfo.startdate} ~ {gameInfo.enddate}</td></tr>
                                    <tr><th>강의실 코드</th><td>{gameInfo.code}</td></tr>
                                    <tr>
                                        <th>강의실 로고</th>
                                        <td>
                                            {gameInfo.logoUrl && <img src={gameInfo.logoUrl} alt="logo" className="td2-logo-img" />}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="td2-panel-footer">
                            <button className="td2-btn-primary" onClick={handleOpenModify}>강의실 수정</button>
                        </div>
                    </div>

                    {/* 제출 기한 설정 */}
                    <div className="td2-panel">
                        <div className="td2-panel-heading">
                            <span className="td2-panel-title">제출 기한 설정</span>
                        </div>
                        <div className="td2-deadline-body">
                            <div className="td2-deadline-row">
                                <span className="td2-deadline-label">제출시간</span>
                                <select className="td2-deadline-select" value={deadlineYear} onChange={e => setDeadlineYear(Number(e.target.value))}>
                                    {rangeArray(now.getFullYear(), now.getFullYear() + 5).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <span className="td2-deadline-unit">년</span>
                                <select className="td2-deadline-select" value={deadlineMonth} onChange={e => setDeadlineMonth(Number(e.target.value))}>
                                    {rangeArray(1, 12).map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <span className="td2-deadline-unit">월</span>
                                <select className="td2-deadline-select" value={deadlineDay} onChange={e => setDeadlineDay(Number(e.target.value))}>
                                    {rangeArray(1, 31).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <span className="td2-deadline-unit">일</span>
                                <select className="td2-deadline-select" value={deadlineHour} onChange={e => setDeadlineHour(Number(e.target.value))}>
                                    {rangeArray(0, 23).map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                                <span className="td2-deadline-unit">시</span>
                                <select className="td2-deadline-select" value={deadlineMinute} onChange={e => setDeadlineMinute(Number(e.target.value))}>
                                    {rangeArray(0, 5).map(m => (
                                        <option key={m} value={m * 10}>{m * 10}</option>
                                    ))}
                                </select>
                                <span className="td2-deadline-unit">분</span>
                            </div>
                        </div>
                        <div className="td2-panel-footer">
                            <button className="td2-btn-primary" onClick={handleNextStep}>다음 단계 시작</button>
                        </div>
                    </div>
                </div>

                {/* 우: 진행 현황 */}
                <div className="td2-col-right">
                    <div className="td2-panel">
                        <div className="td2-panel-heading">
                            <span className="td2-panel-title">진행 현황</span>
                            <button className="td2-btn-pdf-all">전체 PDF 다운</button>
                        </div>
                        <div className="td2-panel-body">
                            <div className="td2-scroll-area">
                                <table className="td2-progress-table">
                                    <thead>
                                        <tr>
                                            <th>팀명</th>
                                            <th>참여자수</th>
                                            <th>진행 현황</th>
                                            <th>미션 제출본 다운</th>
                                            <th>미션 팀 제출 파일</th>
                                            <th>삭제</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teams.length === 0 ? (
                                            <tr><td colSpan="6" style={{ textAlign: "center", padding: 20, color: "#999" }}>등록된 팀이 없습니다.</td></tr>
                                        ) : teams.map(t => (
                                            <tr key={t.teamId}>
                                                <td>
                                                    <button className="td2-team-link" onClick={() => handleOpenTeamModal(t.teamId)}>
                                                        {t.teamName}
                                                    </button>
                                                </td>
                                                <td>{t.numUser}명</td>
                                                <td>
                                                    [A]{renderSubmitStatus(t.submitA)} / [B]{renderSubmitStatus(t.submitB)} / [C]{renderSubmitStatus(t.submitC)}
                                                    <br />
                                                    [D]{renderSubmitStatus(t.submitD)} / [E]{renderSubmitStatus(t.submitE)} / [F]{renderSubmitStatus(t.submitF)}
                                                </td>
                                                <td>
                                                    <button className="td2-btn-pptx" style={{ marginRight: 5 }}>PPTX</button>
                                                    <button className="td2-btn-pdf">PDF</button>
                                                </td>
                                                <td>
                                                    <button className="td2-btn-file-down">파일 다운</button>
                                                </td>
                                                <td>
                                                    <button className="td2-btn-delete" onClick={() => handleDeleteTeam(t)} title="팀 삭제">
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="td2-panel-footer">
                            <div className="td2-team-btns">
                                <button className="td2-btn-default" onClick={handleTeamAdd}>팀 추가</button>
                                <button className="td2-btn-default" onClick={() => onNavigate("student_list", { gameId })}>교육생 목록</button>
                                <button className="td2-btn-default" onClick={handleEvalTeamAdd}>평가팀 추가</button>
                                <button className="td2-btn-warning" onClick={handleShowDeleted}>삭제된 팀 보기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 다음 단계 설정 */}
            <div className="td2-panel">
                <div className="td2-panel-heading">
                    <span className="td2-panel-title">다음 단계 설정</span>
                </div>
                <div className="td2-step-body">
                    {stepConfig.map(group => (
                        <div className="td2-step-group" key={group.key}>
                            <div className={`td2-step-group-title ${group.colorClass}`}>{group.label}</div>
                            <div className="td2-step-checks">
                                {group.items.map(item => (
                                    <label className="td2-step-check-label" key={item.value}>
                                        <input
                                            type="checkbox"
                                            checked={checkedSteps.includes(item.value)}
                                            onChange={() => handleStepCheck(item.value)}
                                        />
                                        {item.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div style={{ textAlign: "center", marginTop: 10 }}>
                        <button className="td2-btn-primary" onClick={handleStepSave}>저장</button>
                    </div>
                </div>
            </div>

            {/* 미션확인 */}
            <div className="td2-mission-section">
                <div className="td2-mission-header">
                    <div>
                        <h3 className="td2-mission-title">미션확인</h3>
                        <p className="td2-mission-desc">팀을 선택한 후 미션 버튼을 클릭하여 상세내용을 확인하세요.</p>
                    </div>
                    <div className="td2-mission-team-select">
                        <span className="td2-mission-team-label">팀 선택</span>
                        <select
                            className="td2-deadline-select"
                            value={missionModalTeamId || ""}
                            onChange={e => setMissionModalTeamId(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">선택</option>
                            {teams.map(t => (
                                <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {missionRows.map(row => (
                    <div className="td2-mission-row" key={row.code}>
                        <div className={`td2-mission-head ${row.bgHead}`}>
                            <span className="td2-mission-head-code">{row.code}</span>
                            <span className="td2-mission-head-name">{row.name}</span>
                        </div>
                        <div className="td2-mission-items">
                            {row.items.map(item => (
                                <div
                                    className={`td2-mission-item td2-mission-clickable ${row.bgItem}`}
                                    key={item.code}
                                    onClick={() => {
                                        if (!missionModalTeamId) {
                                            alert("팀을 먼저 선택해주세요.");
                                            return;
                                        }
                                        const team = teams.find(t => t.teamId === missionModalTeamId);
                                        handleMissionClick(item.code, missionModalTeamId, team?.teamName || "");
                                    }}
                                >
                                    <span className="td2-mission-item-code">{item.code}</span>
                                    <span className="td2-mission-item-name">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 미션 열람 모달 (ImpactCheck) */}
            {showMissionModal && missionModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowMissionModal(false)}>
                    <div className="td2-impact-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{missionModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowMissionModal(false)}>&times;</button>
                        </div>
                        <div className="td2-impact-modal-body">
                            <table className="td2-impact-table">
                                <thead>
                                    <tr>
                                        <th className="td2-impact-no">No.</th>
                                        <th className="td2-impact-q">Questionnaires</th>
                                        <th className="td2-impact-rating">매우 부정</th>
                                        <th className="td2-impact-rating"></th>
                                        <th className="td2-impact-rating"></th>
                                        <th className="td2-impact-rating"></th>
                                        <th className="td2-impact-rating">매우 긍정</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {impactQuestions.map(q =>
                                        q.type === "text" ? (
                                            <tr key={q.no} className="td2-impact-text-row">
                                                <td className="td2-impact-no-cell">{q.no}</td>
                                                <td className="td2-impact-q-cell">{q.text}</td>
                                                <td colSpan={5} className="td2-impact-text-cell">
                                                    {missionModalData[`q${q.no}Text`] || ""}
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={q.no}>
                                                <td className="td2-impact-no-cell">{q.no}</td>
                                                <td className="td2-impact-q-cell">{q.text}</td>
                                                {[1, 2, 3, 4, 5].map(r => (
                                                    <td key={r} className="td2-impact-rating-cell">
                                                        <span className={`td2-impact-rating-dot ${missionModalData[`q${q.no}Score`] === r ? "td2-impact-selected" : ""}`}>
                                                            {r}
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* 정체성 설계 열람 모달 */}
            {showIdentityModal && identityModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowIdentityModal(false)}>
                    <div className="td2-identity-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{identityModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowIdentityModal(false)}>&times;</button>
                        </div>
                        <div className="td2-identity-modal-body">
                            {/* 3단 레이아웃 */}
                            <div className="td2-id-grid">
                                {/* 좌: 기존 가치체계 */}
                                <div className="td2-id-col">
                                    <div className="td2-id-section-header td2-id-legacy">기존 가치체계 (Current Legacy)</div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">미션 (Mission)</div>
                                        <div className="td2-id-card-body">{identityModalData.mission || ""}</div>
                                    </div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">비전 (Vision)</div>
                                        <div className="td2-id-card-body">{identityModalData.vision || ""}</div>
                                    </div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">핵심가치 (Value)</div>
                                        <div className="td2-id-card-body">{identityModalData.value || ""}</div>
                                    </div>
                                </div>

                                {/* 중: 외부의 위협 신호 + 내부의 한계점 */}
                                <div className="td2-id-col-center">
                                    <div className="td2-id-section-header td2-id-threat">외부의 위협 신호 (External Threats)</div>
                                    <div className="td2-id-threat-grid">
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">정책/경제</div>
                                            <div className="td2-id-mini-body">{identityModalData.macro || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">기술</div>
                                            <div className="td2-id-mini-body">{identityModalData.tech || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">고객/사회</div>
                                            <div className="td2-id-mini-body">{identityModalData.customer || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">경쟁</div>
                                            <div className="td2-id-mini-body">{identityModalData.competitor || ""}</div>
                                        </div>
                                    </div>

                                    <div className="td2-id-section-header td2-id-threat" style={{ marginTop: 12 }}>내부의 한계점 (Internal Limits)</div>
                                    <div className="td2-id-threat-grid">
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">역량</div>
                                            <div className="td2-id-mini-body">{identityModalData.capability || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">문화</div>
                                            <div className="td2-id-mini-body">{identityModalData.culture || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">구조</div>
                                            <div className="td2-id-mini-body">{identityModalData.structure || ""}</div>
                                        </div>
                                        <div className="td2-id-mini-card">
                                            <div className="td2-id-mini-title">기타</div>
                                            <div className="td2-id-mini-body">{identityModalData.etc || ""}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 우: 미래 방향성 */}
                                <div className="td2-id-col">
                                    <div className="td2-id-section-header td2-id-new">미래 방향성 (New Identity)</div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">New 미션 (Mission)</div>
                                        <div className="td2-id-card-body">{identityModalData.newMission || ""}</div>
                                    </div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">New 비전 (Vision)</div>
                                        <div className="td2-id-card-body">{identityModalData.newVision || ""}</div>
                                    </div>
                                    <div className="td2-id-card">
                                        <div className="td2-id-card-title">New 핵심가치 (Value)</div>
                                        <div className="td2-id-card-body">{identityModalData.newValue || ""}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 성과경로 설계 열람 모달 */}
            {showFlowModal && flowModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowFlowModal(false)}>
                    <div className="td2-flow-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{flowModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowFlowModal(false)}>&times;</button>
                        </div>
                        <div className="td2-flow-modal-body">
                            {/* New Vision 배너 */}
                            <div className="td2-flow-vision">
                                <span className="td2-flow-vision-label">New Vision</span>
                                <span className="td2-flow-vision-text">{flowModalData.newVision || ""}</span>
                            </div>

                            {/* 전략목표 카드 */}
                            <div className="td2-flow-section-title">1. 3대 전략목표 (Strategic Goal)</div>
                            <div className="td2-flow-goal-cards">
                                {(flowModalData.goals || []).map((goal, idx) => (
                                    <div className="td2-flow-goal-card" key={goal.goalId || idx}>
                                        <div className="td2-flow-goal-title">{goal.goalTitle || `전략목표 ${idx + 1}`}</div>
                                        <div className="td2-flow-goal-desc">{goal.goalDescription || ""}</div>
                                    </div>
                                ))}
                            </div>

                            {/* 전술적 성과 */}
                            <div className="td2-flow-section-title">2. 전술적 성과 (성과)</div>
                            <div className="td2-flow-tables">
                                {(flowModalData.goals || []).map((goal, idx) => (
                                    <table className="td2-flow-table" key={`t-${goal.goalId || idx}`}>
                                        <thead>
                                            <tr>
                                                <th>전술적 성과 지표</th>
                                                <th>목표</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(goal.tacticals || []).length === 0 ? (
                                                <tr><td colSpan="2" className="td2-flow-empty">-</td></tr>
                                            ) : (goal.tacticals || []).map((t, ti) => (
                                                <tr key={t.metricId || ti}>
                                                    <td>{t.tacticalMetric || ""}</td>
                                                    <td>{t.tacticalGoal || ""}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ))}
                            </div>

                            {/* 전략적 활동 */}
                            <div className="td2-flow-section-title">3. 전략적 활동 (체질)</div>
                            <div className="td2-flow-tables">
                                {(flowModalData.goals || []).map((goal, idx) => (
                                    <table className="td2-flow-table" key={`s-${goal.goalId || idx}`}>
                                        <thead>
                                            <tr>
                                                <th>전략적 활동 지표</th>
                                                <th>내재화 기준</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(goal.strategicActivities || []).length === 0 ? (
                                                <tr><td colSpan="2" className="td2-flow-empty">-</td></tr>
                                            ) : (goal.strategicActivities || []).map((a, ai) => (
                                                <tr key={a.activityId || ai}>
                                                    <td>{a.activityMetric || ""}</td>
                                                    <td>{a.interCriteria || ""}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 전술적 실행과제 열람 모달 */}
            {showQuickWinModal && quickWinModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowQuickWinModal(false)}>
                    <div className="td2-qw-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{quickWinModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowQuickWinModal(false)}>&times;</button>
                        </div>
                        <div className="td2-qw-modal-body">
                            {/* 전략목표 Alignment */}
                            <div className="td2-qw-align-row">
                                <span className="td2-qw-align-label">전략목표 Alignment</span>
                                <span className="td2-qw-align-value">{quickWinModalData.strategicGoal || ""}</span>
                            </div>

                            {/* 과제명 + 주요내용 */}
                            <div className="td2-qw-task-row">
                                <div className="td2-qw-task-side-label">전술적<br/>실행과제</div>
                                <div className="td2-qw-task-fields">
                                    <div className="td2-qw-task-field">
                                        <span className="td2-qw-task-label">과제명</span>
                                        <span className="td2-qw-task-value highlight">{quickWinModalData.taskName || ""}</span>
                                    </div>
                                    <div className="td2-qw-task-field">
                                        <span className="td2-qw-task-label">주요 내용</span>
                                        <span className="td2-qw-task-value">{quickWinModalData.taskDescription || ""}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 메인 테이블 */}
                            <table className="td2-qw-table">
                                <thead>
                                    <tr>
                                        <th className="td2-qw-th-situation" rowSpan="2">상황(Situation)</th>
                                        <th className="td2-qw-th-input" colSpan="2">투입(Input)</th>
                                        <th className="td2-qw-th-activity" colSpan="4">활동(Activity)</th>
                                        <th className="td2-qw-th-output">산출(Outputs)</th>
                                    </tr>
                                    <tr>
                                        <th className="td2-qw-th-sub">필요 자원</th>
                                        <th className="td2-qw-th-sub">수량</th>
                                        <th className="td2-qw-th-sub">추진 절차</th>
                                        <th className="td2-qw-th-sub">주요 내용</th>
                                        <th className="td2-qw-th-sub">소요기간</th>
                                        <th className="td2-qw-th-sub">팀워크</th>
                                        <th className="td2-qw-th-sub">산출물</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        const inputs = quickWinModalData.taskInputs || [];
                                        const activities = quickWinModalData.taskActivities || [];
                                        const maxRows = Math.max(inputs.length, activities.length, 1);
                                        const rows = [];
                                        for (let i = 0; i < maxRows; i++) {
                                            rows.push(
                                                <tr key={i}>
                                                    {i === 0 && (
                                                        <td rowSpan={maxRows} className="td2-qw-situation-cell">
                                                            <div className="td2-qw-situation-top">
                                                                <strong>위기의 신호</strong>
                                                                <div>{quickWinModalData.crisisSignal || ""}</div>
                                                            </div>
                                                            <div className="td2-qw-situation-divider">Pain/Touch point</div>
                                                            <div className="td2-qw-situation-bottom">
                                                                {quickWinModalData.painTouchPoint || ""}
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td>{inputs[i]?.resourceName || ""}</td>
                                                    <td className="td2-qw-center">{inputs[i]?.quantity != null ? inputs[i].quantity : ""}</td>
                                                    <td>{activities[i]?.processStep || ""}</td>
                                                    <td>{activities[i]?.activityContent || ""}</td>
                                                    <td>{activities[i]?.duration || ""}</td>
                                                    {i === 0 && (
                                                        <>
                                                            <td rowSpan={maxRows} className="td2-qw-teamwork-cell">
                                                                {quickWinModalData.teamwork?.activityTeamwork || ""}
                                                            </td>
                                                            <td rowSpan={maxRows} className="td2-qw-teamwork-cell">
                                                                {quickWinModalData.teamwork?.workType || ""}
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            );
                                        }
                                        return rows;
                                    })()}
                                </tbody>
                            </table>

                            {/* 성과(Outcomes) */}
                            <div className="td2-qw-outcomes">
                                <div className="td2-qw-outcomes-header">성과(Outcomes)</div>
                                <div className="td2-qw-outcomes-grid">
                                    <div className="td2-qw-outcomes-col">
                                        <div className="td2-qw-outcomes-col-title">정성적 효과 (체감되는 변화)</div>
                                        {(quickWinModalData.taskOutcomes || [])
                                            .filter(o => o.outcomeType === "QUALITATIVE")
                                            .sort((a, b) => a.orderNo - b.orderNo)
                                            .map((o, i) => (
                                                <div className="td2-qw-outcomes-item" key={o.outcomeNo || i}>
                                                    {i + 1}. {o.outcomeContent || ""}
                                                </div>
                                            ))}
                                        {(quickWinModalData.taskOutcomes || []).filter(o => o.outcomeType === "QUALITATIVE").length === 0 && (
                                            <div className="td2-qw-outcomes-item">-</div>
                                        )}
                                    </div>
                                    <div className="td2-qw-outcomes-col">
                                        <div className="td2-qw-outcomes-col-title">정량적 효과 (측정가능한 변화)</div>
                                        {(quickWinModalData.taskOutcomes || [])
                                            .filter(o => o.outcomeType === "QUANTITATIVE")
                                            .sort((a, b) => a.orderNo - b.orderNo)
                                            .map((o, i) => (
                                                <div className="td2-qw-outcomes-item" key={o.outcomeNo || i}>
                                                    {i + 1}. {o.outcomeContent || ""}
                                                </div>
                                            ))}
                                        {(quickWinModalData.taskOutcomes || []).filter(o => o.outcomeType === "QUANTITATIVE").length === 0 && (
                                            <div className="td2-qw-outcomes-item">-</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 전략적 실행과제 열람 모달 */}
            {showBuildWinModal && buildWinModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowBuildWinModal(false)}>
                    <div className="td2-qw-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{buildWinModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowBuildWinModal(false)}>&times;</button>
                        </div>
                        <div className="td2-qw-modal-body">
                            {/* 전략목표 Alignment */}
                            <div className="td2-qw-align-row">
                                <span className="td2-qw-align-label">전략목표 Alignment</span>
                                <span className="td2-qw-align-value">{buildWinModalData.strategicGoal || ""}</span>
                            </div>

                            {/* 과제명 + 주요내용 */}
                            <div className="td2-qw-task-row">
                                <div className="td2-qw-task-side-label">전략적<br/>실행과제</div>
                                <div className="td2-qw-task-fields">
                                    <div className="td2-qw-task-field">
                                        <span className="td2-qw-task-label">과제명</span>
                                        <span className="td2-qw-task-value highlight">{buildWinModalData.taskName || ""}</span>
                                    </div>
                                    <div className="td2-qw-task-field">
                                        <span className="td2-qw-task-label">주요 내용</span>
                                        <span className="td2-qw-task-value">{buildWinModalData.taskDescription || ""}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 메인 테이블 */}
                            <table className="td2-qw-table">
                                <thead>
                                    <tr>
                                        <th className="td2-qw-th-situation" rowSpan="2">상황(Situation)</th>
                                        <th className="td2-qw-th-input" colSpan="2">투입(Input)</th>
                                        <th className="td2-qw-th-activity" colSpan="4">활동(Activity)</th>
                                        <th className="td2-qw-th-output">산출(Outputs)</th>
                                    </tr>
                                    <tr>
                                        <th className="td2-qw-th-sub">필요 자원</th>
                                        <th className="td2-qw-th-sub">수량</th>
                                        <th className="td2-qw-th-sub">추진 절차</th>
                                        <th className="td2-qw-th-sub">주요 내용</th>
                                        <th className="td2-qw-th-sub">소요기간</th>
                                        <th className="td2-qw-th-sub">팀워크</th>
                                        <th className="td2-qw-th-sub">산출물</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        const inputs = buildWinModalData.taskInputs || [];
                                        const activities = buildWinModalData.taskActivities || [];
                                        const maxRows = Math.max(inputs.length, activities.length, 1);
                                        const rows = [];
                                        for (let i = 0; i < maxRows; i++) {
                                            rows.push(
                                                <tr key={i}>
                                                    {i === 0 && (
                                                        <td rowSpan={maxRows} className="td2-qw-situation-cell">
                                                            <div className="td2-qw-situation-top">
                                                                <strong>위기의 신호</strong>
                                                                <div>{buildWinModalData.crisisSignal || ""}</div>
                                                            </div>
                                                            <div className="td2-qw-situation-divider">Pain/Touch point</div>
                                                            <div className="td2-qw-situation-bottom">
                                                                {buildWinModalData.painTouchPoint || ""}
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td>{inputs[i]?.resourceName || ""}</td>
                                                    <td className="td2-qw-center">{inputs[i]?.quantity != null ? inputs[i].quantity : ""}</td>
                                                    <td>{activities[i]?.processStep || ""}</td>
                                                    <td>{activities[i]?.activityContent || ""}</td>
                                                    <td>{activities[i]?.duration || ""}</td>
                                                    {i === 0 && (
                                                        <>
                                                            <td rowSpan={maxRows} className="td2-qw-teamwork-cell">
                                                                {buildWinModalData.teamwork?.activityTeamwork || ""}
                                                            </td>
                                                            <td rowSpan={maxRows} className="td2-qw-teamwork-cell">
                                                                {buildWinModalData.teamwork?.workType || ""}
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            );
                                        }
                                        return rows;
                                    })()}
                                </tbody>
                            </table>

                            {/* 성과(Outcomes) */}
                            <div className="td2-qw-outcomes">
                                <div className="td2-qw-outcomes-header">성과(Outcomes)</div>
                                <div className="td2-qw-outcomes-grid">
                                    <div className="td2-qw-outcomes-col">
                                        <div className="td2-qw-outcomes-col-title">정성적 효과 (체감되는 변화)</div>
                                        {(buildWinModalData.taskOutcomes || [])
                                            .filter(o => o.outcomeType === "QUALITATIVE")
                                            .sort((a, b) => a.orderNo - b.orderNo)
                                            .map((o, i) => (
                                                <div className="td2-qw-outcomes-item" key={o.outcomeNo || i}>
                                                    {i + 1}. {o.outcomeContent || ""}
                                                </div>
                                            ))}
                                        {(buildWinModalData.taskOutcomes || []).filter(o => o.outcomeType === "QUALITATIVE").length === 0 && (
                                            <div className="td2-qw-outcomes-item">-</div>
                                        )}
                                    </div>
                                    <div className="td2-qw-outcomes-col">
                                        <div className="td2-qw-outcomes-col-title">정량적 효과 (측정가능한 변화)</div>
                                        {(buildWinModalData.taskOutcomes || [])
                                            .filter(o => o.outcomeType === "QUANTITATIVE")
                                            .sort((a, b) => a.orderNo - b.orderNo)
                                            .map((o, i) => (
                                                <div className="td2-qw-outcomes-item" key={o.outcomeNo || i}>
                                                    {i + 1}. {o.outcomeContent || ""}
                                                </div>
                                            ))}
                                        {(buildWinModalData.taskOutcomes || []).filter(o => o.outcomeType === "QUANTITATIVE").length === 0 && (
                                            <div className="td2-qw-outcomes-item">-</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 실행과제 검증 열람 모달 (F-1, F-2) */}
            {showFundingModal && fundingModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowFundingModal(false)}>
                    <div className="td2-funding-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{fundingModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowFundingModal(false)}>&times;</button>
                        </div>
                        <div className="td2-funding-modal-body">
                            {fundingModalData.length === 0 ? (
                                <div style={{ textAlign: "center", padding: 40, color: "#999" }}>등록된 평가 데이터가 없습니다.</div>
                            ) : (
                                <FundingModalBody data={fundingModalData} type={fundingModalType} teamId={missionModalTeamId} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 최종 결과 열람 모달 (F-3) */}
            {showResultModal && resultModalData && (
                <div className="td2-modal-overlay" onClick={() => setShowResultModal(false)}>
                    <div className="td2-result-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-impact-modal-header">
                            <span className="td2-impact-modal-title">{resultModalTitle}</span>
                            <button className="td2-modify-close" onClick={() => setShowResultModal(false)}>&times;</button>
                        </div>
                        <FundingResultModalBody data={resultModalData} />
                    </div>
                </div>
            )}

            {/* 삭제된 팀 모달 */}
            {showDeletedModal && (
                <div className="td2-modal-overlay" onClick={() => setShowDeletedModal(false)}>
                    <div className="td2-modal-box" onClick={e => e.stopPropagation()}>
                        <h4>삭제된 팀 목록</h4>
                        <div className="td2-modal-list">
                            {deletedTeams.map(t => (
                                <label className="td2-modal-item" key={t.teamId}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDeleted.includes(t.teamId)}
                                        onChange={() => setSelectedDeleted(prev =>
                                            prev.includes(t.teamId) ? prev.filter(id => id !== t.teamId) : [...prev, t.teamId]
                                        )}
                                    />
                                    <span>{t.teamName}</span>
                                </label>
                            ))}
                        </div>
                        <div className="td2-modal-footer">
                            <button className="td2-btn-cancel" onClick={() => setShowDeletedModal(false)}>취소</button>
                            <button className="td2-btn-restore" onClick={handleRestore}>선택 팀 복구</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 팀/참여자 정보입력 모달 */}
            {showTeamModal && modalTeam && (
                <div className="td2-modal-overlay" onClick={() => setShowTeamModal(false)}>
                    <div className="td2-team-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-team-modal-header">
                            <span className="td2-team-modal-title">팀/참여자 정보입력</span>
                            <button className="td2-modify-close" onClick={() => setShowTeamModal(false)}>&times;</button>
                        </div>
                        <div className="td2-team-modal-body">
                            <h4 className="td2-team-modal-subtitle">참여자 정보입력</h4>

                            {/* 팀 기본정보 */}
                            <table className="td2-team-modal-info">
                                <tbody>
                                    <tr>
                                        <th>팀 번호</th>
                                        <td>{modalTeam.sequence}</td>
                                    </tr>
                                    <tr>
                                        <th>팀 이름</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="td2-team-modal-input"
                                                value={modalTeamName}
                                                onChange={e => setModalTeamName(e.target.value)}
                                                placeholder="팀 이름"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* 참여자 테이블 */}
                            <table className="td2-member-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: 40 }}></th>
                                        <th>번호</th>
                                        <th>User ID</th>
                                        <th>비밀번호</th>
                                        <th>성명</th>
                                        <th>메일주소</th>
                                        <th>대표작성자</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalMembers.length === 0 ? (
                                        <tr><td colSpan="7" style={{ textAlign: "center", padding: 20, color: "#999" }}>등록된 팀원이 없습니다.</td></tr>
                                    ) : (
                                        modalMembers.map((m, idx) => (
                                            <tr key={m.userId}>
                                                <td style={{ textAlign: "center" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(m.userId)}
                                                        onChange={() => handleMemberCheck(m.userId)}
                                                    />
                                                </td>
                                                <td>{idx + 1}</td>
                                                <td>{m.loginId}</td>
                                                <td className="td2-member-editable">{m.loginId}</td>
                                                <td className="td2-member-editable">{m.name || m.loginId}</td>
                                                <td className="td2-member-editable">{m.mail || "@"}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={m.writer === "Y"}
                                                        onChange={() => {
                                                            setModalMembers(prev => prev.map(mb =>
                                                                mb.userId === m.userId
                                                                    ? { ...mb, writer: mb.writer === "Y" ? "N" : "Y" }
                                                                    : mb
                                                            ));
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* 하단 버튼 + 안내문구 */}
                            <div className="td2-team-modal-actions">
                                <div className="td2-team-modal-btns">
                                    <button className="td2-modal-btn-gray" onClick={handleDeleteMembers}>선택된 팀원삭제</button>
                                    <button className="td2-modal-btn-blue" onClick={handleAddMember}>팀원추가</button>
                                    <button className="td2-modal-btn-blue" onClick={handleSetWriter}>대표 작성자 지정</button>
                                    <button className="td2-modal-btn-blue" onClick={handleTeamModalSave}>입력완료</button>
                                </div>
                                <p className="td2-team-modal-note">CEO와 각 계정당 직책은 오직 1명만 가능합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 강의실 수정 모달 */}
            {showModifyModal && (
                <div className="td2-modal-overlay" onClick={() => setShowModifyModal(false)}>
                    <div className="td2-modify-modal" onClick={e => e.stopPropagation()}>
                        <div className="td2-modify-header">
                            <span className="td2-modify-title">
                                <i className="fa fa-hand-o-down" style={{ marginRight: 6 }}></i>
                                강의실 기본정보 입력
                            </span>
                            <button className="td2-modify-close" onClick={() => setShowModifyModal(false)}>&times;</button>
                        </div>
                        <div className="td2-modify-body">
                            <div className="td2-modify-row">
                                <label className="td2-modify-label">강의실 명</label>
                                <div className="td2-modify-field">
                                    <input
                                        type="text"
                                        className="td2-modify-input"
                                        value={modifyName}
                                        onChange={e => setModifyName(e.target.value)}
                                        placeholder="강의실 명"
                                    />
                                </div>
                            </div>
                            <div className="td2-modify-row">
                                <label className="td2-modify-label">팀 수</label>
                                <div className="td2-modify-field">
                                    <span className="td2-modify-static">{gameInfo.numTeam} 팀</span>
                                </div>
                            </div>
                            <div className="td2-modify-row">
                                <label className="td2-modify-label">팀원 수</label>
                                <div className="td2-modify-field">
                                    <span className="td2-modify-static">1 팀</span>
                                </div>
                            </div>
                            <div className="td2-modify-row">
                                <label className="td2-modify-label">제출시간</label>
                                <div className="td2-modify-field">
                                    <div className="td2-modify-time-row">
                                        <select className="td2-deadline-select" value={modifyMonth} onChange={e => setModifyMonth(Number(e.target.value))}>
                                            {rangeArray(1, 12).map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <span className="td2-deadline-unit">월</span>
                                        <select className="td2-deadline-select" value={modifyDay} onChange={e => setModifyDay(Number(e.target.value))}>
                                            {rangeArray(1, 31).map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        <span className="td2-deadline-unit">일</span>
                                    </div>
                                    <div className="td2-modify-time-row" style={{ marginTop: 6 }}>
                                        <select className="td2-deadline-select" value={modifyHour} onChange={e => setModifyHour(Number(e.target.value))}>
                                            {rangeArray(0, 23).map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                        <span className="td2-deadline-unit">시</span>
                                        <select className="td2-deadline-select" value={modifyMinute} onChange={e => setModifyMinute(Number(e.target.value))}>
                                            {rangeArray(0, 5).map(m => <option key={m} value={m * 10}>{m * 10}</option>)}
                                        </select>
                                        <span className="td2-deadline-unit">분</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: "center", marginTop: 20 }}>
                                <button className="td2-btn-primary" onClick={handleModifySave}>강의실 수정</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeachDetail2;
