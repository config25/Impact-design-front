import "./ReportScreen.css";
import coverImage from "../resource/report/cover01.png";
import polygonImage from "../resource/report/Polygon 1.png";
import logoImage from "../resource/report/logo01.png";
import shinhanLogo from "../resource/report/신한은행.png";
import image7Bg from "../resource/report/Image 7.png";
import polygon2Image from "../resource/report/Polygon 2.png";
import unionImage from "../resource/report/union.png";

const ReportScreen = ({ onNavigate }) => {
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
        <div className="report-container">
            {/* Page 1 - Cover */}
            <div className="report-page report-page-cover">
                <img src={coverImage} alt="THE IMPACT REPORT" className="cover-image" />
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
                            "우리는 눈앞의 성과(Tactical KPI)와 미래를 위한 체질(Strategic KAI)을 동시에 관리하여,
                            <br />
                            지속가능한 성과를 만드는 구조(Structure)를 설계합니다."
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

                <img src={polygon2Image} alt="" className="p3-polygon2" />
            </div>

            {/* Page 4 - Performance Profile */}
            <div className="report-page report-page-4">
                {/* Top bar */}
                <div className="p4-topbar">
                    <img src={shinhanLogo} alt="신한은행" className="p4-bank-logo" />
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

                {/* Result line */}
                <div className="p4-result-line">
                    <span className="p4-result-text">귀사 구성원들이 바라보는 조직의 성과창출 스타일은</span>
                    <span className="p4-result-badge">Burnout Runner</span>
                    <span className="p4-result-text">입니다.</span>
                </div>

                {/* Chart & Table box */}
                <div className="p4-chart-box">
                    {/* Matrix chart */}
                    <div className="p4-matrix-area">
                        <div className="p4-y-label">
                            성과 창출력 (성과목표, 실행력)
                        </div>
                        <div className="p4-chart-inner">
                            <div className="p4-axes-wrap">
                                <span className="p4-y-high">High</span>
                                <div className="p4-quad-grid">
                                    {/* TL - Active */}
                                    <div className="p4-quad p4-quad-active">
                                        <div className="p4-score-pill">
                                            <span className="p4-score-num">3.75</span>
                                            <span className="p4-score-sep">|</span>
                                            <span className="p4-score-num">2.50</span>
                                        </div>
                                        <strong className="p4-quad-name-w">Burnout Runner</strong>
                                        <span className="p4-quad-sub-w">(지쳐가는 러너)</span>
                                    </div>
                                    {/* TR */}
                                    <div className="p4-quad p4-quad-inactive">
                                        <strong className="p4-quad-name-g">Impact Player</strong>
                                        <span className="p4-quad-sub-g">(지속가능한 리더)</span>
                                    </div>
                                    {/* BL */}
                                    <div className="p4-quad p4-quad-inactive">
                                        <strong className="p4-quad-name-g">Survival Walker</strong>
                                        <span className="p4-quad-sub-g">(생존형 보행자)</span>
                                    </div>
                                    {/* BR */}
                                    <div className="p4-quad p4-quad-inactive">
                                        <strong className="p4-quad-name-g">Idle Dreamer</strong>
                                        <span className="p4-quad-sub-g">(잠자는 몽상가)</span>
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
                                <td className="p4-td-score">3.5</td>
                                <td rowSpan={2} className="p4-td-avg">3.75</td>
                            </tr>
                            <tr>
                                <td className="p4-td-item">실행력</td>
                                <td className="p4-td-score">4.0</td>
                            </tr>
                            <tr>
                                <td rowSpan={2} className="p4-td-category p4-td-category-last">
                                    미래 경쟁력<br />(FC, Future Competitive<br />ness)
                                </td>
                                <td rowSpan={2} className="p4-td-factor p4-td-factor-last">
                                    미래 성과 창출에 대한 인식
                                </td>
                                <td className="p4-td-item">아이덴티티</td>
                                <td className="p4-td-score">2.5</td>
                                <td rowSpan={2} className="p4-td-avg">2.50</td>
                            </tr>
                            <tr>
                                <td className="p4-td-item p4-td-item-last">시스템</td>
                                <td className="p4-td-score p4-td-score-last">2.5</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>

                {/* Type header */}
                <div className="p4-type-header">
                    <div className="p4-type-title-group">
                        <span className="p4-type-name">Burnout Runner</span>
                        <span className="p4-type-sep">&nbsp;|&nbsp;</span>
                        <span className="p4-type-korean">지쳐가는 러너</span>
                    </div>
                    <div className="p4-type-pill">
                        높은 성과 '인식'과 취약한 '기반'의 딜레마
                    </div>
                </div>

                {/* Analysis box */}
                <div className="p4-analysis-box">
                    {/* 진단 row */}
                    <div className="p4-analysis-row">
                        <div className="p4-label p4-label-diag">진단</div>
                        <div className="p4-analysis-content">
                            <p className="p4-analysis-text">
                                구성원들은 현재 조직의 성과 창출 수준을 매우 높게 '인식(Perception)'하고 있습니다. 그러나 이는 탄탄한 시스템이나 명확한 목표 의식에 기반한 것이 아니라, 단순히 "우리는 열심히 하고 있다"는 주관적 자신감일 가능성이 큽니다. 지속가능한 성과 창출 시스템이 빈약하다고 판단하고 있기 때문에, 작은 환경 변화에도 그 자신감이 쉽게 무너질 수 있는 구조적 취약성을 안고 있습니다.
                            </p>
                        </div>
                    </div>
                    {/* 솔루션 row */}
                    <div className="p4-analysis-row">
                        <div className="p4-label p4-label-sol">솔루션</div>
                        <div className="p4-analysis-content">
                            <p className="p4-analysis-text">
                                <span className="p4-analysis-bold">
                                    지금 필요한 것은 막연한 '열심'이 아니라, 성공을 담아낼 그릇인 '시스템'입니다.
                                </span>
                                <br />
                                <span className="p4-analysis-span">
                                    첫째, 구성원들이 동일한 곳을 바라볼 수 있도록 명확한 목표(Clear Goal)를 재설정하여 방향성을 정렬(Alignment)해야 합니다.
                                    둘째, 개인의 암묵지에 의존하던 업무 방식을 프로세스로 자산화하여, 어떤 환경 변화에도 흔들리지 않는 '이기는 구조'를 구축하십시오.
                                </span>
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

                <img src={polygon2Image} alt="" className="p3-polygon2" />
            </div>

            {/* Page 6 - Strategic Identity: External Threats */}
            <div className="report-page report-page-6">
                <div className="p4-topbar">
                    <img src={shinhanLogo} alt="신한은행" className="p4-bank-logo" />
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
                        <div className="p6-threat-item">
                            <p className="p6-threat-text">1. 교육생이 작성한 외부 위협신호를 취합하여 AI가 3개로 요약해서 제시</p>
                        </div>
                        <div className="p6-threat-item">
                            <p className="p6-threat-text">2. 교육생이 작성한 외부 위협신호를 취합하여 AI가 3개로 요약해서 제시</p>
                        </div>
                        <div className="p6-threat-item">
                            <p className="p6-threat-text">3. 교육생이 작성한 외부 위협신호를 취합하여 AI가 3개로 요약해서 제시  교육생이 작성한 외부 위협신호를 취합하여 AI가 3개로 요약해서 제시 한 줄이 넘어갈 경우</p>
                        </div>
                    </div>
                </div>

                <div className="p6-voice-section">
                    <h3 className="p6-voice-title">Voice of Employee</h3>
                    <div className="p6-voice-bubbles">
                        <div className="p6-voice-bubble" style={{ width: '709px' }}>
                            <p className="p6-voice-text">"경쟁사들은 이미 AI 기반으로 단가를 낮추고 들어오는데, 우리는 여전히 맨파워로만 싸우려니 버겁습니다."</p>
                        </div>
                        <div className="p6-voice-bubble" style={{ width: '852px' }}>
                            <p className="p6-voice-text">"고객들은 더 이상 우리 브랜드만 보고 찾아오지 않습니다. '가성비' 아니면 '확실한 차별점'을 요구하는데 우리는 둘 다 애매합니다."</p>
                        </div>
                        <div className="p6-voice-bubble" style={{ width: '673px' }}>
                            <p className="p6-voice-text">"업계 판도가 바뀌고 있다는 게 느껴집니다. 지금의 성공 방식이 내년에도 통할지 솔직히 두렵습니다."</p>
                        </div>
                        <div className="p6-voice-bubble" style={{ width: '709px' }}>
                            <p className="p6-voice-text">"경쟁사들은 이미 AI 기반으로 단가를 낮추고 들어오는데, 우리는 여전히 맨파워로만 싸우려니 버겁습니다."</p>
                        </div>
                    </div>
                </div>

                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '189px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '388px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '588px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '787px' }} />

                <div className="p6-keywords-row">
                    <div className="p6-keyword-box"><span className="p6-keyword-text"># 주요 키워드</span></div>
                    <div className="p6-keyword-box"><span className="p6-keyword-text"># 주요 키워드</span></div>
                    <div className="p6-keyword-box"><span className="p6-keyword-text"># 주요 키워드</span></div>
                    <div className="p6-keyword-box"><span className="p6-keyword-text"># 주요 키워드</span></div>
                </div>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">9</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 7 - Strategic Identity: Internal Limits */}
            <div className="report-page report-page-7">
                <div className="p4-topbar">
                    <img src={shinhanLogo} alt="신한은행" className="p4-bank-logo" />
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
                        <div className="p6-threat-item">
                            <p className="p6-threat-text">1. 교육생이 작성한 외부 위협신호를 취합하여 AI가 3개로 요약해서 제시</p>
                        </div>
                        <div className="p6-threat-item">
                            <p className="p6-threat-text">2. 교육생이 작성한 외부 위협신호를 취합하여 AI가 3개로 요약해서 제시</p>
                        </div>
                        <div className="p6-threat-item">
                            <p className="p6-threat-text">3. 교육생이 작성한 외부 위협신호를 취합하여 AI가 3개로 요약해서 제시  교육생이 작성한 외부 위협신호를 취합하여 AI가 3개로 요약해서 제시 한 줄이 넘어갈 경우</p>
                        </div>
                    </div>
                </div>

                <div className="p6-voice-section">
                    <h3 className="p6-voice-title">Voice of Employee</h3>
                    <div className="p6-voice-bubbles">
                        <div className="p6-voice-bubble" style={{ width: '740px' }}>
                            <p className="p6-voice-text">"옆 팀이 무슨 프로젝트를 하는지 전혀 모릅니다. 나중에 보면 똑같은 일을 따로 하고 있을 때가 많습니다."</p>
                        </div>
                        <div className="p6-voice-bubble" style={{ width: '830px' }}>
                            <p className="p6-voice-text">"시스템으로 10분이면 할 일을, 엑셀 펴놓고 3시간씩 하고 있습니다. '삽질'한다는 느낌을 지울 수 없습니다."</p>
                        </div>
                        <div className="p6-voice-bubble" style={{ width: '760px' }}>
                            <p className="p6-voice-text">"열심히는 하는데, '왜' 해야 하는지 모르고 달릴 때가 많습니다. 그냥 위에서 시키니까 하는 느낌입니다."</p>
                        </div>
                        <div className="p6-voice-bubble" style={{ width: '200px' }}>
                            <p className="p6-voice-text">"… … … …"</p>
                        </div>
                    </div>
                </div>

                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '189px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '388px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '588px' }} />
                <img src={unionImage} alt="" className="p6-union-icon" style={{ left: '787px' }} />

                <div className="p6-keywords-row">
                    <div className="p6-keyword-box"><span className="p6-keyword-text"># 주요 키워드</span></div>
                    <div className="p6-keyword-box"><span className="p6-keyword-text"># 주요 키워드</span></div>
                    <div className="p6-keyword-box"><span className="p6-keyword-text"># 주요 키워드</span></div>
                    <div className="p6-keyword-box"><span className="p6-keyword-text"># 주요 키워드</span></div>
                </div>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">10</span>
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

                <img src={polygon2Image} alt="" className="p3-polygon2" />
            </div>

            {/* Page 9 - Performance Stream: New Future */}
            <div className="report-page report-page-9">
                <div className="p4-topbar">
                    <img src={shinhanLogo} alt="신한은행" className="p4-bank-logo" />
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
                                <p className="p9-col-text">(재정의된 존재 이유)<br />우리가 선택한 존재 이유</p>
                            </div>
                        </div>
                        <div className="p9-col-outer">
                            <div className="p9-col-header">
                                <span className="p9-new-badge">NEW</span>
                                <span className="p9-col-label">비전 (Vision)</span>
                            </div>
                            <div className="p9-col-content">
                                <p className="p9-col-text">(재정의된 존재 이유)<br />우리가 선택한 존재 이유</p>
                            </div>
                        </div>
                        <div className="p9-col-outer">
                            <div className="p9-col-header">
                                <span className="p9-new-badge">NEW</span>
                                <span className="p9-col-label">핵심가치 (Value)</span>
                            </div>
                            <div className="p9-col-content">
                                <p className="p9-col-text">(재정의된 존재 이유)<br />우리가 선택한 존재 이유</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p9-triangle" style={{ top: '733px' }}></div>
                <div className="p9-triangle" style={{ top: '749px' }}></div>

                <p className="p9-result-text p9-result-text2">
                    귀사 구성원들이 제안한 새로운 미래 방향성은 아래와 같습니다
                </p>

                <div className="p9-stream-row">
                    <div className="p9-stream-col">
                        <h4 className="p9-stream-title">Mission</h4>
                        <div className="p9-stream-item"></div>
                        <div className="p9-stream-item"></div>
                        <div className="p9-stream-item"></div>
                        <div className="p9-stream-item"></div>
                    </div>
                    <div className="p9-stream-col">
                        <h4 className="p9-stream-title">Vision</h4>
                        <div className="p9-stream-item"></div>
                        <div className="p9-stream-item"></div>
                        <div className="p9-stream-item"></div>
                        <div className="p9-stream-item"></div>
                    </div>
                    <div className="p9-stream-col">
                        <h4 className="p9-stream-title">Value</h4>
                        <div className="p9-stream-item"></div>
                        <div className="p9-stream-item"></div>
                        <div className="p9-stream-item"></div>
                        <div className="p9-stream-item"></div>
                    </div>
                </div>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">12</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 10 - Performance Stream: Strategic Goals */}
            <div className="report-page report-page-10">
                <div className="p4-topbar">
                    <img src={shinhanLogo} alt="신한은행" className="p4-bank-logo" />
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
                    <div className="p10-keyword-box"><span className="p10-keyword-text"># 주요 키워드</span></div>
                    <div className="p10-keyword-box"><span className="p10-keyword-text"># 주요 키워드</span></div>
                    <div className="p10-keyword-box"><span className="p10-keyword-text"># 주요 키워드</span></div>
                    <div className="p10-keyword-box"><span className="p10-keyword-text"># 주요 키워드</span></div>
                </div>

                <div className="p10-info-bar">
                    <span className="p10-info-text">본 과정에서 구성원들은 비전달성을 위한 전략목표</span>
                    <span className="p10-count-badge">25개</span>
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
                        {Array.from({ length: 20 }, (_, i) => (
                            <tr key={i}>
                                <td>1</td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">13</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 11 - Performance Stream: Strategic Goals (continued) */}
            <div className="report-page report-page-11">
                <div className="p4-topbar">
                    <img src={shinhanLogo} alt="신한은행" className="p4-bank-logo" />
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
                        {Array.from({ length: 29 }, (_, i) => (
                            <tr key={i}>
                                <td>{i + 22}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">14</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 12 - Performance Stream: Tactical KPI */}
            <div className="report-page report-page-12">
                <div className="p4-topbar">
                    <img src={shinhanLogo} alt="신한은행" className="p4-bank-logo" />
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
                    <span className="p10-count-badge">78 개</span>
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
                        <tr>
                            <td>프리미엄 판매 비중</td>
                            <td className="p12-td-center">8% 향상</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {Array.from({ length: 22 }, (_, i) => (
                            <tr key={i}>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">15</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 13 - Performance Stream: Tactical KPI (continued) */}
            <div className="report-page report-page-13">
                <div className="p4-topbar">
                    <img src={shinhanLogo} alt="신한은행" className="p4-bank-logo" />
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
                        <tr>
                            <td>프리미엄 판매 비중</td>
                            <td className="p12-td-center">8% 향상</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {Array.from({ length: 28 }, (_, i) => (
                            <tr key={i}>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">16</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 14 - Performance Stream: Strategic KAI */}
            <div className="report-page report-page-14">
                <div className="p4-topbar">
                    <img src={shinhanLogo} alt="신한은행" className="p4-bank-logo" />
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
                    <span className="p10-info-text">구성원들은 전략목표 달성을 위한 전술적 성과지표</span>
                    <span className="p10-count-badge">56 개</span>
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
                            <th>전술적 성과지표</th>
                            <th>목표</th>
                            <th>전술적 성과지표</th>
                            <th>목표</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>프리미엄 판매 비중</td>
                            <td className="p12-td-center">8% 향상</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {Array.from({ length: 21 }, (_, i) => (
                            <tr key={i}>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">17</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

            {/* Page 15 - Performance Stream: Strategic KAI (continued) */}
            <div className="report-page report-page-15">
                <div className="p4-topbar">
                    <img src={shinhanLogo} alt="신한은행" className="p4-bank-logo" />
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
                            <th>전술적 성과지표</th>
                            <th>목표</th>
                            <th>전술적 성과지표</th>
                            <th>목표</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>프리미엄 판매 비중</td>
                            <td className="p12-td-center">8% 향상</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {Array.from({ length: 28 }, (_, i) => (
                            <tr key={i}>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p2-footer">
                    <span className="p2-footer-text">Powered by Quantum Edu Solution Methodology</span>
                    <span className="p2-footer-page">18</span>
                    <img src={logoImage} alt="QUANTUM EDU SOLUTION" className="p2-footer-logo" />
                </div>
            </div>

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

                <img src={polygon2Image} alt="" className="p3-polygon2" />
            </div>
        </div>
    );
};

export default ReportScreen;
