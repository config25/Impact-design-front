import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ReportScreen.css";
import polygonImage from "../resource/report/Polygon 4.png";
import polygon5Image from "../resource/report/Polygon 5.png";
import logoImage from "../resource/report/logo01.png";
import coverMainImage from "../resource/report/image.png";
import image7Bg from "../resource/report/Image 7.png";
import { getImageUrl } from "../utils/logoUtil";
import polygon2Image from "../resource/report/Polygon 2.png";
import unionImage from "../resource/report/union.png";
import frame27Bg from "../resource/report/Frame 27.png";
import polygon3Image from "../resource/report/Polygon 3.png";
import longunionImg from "../resource/report/longunion.png";
import { getReport, getReportByTeam } from "../services/reportService";

const ReportScreen = forwardRef(({ onNavigate, gameStep, teamId, onClose, onReady, hideControls }, ref) => {
    const containerRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            const result = teamId ? await getReportByTeam(teamId) : await getReport();
            if (result.success) {
                setReportData(result.data);
                if (result.data.imageUrl) setLogoUrl(getImageUrl(result.data.imageUrl));
            }
            setLoading(false);
        };
        fetchReport();
    }, [teamId]);

    // 점수 계산 함수들
    const calculateScores = (impactCheckScores) => {
        if (!impactCheckScores || impactCheckScores.length === 0) {
            return { performanceGoal: 0, execution: 0, identity: 0, system: 0, performanceCreation: 0, futureCompetitiveness: 0 };
        }

        let totalPerformanceGoal = 0, totalExecution = 0, totalIdentity = 0, totalSystem = 0;
        const count = impactCheckScores.length;

        impactCheckScores.forEach(score => {
            totalPerformanceGoal += (score.q4Score + score.q5Score + score.q6Score) / 3;
            totalExecution += (score.q7Score + score.q8Score + score.q9Score) / 3;
            totalIdentity += (score.q1Score + score.q2Score + score.q3Score) / 3;
            totalSystem += (score.q10Score + score.q11Score + score.q12Score) / 3;
        });

        const performanceGoal = (totalPerformanceGoal / count).toFixed(2);
        const execution = (totalExecution / count).toFixed(2);
        const identity = (totalIdentity / count).toFixed(2);
        const system = (totalSystem / count).toFixed(2);
        const performanceCreation = ((parseFloat(performanceGoal) + parseFloat(execution)) / 2).toFixed(2);
        const futureCompetitiveness = ((parseFloat(identity) + parseFloat(system)) / 2).toFixed(2);

        return { performanceGoal, execution, identity, system, performanceCreation, futureCompetitiveness };
    };

    // 성과 프로파일 타입 결정 (X축: 미래경쟁력, Y축: 성과창출력)
    // Coord_X = futureCompetitiveness, Coord_Y = performanceCreation
    const getProfileType = (performanceCreation, futureCompetitiveness) => {
        const coordY = parseFloat(performanceCreation); // Y축: 성과창출력
        const coordX = parseFloat(futureCompetitiveness); // X축: 미래경쟁력

        if (coordX >= 3 && coordY >= 3) {
            return {
                name: "Impact Player",
                korean: "(지속가능한 리더)",
                quadrant: "TR",
                tagline: "높은 효능감과 시스템이 조화를 이룬 '확신'의 단계",
                diagnosis: "구성원들은 현재의 성과뿐만 아니라, 미래를 위한 시스템과 비전에 대해서도 매우 긍정적으로 '인식(Perception)'하고 있습니다. 이는 조직의 성공 방식에 대한 내부 신뢰가 높다는 뜻이며, 성과와 시스템이 균형을 이룬 이상적인 상태입니다. 다만, 이 확신이 '자만'이 되지 않도록 현재의 성공을 객관화하는 작업이 필요합니다.",
                solution: "지금의 성과는 '우연'이 아닙니다. 이 성공 모델을 조직 전체의 '표준(Standard)'으로 만들어야 합니다. 첫째, 특정 고성과자(High Performer)들의 암묵적인 노하우를 발굴하여 조직의 공용 자산으로 만드십시오. 둘째, 이 성공 방정식을 다른 부서나 차세대 리더들에게 확산(Spread)하여, 리더 한 명의 역량이 아닌 '시스템의 힘'으로 성과가 재생산되는 선순환 구조를 완성하십시오."
            };
        }
        if (coordX < 3 && coordY >= 3) {
            return {
                name: "Burnout Runner",
                korean: "(지쳐가는 러너)",
                quadrant: "TL",
                tagline: "높은 성과 '인식'과 취약한 '기반'의 딜레마",
                diagnosis: "구성원들은 현재 조직의 성과 창출 수준을 매우 높게 '인식(Perception)'하고 있습니다. 그러나 이는 탄탄한 시스템이나 명확한 목표 의식에 기반한 것이 아니라, 단순히 \"우리는 열심히 하고 있다\"는 주관적 자신감일 가능성이 큽니다. 지속가능한 성과 창출 시스템이 빈약하다고 판단하고 있기 때문에, 작은 환경 변화에도 그 자신감이 쉽게 무너질 수 있는 구조적 취약성을 안고 있습니다.",
                solution: "지금 필요한 것은 막연한 '열심'이 아니라, 성공을 담아낼 그릇인 '시스템'입니다. 첫째, 구성원들이 동일한 곳을 바라볼 수 있도록 명확한 목표(Clear Goal)를 재설정하여 방향성을 정렬(Alignment)해야 합니다. 둘째, 개인의 암묵지에 의존하던 업무 방식을 프로세스로 자산화하여, 어떤 환경 변화에도 흔들리지 않는 '이기는 구조'를 구축하십시오."
            };
        }
        if (coordX >= 3 && coordY < 3) {
            return {
                name: "Idle Dreamer",
                korean: "(잠자는 몽상가)",
                quadrant: "BR",
                tagline: "이상적인 '계획'과 빈약한 '실행'의 괴리 단계",
                diagnosis: "구성원들은 현재 조직의 성과 창출 수준을 매우 높게 '인식(Perception)'하고 있습니다. 그러나 이는 탄탄한 시스템이나 명확한 목표 의식에 기반한 것이 아니라, 단순히 \"우리는 열심히 하고 있다\"는 주관적 자신감일 가능성이 큽니다. 지속가능한 성과 창출 시스템이 빈약하다고 판단하고 있기 때문에, 작은 환경 변화에도 그 자신감이 쉽게 무너질 수 있는 구조적 취약성을 안고 있습니다.",
                solution: "책상 위의 완벽주의를 버리고, 거칠더라도 현장에서 부딪히는 '야생성(Wildness)'을 회복해야 합니다. 첫째, 계획 수립에 쓰는 시간을 절반으로 줄이고, 즉시 실행하고 실패를 통해 수정하는 '애자일(Agile) 방식'을 도입하십시오. 둘째, 말이 아닌 '행동'과 '결과'로 평가받는 문화를 정착시켜, 조직의 무게중심을 '생각'에서 '실행'으로 옮겨야 합니다."
            };
        }
        return {
            name: "Survival Walker",
            korean: "(생존형 보행자)",
            quadrant: "BL",
            tagline: "성과와 방향성을 모두 상실한 '위기 의식'의 단계",
            diagnosis: "구성원들은 현재의 성과 창출력도 낮고, 미래를 위한 준비도 부족하다고 인식(Perception)하고 있습니다. 이는 단순한 실적 부진을 넘어, 조직이 어디로 가야 할지 모른다는 '방향 상실감'과 해도 안 된다는 '무기력함'이 팽배해 있음을 시사합니다. 비전보다 생존이 급한 위험 신호입니다.",
            solution: "지금 필요한 것은 거창한 '비전 선포'가 아니라, 당장 눈앞의 '작은 성공(Small Win)'입니다. 첫째, 불필요한 업무와 형식적인 절차를 과감히 제거(Cut)하여 구성원들의 숨통을 틔워주어야 합니다. 둘째, 단기간에 달성 가능한 구체적인 목표를 부여하고 이를 성취하게 함으로써, 바닥에 떨어진 조직의 '자기 효능감'부터 회복하는 것이 급선무입니다."
        };
    };

    // 텍스트 자르기 유틸리티 함수
    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const scores = reportData ? calculateScores(reportData.impactCheckScores) : null;
    const profileType = scores ? getProfileType(scores.performanceCreation, scores.futureCompetitiveness) : null;

    // 동적 페이지 번호 계산
    const has11P = (reportData?.flowCanvasGoals?.goals?.length || 0) >= 21;
    const has13P = (reportData?.tacticals?.length || 0) >= 45;
    const has15P = (reportData?.strategicActivities?.length || 0) >= 45;

    const getPageNumber = (basePage) => {
        let offset = 0;
        // 11P 이후 페이지들은 11P 존재 여부에 따라 조정
        if (basePage > 10 && !has11P) offset -= 1;
        // 13P 이후 페이지들은 13P 존재 여부에 따라 조정
        if (basePage > 12 && !has13P) offset -= 1;
        // 15P 이후 페이지들은 15P 존재 여부에 따라 조정
        if (basePage > 14 && !has15P) offset -= 1;
        return basePage + offset;
    };

    const generatePDFBlob = async () => {
        if (!containerRef.current) return null;

        const originalCreatePattern = CanvasRenderingContext2D.prototype.createPattern;
        CanvasRenderingContext2D.prototype.createPattern = function (image, repetition) {
            if (image && (image.width === 0 || image.height === 0)) return null;
            return originalCreatePattern.call(this, image, repetition);
        };

        try {
            const pages = containerRef.current.querySelectorAll(".report-page");
            const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [1000, 1415] });

            for (let i = 0; i < pages.length; i++) {
                const canvas = await html2canvas(pages[i], {
                    scale: 2, useCORS: true, allowTaint: true, backgroundColor: null,
                    width: 1000, height: 1415, logging: false,
                });
                const imgData = canvas.toDataURL("image/jpeg", 0.95);
                if (i > 0) pdf.addPage([1000, 1415]);
                pdf.addImage(imgData, "JPEG", 0, 0, 1000, 1415);
            }

            return pdf.output("blob");
        } finally {
            CanvasRenderingContext2D.prototype.createPattern = originalCreatePattern;
        }
    };

    useImperativeHandle(ref, () => ({ generatePDFBlob }));

    useEffect(() => {
        if (!loading && reportData && onReady) {
            const timer = setTimeout(() => onReady(), 500);
            return () => clearTimeout(timer);
        }
    }, [loading, reportData, onReady]);

    if (loading) {
        return <div className="report-loading">리포트를 불러오는 중...</div>;
    }

    if (!reportData) {
        return <div className="report-loading">리포트 데이터가 없습니다.</div>;
    }

    const handleDownloadPDF = async () => {
        if (!containerRef.current || isExporting) return;
        setIsExporting(true);

        // html2canvas 0x0 이미지 에러 방지: createPattern 임시 패치
        const originalCreatePattern = CanvasRenderingContext2D.prototype.createPattern;
        CanvasRenderingContext2D.prototype.createPattern = function (image, repetition) {
            if (image && (image.width === 0 || image.height === 0)) {
                return null;
            }
            return originalCreatePattern.call(this, image, repetition);
        };

        try {
            const pages = containerRef.current.querySelectorAll(".report-page");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [1000, 1415],
            });

            for (let i = 0; i < pages.length; i++) {
                const canvas = await html2canvas(pages[i], {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null,
                    width: 1000,
                    height: 1415,
                    logging: false,
                });

                const imgData = canvas.toDataURL("image/jpeg", 0.95);

                if (i > 0) pdf.addPage([1000, 1415]);
                pdf.addImage(imgData, "JPEG", 0, 0, 1000, 1415);
            }

            pdf.save("Impact_Report.pdf");
        } catch (err) {
            console.error("PDF export failed:", err);
        } finally {
            CanvasRenderingContext2D.prototype.createPattern = originalCreatePattern;
            setIsExporting(false);
        }
    };
    const blueprintSteps = [
        {
            roman: "I",
            tag: "인식",
            tagColor: "#B8C1DB",
            title: "Performance\nProfile",
            subtitle: "성과인식 프로파일",
            question: "우리는 성과를\n어떻게 바라보는가?",
        },
        {
            roman: "II",
            tag: "방향",
            tagColor: "#8494BF",
            title: "Strategic\nIdentity",
            subtitle: "미래의 정체성 확립",
            question: "우리는 어디로\n어떻게 가야 하는가?",
        },
        {
            roman: "III",
            tag: "기준",
            tagColor: "#5E72A9",
            title: "Performance\nStream",
            subtitle: "성과와 행동의 기준",
            question: "우리의 목표와\n기준은 무엇인가?",
        },
        {
            roman: "IV",
            tag: "실행",
            tagColor: "#314A8F",
            title: "Quick &\nBuild Win",
            subtitle: "단기/중장기 실행과제",
            question: "당장 무엇을\n실행할 것인가?",
        },
    ];

    return (
        <div className="report-container" ref={containerRef}>
            {!hideControls && <button
                className="pdf-download-btn"
                onClick={handleDownloadPDF}
                disabled={isExporting}
            >
                {isExporting ? "PDF 생성 중..." : "PDF 다운로드"}
            </button>}

            {/* Page 1 - Cover */}
            <div className="report-page report-page-cover">
                {/* 왼쪽 세로 텍스트: Make Impact */}
                <div className="cover-vertical-left">MAKE IMPACT</div>

                {/* 오른쪽 세로 텍스트: Keep Balance */}
                <div className="cover-vertical-right">KEEP BALANCE</div>

                {/* 우측 장식 세로선 */}
                <div className="cover-line-1" />
                <div className="cover-line-2" />

                {/* 부제 */}
                <p className="cover-subtitle">
                    <span className="cover-subtitle-bar">|</span>&nbsp;&nbsp;성과 최적화를 위한 전략적 진단 및 제안
                </p>

                {/* 메인 타이틀 */}
                <h1 className="cover-main-title">
                    THE IMPACT<br />
                    <span className="cover-main-title-thin">REPORT</span>
                </h1>

                {/* Polygon 1 장식 */}
                <img src={polygonImage} alt="" className="cover-polygon1" />

                {/* 태그라인 */}
                <p className="cover-tagline">Make Impact. Keep Balance.</p>

                {/* 구분선 */}
                <div className="cover-divider" />

                {/* 메인 일러스트 */}
                <img src={coverMainImage} alt="" className="cover-main-image" />

                {/* 정보 섹션 */}
                <div className="cover-info">
                    <div className="cover-info-item">
                        <p className="cover-info-label"><span className="cover-info-bar">|</span>&nbsp;&nbsp;Project Date</p>
                        <p className="cover-info-value">{reportData?.projectDate ? reportData.projectDate.replaceAll("-", ". ") : "-"}</p>
                    </div>
                    <div className="cover-info-item">
                        <p className="cover-info-label"><span className="cover-info-bar">|</span>&nbsp;&nbsp;과정명</p>
                        <p className="cover-info-value">{reportData?.className || "-"}</p>
                    </div>
                    <div className="cover-info-item">
                        <p className="cover-info-label"><span className="cover-info-bar">|</span>&nbsp;&nbsp;대상</p>
                        <p className="cover-info-value">{reportData?.target || "-"}</p>
                    </div>
                    <div className="cover-info-item">
                        <p className="cover-info-label"><span className="cover-info-bar">|</span>&nbsp;&nbsp;Facilitator</p>
                        <p className="cover-info-value">㈜퀀텀에듀솔루션</p>
                    </div>
                </div>

                {/* Polygon 5 장식 */}
                <img src={polygon5Image} alt="" className="cover-polygon5" />

                {/* 하단 로고 */}
                <img src={process.env.PUBLIC_URL + "/q_logo.png"} alt="Quantum Edu Solution" className="cover-logo" />
                <p className="cover-powered">Powered by Quantum Edu Solution Methodology</p>
            </div>

            {/* Page 2 - About This Report */}
            <div className="report-page report-page-2">
                {/* Blue Section */}
                <div className="p2-blue-section">
                    <h2 className="p2-title">About This Report</h2>
                    <p className="p2-subtitle">
                        이 보고서는 견고한 성과창출 구조 설계를 위한 출발점을 제시하는 문서입니다.
                    </p>

                    <div className="p2-transparent-boxes">
                        <div className="p2-transparent-box">
                            <p className="p2-transparent-text">
                                본 리포트는 귀사가 확고한 'Impact Player(지속가능한 성과창출 조직)'로
                                <br />
                                도약하기 위한 구체적인 실행 로드맵을 담고 있습니다.
                            </p>
                        </div>
                        <div className="p2-transparent-box">
                            <p className="p2-transparent-text">
                                본 리포트는 구성원들의 생생한 목소리(Voice)를 담고 있으며, 단기 성과창출과
                                <br />
                                근본적 체질 개선을 위한 새로운 방향과 기준, 그리고 전략적 행동을 논리적으로 제안합니다.
                            </p>
                        </div>
                        <div className="p2-transparent-box p2-transparent-box-sm">
                            <p className="p2-transparent-text">
                                제시하는 모든 내용은 귀사 구성원들의 의견과 작성 자료를 토대로 사실에 기반해 작성되었습니다.
                            </p>
                        </div>
                    </div>

                    <img src={polygonImage} alt="" className="p2-polygon" />
                </div>

                {/* White Section */}
                <div className="p2-white-section">
                    <h3 className="p2-blueprint-title">
                        The Strategic Blueprint &nbsp;| &nbsp;성과를 창출하는 4단계
                    </h3>

                    {/* Gradient Bar with Roman Numerals */}
                    <div className="p2-gradient-bar">
                        {blueprintSteps.map((step, i) => (
                            <span key={i} className="p2-roman">{step.roman}</span>
                        ))}
                    </div>

                    {/* Step Cards */}
                    <div className="p2-steps-row">
                        {blueprintSteps.map((step, i) => (
                            <div key={i} className="p2-step-col">
                                <div className="p2-step-card">
                                    <div
                                        className="p2-step-tag"
                                        style={{ backgroundColor: step.tagColor }}
                                    >
                                        {step.tag}
                                    </div>
                                    <p className="p2-step-title">{step.title}</p>
                                    <p className="p2-step-subtitle">{step.subtitle}</p>
                                </div>
                                <div className="p2-step-connector"></div>
                                <div className="p2-step-question">
                                    <p className="p2-question-text">{step.question}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Quote */}
                    <div className="p2-quote-box">
                        <p className="p2-quote-text">
                            "우리는 눈앞의 성과(<span className="p2-quote-bold">Tactical KPI</span>)와 미래를 위한 체질(<span className="p2-quote-bold">Strategic KAI</span>)을 동시에 관리하여,
                            <br />
                            지속가능한 성과를 만드는 구조(<span className="p2-quote-bold">Structure</span>)를 설계합니다."
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">2</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>
            {/* Page 3 - Contents */}
            <div className="report-page report-page-3">
                <h2 className="p3-title">CONTENTS</h2>

                <div className="p3-main-box">
                    <h3 className="p3-main-heading">
                        I. Performance Profile (성과 인식 프로파일)
                    </h3>
                    <p className="p3-main-quote">
                        " 우리는 지금 성과를 어떻게 인식하고 있는가? "
                    </p>
                    <p className="p3-main-desc">
                        성과를 결과로 보고 있는지,
                        <br />
                        아니면 구조와 체질의 문제로 보고 있는지를 점검합니다.
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-section-box">
                    <p className="p3-section-text">
                        II. Strategic Identity (미래 방향성에 대한 인식)
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-section-box">
                    <p className="p3-section-text">
                        III. Performance Stream (전략 목표에 대한 인식)
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-section-box">
                    <p className="p3-section-text">
                        IV. Quick & Build Win(실행과제 제안과 평가)
                    </p>
                </div>

                <img src={polygon3Image} alt="" className="p3-polygon3" />
                <img src={polygon2Image} alt="" className="p3-polygon2" />
            </div>

            {/* Page 4 - Performance Profile */}
            <div className="report-page report-page-4">
                {/* Top bar */}
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential">Confidential &amp; Proprietary</span>
                </div>

                {/* Section header */}
                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    I. Performance Profile (성과 인식 프로파일)
                </div>

                {/* Description box */}
                <div className="p4-desc-box">
                    <p className="p4-desc-text">
                        Performance Profile은 구성원들이 인식하는 '현재 성과(Performance)'와 이를 지탱하는 '미래 경쟁력 (System)'의 균형점을 진단하는 도구입니다. 성과 데이터를 분석한 것이 아니라 조직 내부의 시선으로 본 우리 조직의 '성장 건전성'을 점검하고, Impact Player로 도약하기 위한 전략적 현주소를 제시합니다.
                    </p>
                </div>

                {/* Blue divider line */}
                <div className="p4-divider-line"></div>

                {/* Result box */}
                <div className="p4-result-box">
                    <span className="p4-result-subtitle">귀사 구성원들이 바라보는 조직의 성과창출 스타일은</span>
                    <div className="p4-result-title-row">
                        <span className="p4-result-name">{profileType?.name || "Burnout Runner"}</span>
                        <span className="p4-result-korean">{profileType?.korean || "(지쳐가는 러너)"}</span>
                    </div>
                    <span className="p4-result-tagline">{profileType?.tagline || "높은 성과 '인식'과 취약한 '기반'의 딜레마"}</span>
                </div>

                {/* Main box (chart + analysis) */}
                <div className="p4-main-box">
                    {/* Arrow images */}
                    <img src={longunionImg} alt="" className="p4-arrow-img-y" />
                    <img src={longunionImg} alt="" className="p4-arrow-img-x" />

                    {/* Chart area */}
                    <div className="p4-chart-area">
                        {/* Matrix chart */}
                        <div className="p4-matrix-section">
                            <div className="p4-y-label">
                                성과 창출력 (성과목표, 실행력)
                            </div>
                            <div className="p4-chart-inner">
                                <div className="p4-axes-wrap">
                                    <span className="p4-y-high">High</span>
                                    <div className="p4-quad-grid">
                                        {/* TL - Burnout Runner */}
                                        <div className={`p4-quad ${profileType?.quadrant === "TL" ? "p4-quad-active" : "p4-quad-inactive"}`}>
                                            <strong className={profileType?.quadrant === "TL" ? "p4-quad-name-w" : "p4-quad-name-g"}>Burnout Runner</strong>
                                            <span className={profileType?.quadrant === "TL" ? "p4-quad-sub-w" : "p4-quad-sub-g"}>(지쳐가는 러너)</span>
                                            {profileType?.quadrant === "TL" && (
                                                <>
                                                    <div className="p4-score-pill-new">
                                                        <span className="p4-pill-yellow">성과 창출력 : {scores?.performanceCreation}</span>
                                                    </div>
                                                    <div className="p4-score-pill-new">
                                                        <span className="p4-pill-green">미래 경쟁력 : {scores?.futureCompetitiveness}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {/* TR - Impact Player */}
                                        <div className={`p4-quad ${profileType?.quadrant === "TR" ? "p4-quad-active" : "p4-quad-inactive"}`}>
                                            <strong className={profileType?.quadrant === "TR" ? "p4-quad-name-w" : "p4-quad-name-g"}>Impact Player</strong>
                                            <span className={profileType?.quadrant === "TR" ? "p4-quad-sub-w" : "p4-quad-sub-g"}>(지속가능한 리더)</span>
                                            {profileType?.quadrant === "TR" && (
                                                <>
                                                    <div className="p4-score-pill-new">
                                                        <span className="p4-pill-yellow">성과 창출력 : {scores?.performanceCreation}</span>
                                                    </div>
                                                    <div className="p4-score-pill-new">
                                                        <span className="p4-pill-green">미래 경쟁력 : {scores?.futureCompetitiveness}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {/* BL - Survival Walker */}
                                        <div className={`p4-quad ${profileType?.quadrant === "BL" ? "p4-quad-active" : "p4-quad-inactive"}`}>
                                            <strong className={profileType?.quadrant === "BL" ? "p4-quad-name-w" : "p4-quad-name-g"}>Survival Walker</strong>
                                            <span className={profileType?.quadrant === "BL" ? "p4-quad-sub-w" : "p4-quad-sub-g"}>(생존형 보행자)</span>
                                            {profileType?.quadrant === "BL" && (
                                                <>
                                                    <div className="p4-score-pill-new">
                                                        <span className="p4-pill-yellow">성과 창출력 : {scores?.performanceCreation}</span>
                                                    </div>
                                                    <div className="p4-score-pill-new">
                                                        <span className="p4-pill-green">미래 경쟁력 : {scores?.futureCompetitiveness}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {/* BR - Idle Dreamer */}
                                        <div className={`p4-quad ${profileType?.quadrant === "BR" ? "p4-quad-active" : "p4-quad-inactive"}`}>
                                            <strong className={profileType?.quadrant === "BR" ? "p4-quad-name-w" : "p4-quad-name-g"}>Idle Dreamer</strong>
                                            <span className={profileType?.quadrant === "BR" ? "p4-quad-sub-w" : "p4-quad-sub-g"}>(잠자는 몽상가)</span>
                                            {profileType?.quadrant === "BR" && (
                                                <>
                                                    <div className="p4-score-pill-new">
                                                        <span className="p4-pill-yellow">성과 창출력 : {scores?.performanceCreation}</span>
                                                    </div>
                                                    <div className="p4-score-pill-new">
                                                        <span className="p4-pill-green">미래 경쟁력 : {scores?.futureCompetitiveness}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <span className="p4-y-low">Low</span>
                                    <span className="p4-x-high">High</span>
                                </div>
                                <div className="p4-x-label-row">
                                    <span className="p4-x-label-text">미래 경쟁력 (아이덴티티, 시스템)</span>
                                </div>
                            </div>
                        </div>

                        {/* Score table */}
                        <div className="p4-table-wrap">
                        <table className="p4-score-table">
                            <colgroup>
                                <col style={{ width: '27%' }} />
                                <col style={{ width: '27%' }} />
                                <col style={{ width: '20%' }} />
                                <col style={{ width: '12%' }} />
                                <col style={{ width: '14%' }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th colSpan={2} className="p4-th-border">구분</th>
                                    <th className="p4-th-border">요인</th>
                                    <th colSpan={2}>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td rowSpan={2} className="p4-td-category">
                                        성과 창출력<br />(CP, Current Performan<br />ce)
                                    </td>
                                    <td rowSpan={2} className="p4-td-factor">
                                        현재 성과 창출에 대한 인식
                                    </td>
                                    <td className="p4-td-item">성과목표</td>
                                    <td className="p4-td-score">{scores?.performanceGoal || "-"}</td>
                                    <td rowSpan={2} className="p4-td-avg p4-td-avg-yellow">{scores?.performanceCreation || "-"}</td>
                                </tr>
                                <tr>
                                    <td className="p4-td-item">실행력</td>
                                    <td className="p4-td-score">{scores?.execution || "-"}</td>
                                </tr>
                                <tr>
                                    <td rowSpan={2} className="p4-td-category p4-td-category-last">
                                        미래 경쟁력<br />(FC, Future Competitive<br />ness)
                                    </td>
                                    <td rowSpan={2} className="p4-td-factor p4-td-factor-last">
                                        미래 성과 창출에 대한 인식
                                    </td>
                                    <td className="p4-td-item">아이덴티티</td>
                                    <td className="p4-td-score">{scores?.identity || "-"}</td>
                                    <td rowSpan={2} className="p4-td-avg p4-td-avg-green">{scores?.futureCompetitiveness || "-"}</td>
                                </tr>
                                <tr>
                                    <td className="p4-td-item p4-td-item-last">시스템</td>
                                    <td className="p4-td-score p4-td-score-last">{scores?.system || "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>

                    {/* Analysis area */}
                    <div className="p4-analysis-area">
                        <div className="p4-analysis-badge p4-badge-diag">진단</div>
                        <div className="p4-analysis-content-box">
                            <p className="p4-analysis-text">
                                {profileType?.diagnosis || ""}
                            </p>
                        </div>
                        <div className="p4-analysis-badge p4-badge-sol">솔루션</div>
                        <div className="p4-analysis-content-box">
                            <p className="p4-analysis-text">
                                {profileType?.solution || ""}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">4</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 5 - Strategic Identity Contents */}
            <div className="report-page report-page-5">
                <h2 className="p3-title">CONTENTS</h2>

                <div className="p3-section-box" style={{ marginTop: '128px' }}>
                    <p className="p3-section-text">
                        I. Performance Profile (성과 인식 프로파일)
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-main-box">
                    <h3 className="p3-main-heading">
                        II. Strategic Identity (미래 방향성에 대한 인식)
                    </h3>
                    <p className="p3-main-quote">
                        " 어떤 성과를 만들어내는 조직이 되고자 하는가? "
                    </p>
                    <p className="p3-main-desc">
                        환경 변화와 내부 한계를 바탕으로
                        <br />
                        앞으로의 성과 방향과 정체성을 재정의합니다.
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-section-box">
                    <p className="p3-section-text">
                        III. Performance Stream (전략 목표에 대한 인식)
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-section-box">
                    <p className="p3-section-text">
                        IV. Quick & Build Win(실행과제 제안과 평가)
                    </p>
                </div>

                <img src={polygon3Image} alt="" className="p3-polygon3" />
                <img src={polygon2Image} alt="" className="p3-polygon2" />
            </div>

            {/* Page 6 - Strategic Identity: External Threats */}
            <div className="report-page report-page-6">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    II. Strategic Identity (미래 방향성에 대한 인식)
                </div>

                <div className="p4-desc-box">
                    <p className="p4-desc-text">
                        Strategic Identity는 조직을 둘러싼 위협적인 '외부 변화'와 이를 극복하기 위한 '내부 한계점'에 대한 구성원들의 생생한 목소리를 담고 있습니다. 우리 조직의 존재 이유와 목표를 재정의하고, 구성원들이 도출한 새로운 미션, 비전, 핵심가치를 통해 위기를 돌파할 실질적인 미래 청사진을 제안합니다.
                    </p>
                </div>

                <p className="p6-result-text">
                    귀사 구성원들이 느끼는 <span className="p6-result-highlight">외부 환경 변화</span>에 대한 체감하는 내용은 다음과 같습니다.
                </p>

                <div className="p6-threats-box">
                    <h3 className="p6-threats-title">외부의 위협신호</h3>
                    <p className="p6-threats-subtitle">(External Threats)</p>
                    <div className="p6-threat-items">
                        {reportData?.externalThreats?.aiSummary?.map((summary, idx) => (
                            <div className="p6-threat-item" key={idx}>
                                <p className="p6-threat-text">{idx + 1}. {summary}</p>
                            </div>
                        )) || (
                            <>
                                <div className="p6-threat-item"><p className="p6-threat-text">1. -</p></div>
                                <div className="p6-threat-item"><p className="p6-threat-text">2. -</p></div>
                                <div className="p6-threat-item"><p className="p6-threat-text">3. -</p></div>
                            </>
                        )}
                    </div>
                </div>

                <div className="p6-voice-section">
                    <h3 className="p6-voice-title">Voice of Employee</h3>
                    <div className="p6-voice-bubbles">
                        {reportData?.externalThreats?.top4?.slice(0, 4).map((item, idx) => (
                            <div className="p6-voice-bubble" key={idx} style={{ width: 'auto', maxWidth: '852px' }}>
                                <p className="p6-voice-text">"{item.content}"</p>
                            </div>
                        )) || (
                            <>
                                <div className="p6-voice-bubble" style={{ width: '709px' }}><p className="p6-voice-text">-</p></div>
                                <div className="p6-voice-bubble" style={{ width: '709px' }}><p className="p6-voice-text">-</p></div>
                                <div className="p6-voice-bubble" style={{ width: '709px' }}><p className="p6-voice-text">-</p></div>
                                <div className="p6-voice-bubble" style={{ width: '709px' }}><p className="p6-voice-text">-</p></div>
                            </>
                        )}
                    </div>
                </div>

                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '189px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '388px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '588px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '787px' }} />

                <div className="p6-keywords-row">
                    {reportData?.externalThreats?.keywords?.slice(0, 4).map((keyword, idx) => (
                        <div className="p6-keyword-box" key={idx}><span className="p6-keyword-text"># {keyword}</span></div>
                    )) || (
                        <>
                            <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                            <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                            <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                            <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                        </>
                    )}
                </div>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">6</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 7 - Strategic Identity: Internal Limits */}
            <div className="report-page report-page-7">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    II. Strategic Identity (미래 방향성에 대한 인식)
                </div>

                <div className="p4-desc-box">
                    <p className="p4-desc-text">
                        Strategic Identity는 조직을 둘러싼 위협적인 '외부 변화'와 이를 극복하기 위한 '내부 한계점'에 대한 구성원들의 생생한 목소리를 담고 있습니다. 우리 조직의 존재 이유와 목표를 재정의하고, 구성원들이 도출한 새로운 미션, 비전, 핵심가치를 통해 위기를 돌파할 실질적인 미래 청사진을 제안합니다.
                    </p>
                </div>

                <p className="p6-result-text">
                    귀사 구성원들이 느끼는 <span className="p6-result-highlight">내부 역량 한계</span>에 대한 체감하는 내용은 다음과 같습니다.
                </p>

                <div className="p6-threats-box">
                    <h3 className="p6-threats-title">내부의 한계점</h3>
                    <p className="p6-threats-subtitle">(Internal Limits)</p>
                    <div className="p6-threat-items">
                        {reportData?.internalLimitations?.aiSummary?.map((summary, idx) => (
                            <div className="p6-threat-item" key={idx}>
                                <p className="p6-threat-text">{idx + 1}. {summary}</p>
                            </div>
                        )) || (
                            <>
                                <div className="p6-threat-item"><p className="p6-threat-text">1. -</p></div>
                                <div className="p6-threat-item"><p className="p6-threat-text">2. -</p></div>
                                <div className="p6-threat-item"><p className="p6-threat-text">3. -</p></div>
                            </>
                        )}
                    </div>
                </div>

                <div className="p6-voice-section">
                    <h3 className="p6-voice-title">Voice of Employee</h3>
                    <div className="p6-voice-bubbles">
                        {reportData?.internalLimitations?.top4?.slice(0, 4).map((item, idx) => (
                            <div className="p6-voice-bubble" key={idx} style={{ width: 'auto', maxWidth: '830px' }}>
                                <p className="p6-voice-text">"{item.content}"</p>
                            </div>
                        )) || (
                            <>
                                <div className="p6-voice-bubble" style={{ width: '740px' }}><p className="p6-voice-text">-</p></div>
                                <div className="p6-voice-bubble" style={{ width: '740px' }}><p className="p6-voice-text">-</p></div>
                                <div className="p6-voice-bubble" style={{ width: '740px' }}><p className="p6-voice-text">-</p></div>
                                <div className="p6-voice-bubble" style={{ width: '200px' }}><p className="p6-voice-text">-</p></div>
                            </>
                        )}
                    </div>
                </div>

                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '189px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '388px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '588px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '787px' }} />

                <div className="p6-keywords-row">
                    {reportData?.internalLimitations?.keywords?.slice(0, 4).map((keyword, idx) => (
                        <div className="p6-keyword-box" key={idx}><span className="p6-keyword-text"># {keyword}</span></div>
                    )) || (
                        <>
                            <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                            <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                            <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                            <div className="p6-keyword-box"><span className="p6-keyword-text"># -</span></div>
                        </>
                    )}
                </div>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">7</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 8 - Performance Stream Contents */}
            <div className="report-page report-page-8">
                <h2 className="p3-title">CONTENTS</h2>

                <div className="p3-section-box" style={{ marginTop: '128px' }}>
                    <p className="p3-section-text">
                        I. Performance Profile (성과 인식 프로파일)
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-section-box">
                    <p className="p3-section-text">
                        II. Strategic Identity (미래 방향성에 대한 인식)
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-main-box">
                    <h3 className="p3-main-heading">
                        III. Performance Stream (전략 목표에 대한 인식)
                    </h3>
                    <p className="p3-main-quote">
                        " 그 방향이 성과로 나타나려면,
                        <br />
                        무엇을 목표와기준으로 설정해야 하는가? "
                    </p>
                    <p className="p3-main-desc">
                        비전을 실행 가능한 전략목표와 성과 기준으로 전환합니다.
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-section-box">
                    <p className="p3-section-text">
                        IV. Quick & Build Win(실행과제 제안과 평가)
                    </p>
                </div>

                <img src={polygon3Image} alt="" className="p3-polygon3" />
                <img src={polygon2Image} alt="" className="p3-polygon2" />
            </div>

            {/* Page 9 - Performance Stream: New Future */}
            <div className="report-page report-page-9">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    III. Performance Stream (전략 목표에 대한 인식)
                </div>

                <p className="p9-result-text">
                    귀사 구성원들의 의견을 토대로 AI가 그려본 새로운 미래는 다음과 같습니다
                </p>

                <div className="p9-future-box">
                    <h3 className="p9-future-title">우리 조직의 새로운 미래</h3>
                    <div className="p9-future-columns">
                        <div className="p9-col-outer">
                            <div className="p9-col-header">
                                <span className="p9-new-badge">NEW</span>
                                <span className="p9-col-label">미션 (Mission)</span>
                            </div>
                            <div className="p9-col-content">
                                <p className="p9-col-text">{reportData?.visionMissionValue?.aiMission || "(재정의된 존재 이유)"}</p>
                            </div>
                        </div>
                        <div className="p9-col-outer">
                            <div className="p9-col-header">
                                <span className="p9-new-badge">NEW</span>
                                <span className="p9-col-label">비전 (Vision)</span>
                            </div>
                            <div className="p9-col-content">
                                <p className="p9-col-text">{reportData?.visionMissionValue?.aiVision || "(재정의된 목표)"}</p>
                            </div>
                        </div>
                        <div className="p9-col-outer">
                            <div className="p9-col-header">
                                <span className="p9-new-badge">NEW</span>
                                <span className="p9-col-label">핵심가치 (Value)</span>
                            </div>
                            <div className="p9-col-content">
                                <p className="p9-col-text">{reportData?.visionMissionValue?.aiValue || "(재정의된 핵심가치)"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p9-triangle" style={{ top: '720px' }}></div>
                <div className="p9-triangle" style={{ top: '733px' }}></div>

                <p className="p9-result-text p9-result-text2">
                    귀사 구성원들이 제안한 새로운 미래 방향성은 아래와 같습니다
                </p>

                <div className="p9-stream-row">
                    <div className="p9-stream-col">
                        <h4 className="p9-stream-title">Mission</h4>
                        {reportData?.visionMissionValue?.missionTop4?.slice(0, 4).map((item, idx) => (
                            <div className="p9-stream-item" key={idx}>{item.content}</div>
                        )) || Array.from({ length: 4 }, (_, i) => <div className="p9-stream-item" key={i}></div>)}
                    </div>
                    <div className="p9-stream-col">
                        <h4 className="p9-stream-title">Vision</h4>
                        {reportData?.visionMissionValue?.visionTop4?.slice(0, 4).map((item, idx) => (
                            <div className="p9-stream-item" key={idx}>{item.content}</div>
                        )) || Array.from({ length: 4 }, (_, i) => <div className="p9-stream-item" key={i}></div>)}
                    </div>
                    <div className="p9-stream-col">
                        <h4 className="p9-stream-title">Value</h4>
                        {reportData?.visionMissionValue?.valueTop4?.slice(0, 4).map((item, idx) => (
                            <div className="p9-stream-item" key={idx}>{item.content}</div>
                        )) || Array.from({ length: 4 }, (_, i) => <div className="p9-stream-item" key={i}></div>)}
                    </div>
                </div>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">9</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 10 - Performance Stream: Strategic Goals */}
            <div className="report-page report-page-10">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    III. Performance Stream (전략 목표에 대한 인식)
                </div>

                <div className="p4-desc-box">
                    <p className="p4-desc-text">
                        Strategic Identity는 조직을 둘러싼 위협적인 '외부 변화'와 이를 극복하기 위한 '내부 한계점'에 대한 구성원들의 생생한 목소리를 담고 있습니다. 우리 조직의 존재 이유와 목표를 재정의하고, 구성원들이 도출한 새로운 미션, 비전, 핵심가치를 통해 위기를 돌파할 실질적인 미래 청사진을 제안합니다.
                    </p>
                </div>

                <div className="p10-divider"></div>

                <p className="p10-result-text">
                    구성원들이 제시한 전략목표의 주요 키워드는 다음과 같습니다.
                </p>

                <div className="p10-keyword-row">
                    {reportData?.flowCanvasGoals?.keywords?.slice(0, 4).map((keyword, idx) => (
                        <div className="p10-keyword-box" key={idx}><span className="p10-keyword-text"># {keyword}</span></div>
                    )) || (
                        <>
                            <div className="p10-keyword-box"><span className="p10-keyword-text"># -</span></div>
                            <div className="p10-keyword-box"><span className="p10-keyword-text"># -</span></div>
                            <div className="p10-keyword-box"><span className="p10-keyword-text"># -</span></div>
                            <div className="p10-keyword-box"><span className="p10-keyword-text"># -</span></div>
                        </>
                    )}
                </div>

                <div className="p10-info-bar">
                    <span className="p10-info-text">본 과정에서 구성원들은 비전달성을 위한 전략목표</span>
                    <span className="p10-count-badge">{reportData?.flowCanvasGoals?.goals?.length || 0}개</span>
                    <span className="p10-info-text">를 제시했습니다.</span>
                </div>

                <div className="p10-title-row">
                    <div className="p10-title-left">
                        <span className="p10-title-kr">전략 목표</span>
                        <span className="p10-title-en">(Strategic Goal)</span>
                    </div>
                    <span className="p10-title-note">(중복 포함)</span>
                </div>

                <table className="p10-table">
                    <colgroup>
                        <col style={{ width: '76px' }} />
                        <col style={{ width: '226px' }} />
                        <col style={{ width: '578px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>전략목표</th>
                            <th>주요 내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const goals = reportData?.flowCanvasGoals?.goals || [];
                            const has11P = goals.length >= 21;
                            const displayGoals = goals.slice(0, 20);
                            const rows = displayGoals.map((goal, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{truncateText(goal.title, 20)}</td>
                                    <td>{truncateText(goal.description || "", 50)}</td>
                                </tr>
                            ));
                            // 50개 이상인데 11P가 없을 때만 ... 표시
                            if (goals.length >= 50 && !has11P) {
                                rows.push(
                                    <tr key="ellipsis">
                                        <td>...</td>
                                        <td>...</td>
                                        <td>...</td>
                                    </tr>
                                );
                            }
                            return rows.length > 0 ? rows : Array.from({ length: 20 }, (_, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">10</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 11 - Performance Stream: Strategic Goals (continued) - 21개 이상일 때만 표시 */}
            {(reportData?.flowCanvasGoals?.goals?.length || 0) >= 21 && (
            <div className="report-page report-page-11">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    III. Performance Stream (전략 목표에 대한 인식)
                </div>

                <div className="p10-title-row p11-title-row">
                    <div className="p10-title-left">
                        <span className="p10-title-kr">전략 목표</span>
                        <span className="p10-title-en">(Strategic Goal)</span>
                    </div>
                    <span className="p10-title-note">(중복 포함)</span>
                </div>

                <table className="p10-table">
                    <colgroup>
                        <col style={{ width: '76px' }} />
                        <col style={{ width: '226px' }} />
                        <col style={{ width: '578px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>전략목표</th>
                            <th>주요 내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const goals = reportData?.flowCanvasGoals?.goals || [];
                            const page2Goals = goals.slice(20, Math.min(49, goals.length));
                            const rows = page2Goals.map((goal, i) => (
                                <tr key={i}>
                                    <td>{i + 21}</td>
                                    <td>{truncateText(goal.title, 20)}</td>
                                    <td>{truncateText(goal.description || "", 50)}</td>
                                </tr>
                            ));
                            if (goals.length >= 50) {
                                rows.push(
                                    <tr key="ellipsis">
                                        <td>...</td>
                                        <td>...</td>
                                        <td>...</td>
                                    </tr>
                                );
                            }
                            return rows;
                        })()}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">11</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>
            )}

            {/* Page 12 - Performance Stream: Tactical KPI */}
            <div className="report-page report-page-12">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    III. Performance Stream (전략 목표에 대한 인식)
                </div>

                <div className="p12-content-box">
                    <div className="p12-title-line">
                        <span className="p12-kpi-title">전술적 성과지표 (Tactical KPI)</span>
                        <div className="p12-badges">
                            <span className="p12-badge-fruit">열매(Fruit)</span>
                            <span className="p12-badge-soil">토양(Soil)</span>
                        </div>
                    </div>
                    <p className="p12-desc-text">
                        전술적 성과지표(Tactical Key Performance Index)는 조직이 설정한 단기 전략 목표가 계획대로 달성되었는지를 확인하는 '결과 중심'의 정량 지표입니다. 당면한 목표의 달성 여부를 객관적으로 측정하여, 실질적 성과창출 능력을 입증합니다. (Performance 관점)
                    </p>
                </div>

                <div className="p10-info-bar p12-info-bar">
                    <span className="p10-info-text">구성원들은 전략목표 달성을 위한 전술적 성과지표</span>
                    <span className="p10-count-badge">{reportData?.tacticals?.length || 0} 개</span>
                    <span className="p10-info-text">를 제시했습니다.</span>
                </div>

                <div className="p10-title-row p12-title-row">
                    <span className="p10-title-kr">전술적 성과지표 제시</span>
                    <span className="p10-title-note">(중복 포함)</span>
                </div>

                <table className="p12-table">
                    <colgroup>
                        <col style={{ width: '245px' }} />
                        <col style={{ width: '195px' }} />
                        <col style={{ width: '245px' }} />
                        <col style={{ width: '195px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>전술적 성과지표</th>
                            <th>목표</th>
                            <th>전술적 성과지표</th>
                            <th>목표</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const tacticals = reportData?.tacticals || [];
                            const itemsOnPage = Math.min(44, tacticals.length);
                            const maxRows = Math.ceil(itemsOnPage / 2);
                            const rows = [];
                            for (let i = 0; i < maxRows; i++) {
                                const leftIdx = i * 2;
                                const rightIdx = i * 2 + 1;
                                rows.push(
                                    <tr key={i}>
                                        <td>{truncateText(tacticals[leftIdx]?.metric, 20) || ""}</td>
                                        <td className="p12-td-center">{truncateText(tacticals[leftIdx]?.goal, 15) || ""}</td>
                                        <td>{truncateText(tacticals[rightIdx]?.metric, 20) || ""}</td>
                                        <td className="p12-td-center">{truncateText(tacticals[rightIdx]?.goal, 15) || ""}</td>
                                    </tr>
                                );
                            }
                            return rows;
                        })()}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">{getPageNumber(12)}</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 13 - Performance Stream: Tactical KPI (continued) - 45개 이상일 때만 표시 */}
            {(reportData?.tacticals?.length || 0) >= 45 && (
            <div className="report-page report-page-13">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    III. Performance Stream (전략 목표에 대한 인식)
                </div>

                <div className="p10-title-row p11-title-row">
                    <span className="p10-title-kr">전술적 성과지표 제시</span>
                    <span className="p10-title-note">(중복 포함)</span>
                </div>

                <table className="p12-table">
                    <colgroup>
                        <col style={{ width: '245px' }} />
                        <col style={{ width: '195px' }} />
                        <col style={{ width: '245px' }} />
                        <col style={{ width: '195px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>전술적 성과지표</th>
                            <th>목표</th>
                            <th>전술적 성과지표</th>
                            <th>목표</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const tacticals = reportData?.tacticals || [];
                            const startIdx = 44;
                            const remainingItems = Math.min(44, tacticals.length - 44);
                            const maxRows = Math.ceil(remainingItems / 2);
                            const rows = [];
                            for (let i = 0; i < maxRows; i++) {
                                const leftIdx = startIdx + i * 2;
                                const rightIdx = startIdx + i * 2 + 1;
                                rows.push(
                                    <tr key={i}>
                                        <td>{truncateText(tacticals[leftIdx]?.metric, 20) || ""}</td>
                                        <td className="p12-td-center">{truncateText(tacticals[leftIdx]?.goal, 15) || ""}</td>
                                        <td>{truncateText(tacticals[rightIdx]?.metric, 20) || ""}</td>
                                        <td className="p12-td-center">{truncateText(tacticals[rightIdx]?.goal, 15) || ""}</td>
                                    </tr>
                                );
                            }
                            // 88개 이상이면 ... 표시 (44 + 44)
                            if (tacticals.length > 88) {
                                rows.push(
                                    <tr key="ellipsis">
                                        <td>...</td>
                                        <td className="p12-td-center">...</td>
                                        <td>...</td>
                                        <td className="p12-td-center">...</td>
                                    </tr>
                                );
                            }
                            return rows;
                        })()}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">{getPageNumber(13)}</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>
            )}

            {/* Page 14 - Performance Stream: Strategic KAI */}
            <div className="report-page report-page-14">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    III. Performance Stream (전략 목표에 대한 인식)
                </div>

                <div className="p12-content-box p14-content-box">
                    <div className="p12-title-line">
                        <span className="p12-kpi-title">전략적 행동지표 (Strategic KAI)</span>
                        <div className="p12-badges">
                            <span className="p12-badge-soil">열매(Fruit)</span>
                            <span className="p12-badge-fruit">토양(Soil)</span>
                        </div>
                    </div>
                    <p className="p12-desc-text">
                        전략적 행동지표(Strategic Key Action Index)는 단순한 목표 달성을 넘어, 성과를 지속적으로 낼 수 있는 '반복 가능한 구조'와 '근본적인 체질'을 만드는 행동 중심의 지표입니다. 지속가능한 성과창출 조직을 만들기 위한 전략적 행동을 측정하여, 조직의 DNA를 변화시킵니다.(Fundamental관점)
                    </p>
                </div>

                <div className="p10-info-bar p12-info-bar">
                    <span className="p10-info-text">구성원들은 전략목표 달성을 위한 전략적 행동지표</span>
                    <span className="p10-count-badge">{reportData?.strategicActivities?.length || 0} 개</span>
                    <span className="p10-info-text">를 제시했습니다.</span>
                </div>

                <div className="p10-title-row p12-title-row">
                    <span className="p10-title-kr">전략적 행동지표 제시</span>
                    <span className="p10-title-note">(중복 포함)</span>
                </div>

                <table className="p12-table">
                    <colgroup>
                        <col style={{ width: '245px' }} />
                        <col style={{ width: '195px' }} />
                        <col style={{ width: '245px' }} />
                        <col style={{ width: '195px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>전략적 행동지표</th>
                            <th>내재화 기준</th>
                            <th>전략적 행동지표</th>
                            <th>내재화 기준</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const strategicItems = reportData?.strategicActivities || [];
                            const totalPairs = strategicItems.length;
                            const itemsOnPage = Math.min(44, totalPairs);
                            const maxRows = Math.ceil(itemsOnPage / 2);
                            const rows = [];
                            for (let i = 0; i < maxRows; i++) {
                                const leftIdx = i * 2;
                                const rightIdx = i * 2 + 1;
                                rows.push(
                                    <tr key={i}>
                                        <td>{truncateText(strategicItems[leftIdx]?.activityMetric, 20) || ""}</td>
                                        <td className="p12-td-center">{truncateText(strategicItems[leftIdx]?.interCriteria, 15) || ""}</td>
                                        <td>{truncateText(strategicItems[rightIdx]?.activityMetric, 20) || ""}</td>
                                        <td className="p12-td-center">{truncateText(strategicItems[rightIdx]?.interCriteria, 15) || ""}</td>
                                    </tr>
                                );
                            }
                            return rows;
                        })()}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">{getPageNumber(14)}</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 15 - Performance Stream: Strategic KAI (continued) - 45개 이상일 때만 표시 */}
            {(reportData?.strategicActivities?.length || 0) >= 45 && (
            <div className="report-page report-page-15">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    III. Performance Stream (전략 목표에 대한 인식)
                </div>

                <div className="p10-title-row p11-title-row">
                    <span className="p10-title-kr">전략적 행동지표 제시</span>
                    <span className="p10-title-note">(중복 포함)</span>
                </div>

                <table className="p12-table">
                    <colgroup>
                        <col style={{ width: '245px' }} />
                        <col style={{ width: '195px' }} />
                        <col style={{ width: '245px' }} />
                        <col style={{ width: '195px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>전략적 행동지표</th>
                            <th>내재화 기준</th>
                            <th>전략적 행동지표</th>
                            <th>내재화 기준</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const strategicItems = reportData?.strategicActivities || [];
                            const totalPairs = strategicItems.length;
                            const startIdx = 44;
                            const remainingItems = Math.min(44, totalPairs - 44);
                            const maxRows = Math.ceil(remainingItems / 2);
                            const rows = [];
                            for (let i = 0; i < maxRows; i++) {
                                const leftIdx = startIdx + i * 2;
                                const rightIdx = startIdx + i * 2 + 1;
                                rows.push(
                                    <tr key={i}>
                                        <td>{truncateText(strategicItems[leftIdx]?.activityMetric, 20) || ""}</td>
                                        <td className="p12-td-center">{truncateText(strategicItems[leftIdx]?.interCriteria, 15) || ""}</td>
                                        <td>{truncateText(strategicItems[rightIdx]?.activityMetric, 20) || ""}</td>
                                        <td className="p12-td-center">{truncateText(strategicItems[rightIdx]?.interCriteria, 15) || ""}</td>
                                    </tr>
                                );
                            }
                            // 88개 이상이면 ... 표시 (44 + 44)
                            if (totalPairs > 88) {
                                rows.push(
                                    <tr key="ellipsis">
                                        <td>...</td>
                                        <td className="p12-td-center">...</td>
                                        <td>...</td>
                                        <td className="p12-td-center">...</td>
                                    </tr>
                                );
                            }
                            return rows;
                        })()}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">{getPageNumber(15)}</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>
            )}

            {/* Page 16 - Quick & Build Win Contents */}
            <div className="report-page report-page-16">
                <h2 className="p3-title">CONTENTS</h2>

                <div className="p3-section-box" style={{ marginTop: '128px' }}>
                    <p className="p3-section-text">
                        I. Performance Profile (성과 인식 프로파일)
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-section-box">
                    <p className="p3-section-text">
                        II. Strategic Identity (미래 방향성에 대한 인식)
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-section-box">
                    <p className="p3-section-text">
                        III. Performance Stream (전략 목표에 대한 인식)
                    </p>
                </div>

                <div className="p3-divider"></div>

                <div className="p3-main-box">
                    <h3 className="p3-main-heading">
                        IV. Quick &amp; Build Win(실행과제 제안과 평가)
                    </h3>
                    <p className="p3-main-quote">
                        " 그 방향이 성과로 나타나려면,
                        <br />
                        무엇을 목표와기준으로 설정해야 하는가? "
                    </p>
                    <p className="p3-main-desc">
                        비전을 실행 가능한 전략목표와 성과 기준으로 전환합니다.
                    </p>
                </div>

                <img src={polygon3Image} alt="" className="p3-polygon3" />
                <img src={polygon2Image} alt="" className="p3-polygon2" />
            </div>

            {/* Page 17 - Quick Win */}
            <div className="report-page report-page-20">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    IV. Quick &amp; Build Win(실행과제 제안과 평가)
                </div>

                <div className="p20-desc-box">
                    <h3 className="p20-title">전술적 실행과제 (Quick Win)</h3>
                    <p className="p20-desc-text">
                        전술적 실행과제(Quick Win)는 즉시 실행하여 가시적인 성과를 창출할 수 있는 '단기적 실행과제'입니다. 빠르게 축적된 '작은 성공(Small Success)'의 경험을 통해 조직에 변화의 모멘텀을 만들고, 단기적인 전술적 성과지표(Tactical KPI) 달성을 견인할 수
                        <br />
                        있습니다.
                    </p>
                </div>

                <div className="p10-info-bar p20-info-bar">
                    <span className="p10-info-text">구성원들은 성과체질 개선을 위한 전술적 실행과제</span>
                    <span className="p10-count-badge">{reportData?.quickWinCanvasList?.length || 0} 개</span>
                    <span className="p10-info-text">를 제시했습니다.</span>
                </div>

                <div className="p20-subtitle-row">
                    <span className="p20-subtitle-left">[별첨 1] Quick Win Canvas(전술적 실행과제) 모음집</span>
                    <span className="p20-subtitle-right">* 점수와 순위는 참여한 교육생들이 평가한 결과입니다</span>
                </div>

                <table className="p20-table">
                    <colgroup>
                        <col style={{ width: '245px' }} />
                        <col style={{ width: '435px' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '100px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>과제명</th>
                            <th>주요내용</th>
                            <th>점수</th>
                            <th>순위</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const list = reportData?.quickWinCanvasList || [];
                            const displayList = list.slice(0, Math.min(22, list.length));
                            const rows = displayList.map((item, i) => (
                                <tr key={i}>
                                    <td>{truncateText(item.taskName, 20) || "-"}</td>
                                    <td>{truncateText(item.taskDescription, 40) || "-"}</td>
                                    <td className="p20-td-center">{item.totalScore || 0}</td>
                                    <td className="p20-td-center">{i + 1}</td>
                                </tr>
                            ));
                            if (list.length >= 23) {
                                rows.push(
                                    <tr key="ellipsis">
                                        <td>...</td>
                                        <td>...</td>
                                        <td className="p20-td-center">...</td>
                                        <td className="p20-td-center">...</td>
                                    </tr>
                                );
                            }
                            return rows.length > 0 ? rows : Array.from({ length: 22 }, (_, i) => (
                                <tr key={i}>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">{getPageNumber(17)}</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 18 - Build Win */}
            <div className="report-page report-page-20">
                <div className="p4-topbar">
                    {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
                    <span className="p4-confidential" style={{ color: '#8990A3' }}>Confidential &amp; Proprietary</span>
                </div>

                <div className="p4-section-header" style={{ backgroundImage: `linear-gradient(rgba(43,74,193,0.6), rgba(43,74,193,0.4)), url("${image7Bg}")` }}>
                    IV. Quick &amp; Build Win(실행과제 제안과 평가)
                </div>

                <div className="p20-desc-box">
                    <h3 className="p20-title">전략적 실행과제 (Build Win)</h3>
                    <p className="p20-desc-text">
                        전략적 실행과제(Build Win)는 조직의 미래 경쟁력을 확보하기 위해 긴 호흡으로 추진해야 할 '중장기 혁신 과제'입니다.
                        <br />
                        성과창출 체질과 토양을 만드는 '견고한 구조'를 구축하여,
                        <br />
                        지속 가능한 성장의 토대를 마련합니다.
                    </p>
                </div>

                <div className="p10-info-bar p20-info-bar">
                    <span className="p10-info-text">구성원들은 성과체질 개선을 위한 전략적 실행과제</span>
                    <span className="p10-count-badge">{reportData?.buildWinCanvasList?.length || 0} 개</span>
                    <span className="p10-info-text">를 제시했습니다.</span>
                </div>

                <div className="p20-subtitle-row">
                    <span className="p20-subtitle-left">[별첨 2] Build Win Canvas(전략적 실행과제) 모음집</span>
                    <span className="p20-subtitle-right">* 점수와 순위는 참여한 교육생들이 평가한 결과입니다</span>
                </div>

                <table className="p20-table">
                    <colgroup>
                        <col style={{ width: '245px' }} />
                        <col style={{ width: '435px' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '100px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>과제명</th>
                            <th>주요내용</th>
                            <th>점수</th>
                            <th>순위</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const list = reportData?.buildWinCanvasList || [];
                            const displayList = list.slice(0, Math.min(22, list.length));
                            const rows = displayList.map((item, i) => (
                                <tr key={i}>
                                    <td>{truncateText(item.taskName, 20) || "-"}</td>
                                    <td>{truncateText(item.taskDescription, 40) || "-"}</td>
                                    <td className="p20-td-center">{item.totalScore || 0}</td>
                                    <td className="p20-td-center">{i + 1}</td>
                                </tr>
                            ));
                            if (list.length >= 23) {
                                rows.push(
                                    <tr key="ellipsis">
                                        <td>...</td>
                                        <td>...</td>
                                        <td className="p20-td-center">...</td>
                                        <td className="p20-td-center">...</td>
                                    </tr>
                                );
                            }
                            return rows.length > 0 ? rows : Array.from({ length: 22 }, (_, i) => (
                                <tr key={i}>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">{getPageNumber(18)}</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 19 - Back Cover */}
            <div className="report-page report-page-22">
                <img src={frame27Bg} alt="" className="p22-bg" />
                <img src={polygon3Image} alt="" className="p22-polygon3" />

                <span className="p22-word p22-we">WE</span>
                <span className="p22-word p22-build">BUILD</span>
                <span className="p22-word p22-win">WIN</span>
                <span className="p22-word p22-together">TOGETHER</span>

                <p className="p22-quote">" 성과를 설계하는 전략적 파트너 "</p>

                <div className="p22-divider"></div>

                <img src={process.env.PUBLIC_URL + "/q_logo.png"} alt="QUANTUM EDU SOLUTION" className="p22-logo" />

                <div className="p22-contact-card">
                    <p className="p22-director">Director :  김영천 Ph.D.</p>
                    <p className="p22-contact">yckim@qtedu.kr &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 02-6953-9788</p>
                </div>

                <img src={polygon2Image} alt="" className="p22-polygon2" />

                <p className="p22-confidential">CONFIDENTIAL &amp; PROPRIETARY</p>
                <p className="p22-notice">
                    This document contains proprietary information and intellectual property of Quantum Edu Solution.
                    <br />
                    It is submitted to the client on a confidential basis and may not be reproduced, shared,
                    <br />
                    or distributed without prior written permission.
                </p>
                <p className="p22-copyright">Copyright © 2026 Quantum Edu Solution. All Rights Reserved.</p>
            </div>
        </div>
    );
});

export default ReportScreen;
