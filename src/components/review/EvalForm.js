import { useState, useEffect, useRef } from "react";
import { getFundingTeams, getFundingInvestment, saveFundingInvestment, submitFundingInvestment, getFundingPortfolio } from "../../services/fundingService";
import { SCORE_MAP, formatNumber } from "../../constants/teachDetail2Constants";

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

    const teamChangeRef = useRef(0);
    const handleTeamChange = async (teamId) => {
        const seq = ++teamChangeRef.current;
        setSelectedTeam(teamId);
        resetForm();
        if (!teamId) return;
        const canvasType = type === "quickwin" ? "quick" : "build";
        const result = await getFundingInvestment(canvasType, teamId);
        if (seq !== teamChangeRef.current) return;
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

export default EvalForm;
