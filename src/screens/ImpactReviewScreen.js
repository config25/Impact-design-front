import { useState, useEffect, useRef } from "react";
import GNB from "../components/common/GNB";
import "./ImpactReviewScreen.css";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, LineController, LineElement, PointElement, CategoryScale, LinearScale, BarController, BarElement } from "chart.js";
import { getFundingTeams, getFundingInvestment, saveFundingInvestment, submitFundingInvestment, getFundingPortfolio, getFundingScores, getMyResult } from "../services/fundingService";

// 문항번호 → score 필드 매핑
const SCORE_MAP = { A1: "score1", A2: "score2", B1: "score3", B2: "score4", B3: "score5", C1: "score6", C2: "score7", D1: "score8", D2: "score9" };

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, LineController, LineElement, PointElement, CategoryScale, LinearScale, BarController, BarElement);

// Quick Win 검증 문항
const QUICK_WIN_QUESTIONS = [
    {
        category: "Problem\n(문제정의)", rowSpan: 2, items: [
            { no: "A1", q: "[현실성] 성과를 가로막는 구체적인 병목(Bottleneck)이나 장애요인을 정확히 포착했는가?", score: 10 },
            { no: "A2", q: "[시급성] 왜 '지금 당장' 이 문제를 해결해야 하는지에 대한 이유가 설득력 있는가?", score: 5 },
        ]
    },
    {
        category: "Solution\n(솔루션)", rowSpan: 3, items: [
            { no: "B1", q: "[구체성] 내일 당장 실행에 옮길 수 있을 만큼 행동 계획(Action Plan)이 구체적인가?", score: 10 },
            { no: "B2", q: "[신속성] 거창한 예산이나 긴 시간 없이, 현재 자원으로 즉시 해결 가능한 방법인가?", score: 5 },
            { no: "B3", q: "[차별성] 기존의 관행을 깨고 장애물을 단숨에 제거할 수 있는 차별화된 접근인가?", score: 15 },
        ]
    },
    {
        category: "Action\n(실행력)", rowSpan: 2, items: [
            { no: "C1", q: "[검증성] 완벽함보다 빠르게 시도(Test)하고 수정(Fix)할 수 있는 구조인가?", score: 10 },
            { no: "C2", q: "[가시성] 실행 결과가 모호하지 않고, O/X로 명확하게 확인 가능한 과제인가?", score: 15 },
        ]
    },
    {
        category: "Effect\n(파급효과)", rowSpan: 2, items: [
            { no: "D1", q: "[성과] 6개월 이내에 조직 분위기를 바꿀 수 있는 '작은 성공(Small Success)'을 만드는가?", score: 15 },
            { no: "D2", q: "[효율] 실행 즉시, 일하는 방식이나 판단 흐름에 눈에 보이는 변화를 만드는가?", score: 15 },
        ]
    },
];

// Build Win 검증 문항
const BUILD_WIN_QUESTIONS = [
    {
        category: "Problem\n(문제정의)", rowSpan: 2, items: [
            { no: "A1", q: "[중요성] 표면적 현상이 아닌, 조직 경쟁력을 강화하는 수준의 과제인가?", score: 10 },
            { no: "A2", q: "[정합성] 과제의 해결이 조직의 장기적 비전 및 핵심가치와 긴밀하게 연결(Align)되는가?", score: 15 },
        ]
    },
    {
        category: "Solution\n(솔루션)", rowSpan: 3, items: [
            { no: "B1", q: "[타당성] 단순히 감이나 주장이 아닌, 합리적인 근거(Facts/Logic)에 기반하여 제시하고 있는가?", score: 10 },
            { no: "B2", q: "[지속성] 특정인의 역량에 의존하지 않고, '프로세스'에 의해 일관된 결과가 나올 수 있는가?", score: 10 },
            { no: "B3", q: "[자산화] 일회성 해결을 넘어, 우리 조직만의 고유한 자산(노하우, 방법론)으로 남는가?", score: 10 },
        ]
    },
    {
        category: "Scale up\n(확장성)", rowSpan: 2, items: [
            { no: "C1", q: "[확장성] 특정 개인/부서를 넘어, 전사적으로 연계될 수 있는 제안인가?", score: 10 },
            { no: "C2", q: "[표준화] 이해당사자들이 누구나 직관적으로 이해하고 실행할 수 있는가?", score: 10 },
        ]
    },
    {
        category: "Effect\n(파급효과)", rowSpan: 2, items: [
            { no: "D1", q: "[펀더멘털] 미래의 시장 변화나 위기에 대응할 수 있는 펀더멘털을 높이는가?", score: 15 },
            { no: "D2", q: "[내재화] 일회성 이벤트로 끝나지 않고, 새로운 문화나 제도로 정착(Embed)될 수 있는가?", score: 10 },
        ]
    },
];




const formatNumber = (num) => num.toLocaleString();

// ── 평가 폼 컴포넌트 ──
const EvalForm = ({ type, questions, title }) => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [taskName, setTaskName] = useState("");
    const [availableBudget, setAvailableBudget] = useState(100000000);
    const [investBudget, setInvestBudget] = useState("");
    const [scores, setScores] = useState({});
    const [opinion, setOpinion] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const canvasType = type === "quickwin" ? "quick" : "build";
        const fetchData = async () => {
            const [teamsResult, portfolioResult] = await Promise.all([
                getFundingTeams(canvasType),
                getFundingPortfolio(canvasType),
            ]);
            if (teamsResult.success) {
                setTeams(teamsResult.data.teams || []);
            }
            if (portfolioResult.success) {
                setAvailableBudget(portfolioResult.data.remainingBudget ?? 100000000);
            }
        };
        fetchData();
    }, [type]);

    const resetForm = () => {
        setTaskName("");
        setInvestBudget("");
        setScores({});
        setOpinion("");
        setSubmitted(false);
    };

    const handleTeamChange = async (teamId) => {
        setSelectedTeam(teamId);
        resetForm();
        if (!teamId) return;
        const canvasType = type === "quickwin" ? "quick" : "build";
        const result = await getFundingInvestment(canvasType, teamId);
        if (result.success) {
            applyResponse(result.data);
        }
    };

    const handleScoreChange = (no, value) => {
        setScores(prev => ({ ...prev, [no]: value }));
    };

    const toScoreValue = (val) => val === "" || val === undefined || val === null ? null : Number(val);

    const buildPayload = () => ({
        investmentTarget: Number(selectedTeam),
        investmentPrice: investBudget.replace(/,/g, "") || "0",
        score1: toScoreValue(scores["A1"]),
        score2: toScoreValue(scores["A2"]),
        score3: toScoreValue(scores["B1"]),
        score4: toScoreValue(scores["B2"]),
        score5: toScoreValue(scores["B3"]),
        score6: toScoreValue(scores["C1"]),
        score7: toScoreValue(scores["C2"]),
        score8: toScoreValue(scores["D1"]),
        score9: toScoreValue(scores["D2"]),
        opinion,
    });

    const applyResponse = (data) => {
        setSelectedTeam(String(data.investmentTarget || ""));
        setTaskName(data.businessName || "");
        setInvestBudget(data.investmentPrice ? formatNumber(Number(data.investmentPrice)) : "");
        const reverseMap = {};
        Object.entries(SCORE_MAP).forEach(([qNo, field]) => { reverseMap[qNo] = data[field]; });
        setScores(reverseMap);
        setOpinion(data.opinion || "");
        setSubmitted(data.submitted || false);
    };

    const handleSave = async () => {
        if (!selectedTeam) { alert("검증 대상 팀을 선택하세요."); return; }
        const canvasType = type === "quickwin" ? "quick" : "build";
        const result = await saveFundingInvestment(canvasType, buildPayload());
        if (result.success) {
            applyResponse(result.data);
            alert("저장되었습니다.");
        } else {
            alert(result.message);
        }
    };

    const handleSubmit = async () => {
        if (!selectedTeam) { alert("검증 대상 팀을 선택하세요."); return; }
        if (!window.confirm("제출완료 후에는 수정이 불가능합니다. 제출하시겠습니까?")) return;
        const canvasType = type === "quickwin" ? "quick" : "build";
        const result = await submitFundingInvestment(canvasType, buildPayload());
        if (result.success) {
            applyResponse(result.data);
            alert("제출이 완료되었습니다.");
        } else {
            alert(result.message);
        }
    };



    return (
        <div className="ir-left">
            <div className="ir-left-card">
                <div className="ir-form-title">{title}</div>

                {/* 검증 대상 */}
                <div className="ir-field-group">
                    <div className="ir-field-label">검증 대상</div>
                    <div className="ir-field-box">
                        <select
                            value={selectedTeam}
                            onChange={(e) => handleTeamChange(e.target.value)}
                        >
                            <option value="">팀을 선택하세요</option>
                            {teams.map(t => (
                                <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 실행 과제명 */}
                <div className="ir-field-group">
                    <div className="ir-field-label">실행 과제명</div>
                    <div className="ir-field-box">
                        <input
                            value={taskName}
                            readOnly
                            placeholder="팀명을 입력하세요."
                        />
                    </div>
                </div>

                {/* 예산 */}
                <div className="ir-field-row">
                    <div className="ir-field-group ir-field-half">
                        <div className="ir-field-label">투입가능 예산</div>
                        <div className="ir-field-box">
                            <input
                                className="ir-budget-value"
                                value={formatNumber(availableBudget)}
                                readOnly
                            />
                            <span className="ir-field-unit">원</span>
                        </div>
                    </div>
                    <div className="ir-field-group ir-field-half">
                        <div className="ir-field-label">투자 예산</div>
                        <div className="ir-field-box">
                            <input
                                className="ir-budget-input"
                                value={investBudget}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
                                    const num = Number(raw);
                                    if (num > 100000000) return;
                                    setInvestBudget(raw ? formatNumber(num) : "");
                                }}
                                placeholder="0"
                            />
                            <span className="ir-field-unit">원</span>
                        </div>
                    </div>
                </div>

                {/* 검증 문항 */}
                <div className="ir-eval-area">
                    {questions.map((group, gi) => (
                        <div className="ir-eval-group" key={gi}>
                            <div className="ir-eval-group-title">
                                {group.category.replace(/\n/g, ' ')}
                            </div>
                            {group.items.map(item => (
                                <div className="ir-eval-row" key={item.no}>
                                    <span className="ir-eval-badge">{item.no}</span>
                                    <span className="ir-eval-text">{item.q}</span>
                                    <div className="ir-eval-score-wrap">
                                        <select
                                            value={scores[item.no] != null ? scores[item.no] : ""}
                                            onChange={(e) => handleScoreChange(item.no, e.target.value)}
                                        >
                                            <option value=""></option>
                                            {Array.from({ length: item.score + 1 }, (_, i) => (
                                                <option key={i} value={i}>{i}점</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* 종합의견 */}
                    <div className="ir-opinion-section">
                        <div className="ir-opinion-title">종합의견</div>
                        <div className="ir-opinion-box">
                            <textarea
                                value={opinion}
                                onChange={(e) => setOpinion(e.target.value)}
                                placeholder="종합의견에 대한 텍스트가 입력됩니다."
                            />
                        </div>
                    </div>
                </div>

                {/* 버튼 */}
                <div className="ir-form-actions">
                    <button className="ir-btn-save" onClick={handleSave} disabled={submitted}>저장</button>
                    <button className="ir-btn-submit" onClick={handleSubmit} disabled={submitted}>{submitted ? "제출됨" : "제출완료"}</button>
                </div>
            </div>
        </div>
    );
};

// ── 오른쪽 패널 (포트폴리오 + 차트) ──
const CHART_COLORS = [
    "#7B87F5", "#8AEAFF", "#3CDFC2", "#F5D562",
    "#F5A623", "#E86B6B",
];
const CHART_BORDERS = [
    "#7B87F5", "#8AEAFF", "#3CDFC2", "#F5D562",
    "#F5A623", "#E86B6B",
];

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
        if (!portfolio || !donutRef.current || !donutRef.current.isConnected) return;
        if (donutChart.current) { donutChart.current.destroy(); donutChart.current = null; }

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
        if (!scores || !lineRef.current || !lineRef.current.isConnected) return;
        if (lineChart.current) { lineChart.current.destroy(); lineChart.current = null; }

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
                    {investments.map((p, i) => (
                        <div key={i} className="ir-portfolio-row">
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
                        <div key={i} className="ir-line-legend-item" onClick={() => toggleDonut(i)} style={{ cursor: "pointer", opacity: donutHidden[i] ? 0.4 : 1 }}>
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
                        <div key={i} className="ir-line-legend-item" onClick={() => toggleLine(i)} style={{ cursor: "pointer", opacity: lineHidden[i] ? 0.4 : 1 }}>
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

// ── 최종 결과 탭 ──
const ResultTab = () => {
    const qwBarRef = useRef(null);
    const bwBarRef = useRef(null);
    const qwChart = useRef(null);
    const bwChart = useRef(null);
    const [resultData, setResultData] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            const result = await getMyResult();
            if (result.success) {
                setResultData(result.data);
            }
        };
        fetchResult();
    }, []);

    useEffect(() => {
        if (!resultData) return;

        const qwScores = resultData.quick?.scores;
        const bwScores = resultData.build?.scores;

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
    }, [resultData]);

    const createBarChart = (canvas, data, labels) => {
        if (!canvas) return null;
        return new Chart(canvas, {
            type: "bar",
            data: {
                labels: labels.map(l => l.split("\n")),
                datasets: [{
                    label: "청중평가",
                    data: data,
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
                resizeDelay: 200,
                layout: { padding: { top: 10 } },
                scales: {
                    y: {
                        min: 0,
                        max: 10,
                        ticks: {
                            stepSize: 1,
                            font: { family: "Inter", size: 12, weight: "400" },
                            color: "#999999",
                        },
                        grid: { color: "#D7D7D7" },
                        border: { display: false },
                    },
                    x: {
                        ticks: {
                            font: { family: "Pretendard", size: 14, weight: "600" },
                            color: "#555555",
                        },
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

    const qwOpinions = resultData?.quick?.opinions || [];
    const bwOpinions = resultData?.build?.opinions || [];
    const qwCount = resultData?.quick?.scores?.evaluatorCount || 0;
    const bwCount = resultData?.build?.scores?.evaluatorCount || 0;

    return (
        <div className="ir-result-body">
            {/* Quick Win 행 */}
            <div className="ir-result-row">
                <div className="ir-result-card">
                    <div className="ir-result-title">Quick Win 실행과제평가</div>
                    <div className="ir-result-chart-subtitle">부문별 획득 점수</div>
                    <div className="ir-result-legend"><span className="ir-legend-box" /><span className="ir-legend-label">청중평가</span></div>
                    <div className="ir-result-chart-box">
                        <canvas ref={qwBarRef} />
                    </div>
                </div>
                <div className="ir-result-card">
                    <div className="ir-opinions-header">평가 참가자 의견</div>
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
            <div className="ir-result-row">
                <div className="ir-result-card">
                    <div className="ir-result-title">Build Win 실행과제평가</div>
                    <div className="ir-result-chart-subtitle">부문별 획득 점수</div>
                    <div className="ir-result-legend"><span className="ir-legend-box" /><span className="ir-legend-label">청중평가</span></div>
                    <div className="ir-result-chart-box">
                        <canvas ref={bwBarRef} />
                    </div>
                </div>
                <div className="ir-result-card">
                    <div className="ir-opinions-header">평가 참가자 의견</div>
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

// ── 메인 컴포넌트 ──
const ImpactReviewScreen = ({ onNavigate, gameStep }) => {
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
            <GNB activeScreen="review" onNavigate={onNavigate} gameStep={gameStep} />

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
