import polygonImage from "../../resource/report/Polygon 4.png";
import { blueprintSteps } from "../../utils/reportUtils";
import ReportFooter from "./ReportFooter";

const ReportAbout = () => (
    <div className="report-page report-page-2">
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

        <div className="p2-white-section">
            <h3 className="p2-blueprint-title">
                The Strategic Blueprint &nbsp;| &nbsp;성과를 창출하는 4단계
            </h3>

            <div className="p2-gradient-bar">
                {blueprintSteps.map((step, i) => (
                    <span key={i} className="p2-roman">{step.roman}</span>
                ))}
            </div>

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

            <div className="p2-quote-box">
                <p className="p2-quote-text">
                    "우리는 눈앞의 성과(<span className="p2-quote-bold">Tactical KPI</span>)와 미래를 위한 체질(<span className="p2-quote-bold">Strategic KAI</span>)을 동시에 관리하여,
                    <br />
                    지속가능한 성과를 만드는 구조(<span className="p2-quote-bold">Structure</span>)를 설계합니다."
                </p>
            </div>
        </div>

        <ReportFooter page={2} />
    </div>
);

export default ReportAbout;
