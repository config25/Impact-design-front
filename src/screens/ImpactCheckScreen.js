import { useState, useEffect } from "react";
import GNB from "../components/common/GNB";
import "./ImpactCheckScreen.css";
import pencilIcon from "../resource/start/pencil.png";
import { getImpactCheck, saveImpactCheck, submitImpactCheck } from "../services/impactCheckService";

const ImpactCheckScreen = ({ onNavigate }) => {
    const [department, setDepartment] = useState("");
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getImpactCheck();
            if (result.success && result.data) {
                const data = result.data;
                const loaded = {};
                for (let i = 1; i <= 12; i++) {
                    if (data[`q${i}Score`] != null) loaded[i] = data[`q${i}Score`];
                }
                if (data.q13Text) loaded[13] = data.q13Text;
                if (data.q14Text) loaded[14] = data.q14Text;
                if (data.q15Text) loaded[15] = data.q15Text;
                if (data.q16Text) loaded[16] = data.q16Text;
                setAnswers(loaded);
                setSubmitted(data.submitted || false);
                if (data.gameName) setDepartment(data.gameName);
            }
        };
        fetchData();
    }, []);

    const questions = [
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

    const handleRatingChange = (questionNo, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionNo]: value,
        }));
    };

    const handleTextChange = (questionNo, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionNo]: value,
        }));
    };

    const calculateProgress = () => {
        const totalQuestions = questions.length;
        const answeredQuestions = Object.keys(answers).length;
        return (answeredQuestions / totalQuestions) * 100;
    };

    const handleSave = async () => {
        const result = await saveImpactCheck(answers);
        if (result.success) {
            alert("저장되었습니다.");
        } else {
            alert(result.message);
        }
    };

    const handleSubmit = async () => {
        if (submitted) return;
        if (!window.confirm("진단완료 후에는 수정이 불가능합니다. 제출하시겠습니까?")) return;
        const result = await submitImpactCheck();
        if (result.success) {
            setSubmitted(true);
            alert("진단이 완료되었습니다.");
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="impact-check-container">
            {/* GNB */}
            <GNB activeScreen="impactcheck" onNavigate={onNavigate} />

            {/* 헤더 */}
            <header className="impact-header">
                <h1 className="impact-title">IMPACT Check 16</h1>
                <div className="impact-header-actions">
                    <button className="save-btn" onClick={handleSave} disabled={submitted}>저장</button>
                    <button className="submit-btn" onClick={handleSubmit} disabled={submitted}>
                        {submitted ? "진단완료됨" : "진단완료"}
                    </button>
                </div>
            </header>

            {/* 설명 */}
            <section className="impact-description">
                <p className="description-text">
                    본 진단은 우리 조직이 단순히 열심히 일하는 것을 넘어, 실질적인 성과(Impact)를 창출할 수 있는
                    건전한 구조를 갖추고 있는지 점검하는 'Health Check' 도구입니다.
                </p>
                <div className="department-input">
                    <label>부서명</label>
                    <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="부서명을 입력하세요"
                    />
                </div>
            </section>

            {/* 설문 테이블 */}
            <div className="questionnaire-table">
                <table>
                    <thead>
                        <tr>
                            <th className="no-col">No.</th>
                            <th className="question-col-1">Questionaires</th>
                            <th className="question-col-2"></th>
                            <th className="rating-col">매우 부정</th>
                            <th className="rating-col"></th>
                            <th className="rating-col"></th>
                            <th className="rating-col"></th>
                            <th className="rating-col">매우 긍정</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q) => (
                            q.type === "text" ? (
                                <tr key={q.no} className="text-row">
                                    <td className="no-cell">{q.no}</td>
                                    <td className="text-question-cell">{q.text}</td>
                                    <td className="text-input-cell" colSpan={6}>
                                        <div className="text-input-wrapper">
                                            {!answers[q.no] && (
                                                <img
                                                    src={pencilIcon}
                                                    alt="pencil"
                                                    className="pencil-icon"
                                                    onClick={() => document.getElementById(`text-input-${q.no}`).focus()}
                                                />
                                            )}
                                            <input
                                                id={`text-input-${q.no}`}
                                                type="text"
                                                className="text-input"
                                                value={answers[q.no] || ""}
                                                onChange={(e) => handleTextChange(q.no, e.target.value)}
                                                placeholder=""
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={q.no}>
                                    <td className="no-cell">{q.no}</td>
                                    <td className="question-cell" colSpan={2}>{q.text}</td>
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <td key={rating} className="rating-cell">
                                            <button
                                                type="button"
                                                className={`rating-btn ${answers[q.no] === rating ? "selected" : ""}`}
                                                onClick={() => handleRatingChange(q.no, rating)}
                                            >
                                                {rating}
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ImpactCheckScreen;
