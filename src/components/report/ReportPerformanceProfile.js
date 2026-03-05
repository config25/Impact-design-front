import longunionImg from "../../resource/report/longunion.png";
import ReportSectionHeader from "./ReportSectionHeader";
import ReportFooter from "./ReportFooter";

const quadrants = [
    { key: "TL", name: "Burnout Runner", korean: "(지쳐가는 러너)" },
    { key: "TR", name: "Impact Player", korean: "(지속가능한 리더)" },
    { key: "BL", name: "Survival Walker", korean: "(생존형 보행자)" },
    { key: "BR", name: "Idle Dreamer", korean: "(잠자는 몽상가)" },
];

const ReportPerformanceProfile = ({ logoUrl, scores, profileType }) => (
    <div className="report-page report-page-4">
        <div className="p4-topbar">
            {logoUrl && <img src={logoUrl} alt="logo" className="p4-bank-logo" />}
            <span className="p4-confidential">Confidential &amp; Proprietary</span>
        </div>
        <ReportSectionHeader title="I. Performance Profile (성과 인식 프로파일)" />

        <div className="p4-desc-box">
            <p className="p4-desc-text">
                Performance Profile은 구성원들이 인식하는 '현재 성과(Performance)'와 이를 지탱하는 '미래 경쟁력 (System)'의 균형점을 진단하는 도구입니다. 성과 데이터를 분석한 것이 아니라 조직 내부의 시선으로 본 우리 조직의 '성장 건전성'을 점검하고, Impact Player로 도약하기 위한 전략적 현주소를 제시합니다.
            </p>
        </div>

        <div className="p4-divider-line"></div>

        <div className="p4-result-box">
            <span className="p4-result-subtitle">귀사 구성원들이 바라보는 조직의 성과창출 스타일은</span>
            <div className="p4-result-title-row">
                <span className="p4-result-name">{profileType?.name || "Burnout Runner"}</span>
                <span className="p4-result-korean">{profileType?.korean || "(지쳐가는 러너)"}</span>
            </div>
            <span className="p4-result-tagline">{profileType?.tagline || "높은 성과 '인식'과 취약한 '기반'의 딜레마"}</span>
        </div>

        <div className="p4-main-box">
            <img src={longunionImg} alt="" className="p4-arrow-img-y" />
            <img src={longunionImg} alt="" className="p4-arrow-img-x" />

            <div className="p4-chart-area">
                <div className="p4-matrix-section">
                    <div className="p4-y-label">
                        성과 창출력 (성과목표, 실행력)
                    </div>
                    <div className="p4-chart-inner">
                        <div className="p4-axes-wrap">
                            <span className="p4-y-high">High</span>
                            <div className="p4-quad-grid">
                                {quadrants.map(q => (
                                    <div key={q.key} className={`p4-quad ${profileType?.quadrant === q.key ? "p4-quad-active" : "p4-quad-inactive"}`}>
                                        <strong className={profileType?.quadrant === q.key ? "p4-quad-name-w" : "p4-quad-name-g"}>{q.name}</strong>
                                        <span className={profileType?.quadrant === q.key ? "p4-quad-sub-w" : "p4-quad-sub-g"}>{q.korean}</span>
                                        {profileType?.quadrant === q.key && (
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
                                ))}
                            </div>
                            <span className="p4-y-low">Low</span>
                            <span className="p4-x-high">High</span>
                        </div>
                        <div className="p4-x-label-row">
                            <span className="p4-x-label-text">미래 경쟁력 (아이덴티티, 시스템)</span>
                        </div>
                    </div>
                </div>

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

            <div className="p4-analysis-area">
                <div className="p4-analysis-badge p4-badge-diag">진단</div>
                <div className="p4-analysis-content-box">
                    <p className="p4-analysis-text">{profileType?.diagnosis || ""}</p>
                </div>
                <div className="p4-analysis-badge p4-badge-sol">솔루션</div>
                <div className="p4-analysis-content-box">
                    <p className="p4-analysis-text">{profileType?.solution || ""}</p>
                </div>
            </div>
        </div>

        <ReportFooter page={4} />
    </div>
);

export default ReportPerformanceProfile;
