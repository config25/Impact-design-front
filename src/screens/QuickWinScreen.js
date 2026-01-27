import GNB from "../components/common/GNB";
import "./QuickWinScreen.css";
import shinhanLogo from "../resource/flow/신한은행.png";
import component1 from "../resource/quick/Component 1.png";
import vector3 from "../resource/quick/Vector 3.png";
import pencil2 from "../resource/quick/pencil2.png";
import pencil from "../resource/start/pencil.png";

const QuickWinScreen = ({ onNavigate }) => {
    return (
        <div className="quickwin-container">
            {/* GNB */}
            <GNB activeScreen="quickwin" onNavigate={onNavigate} />

            {/* Sub Header */}
            <div className="sub-header">
                <div className="sub-header-title">3. Quick Win Canvas</div>
                <div className="sub-header-actions">
                    <button className="tips-button">
                        <img src={pencil2} alt="" className="pencil-icon" />
                        <span className="tips-text"><span className="tips-text-bold">작성 Tips</span><span className="tips-text-regular">를 확인해보세요!</span></span>
                    </button>
                    <button className="save-button">저장</button>
                    <button className="submit-button">제출완료</button>
                </div>
            </div>

            {/* Main Content Box */}
            <div className="main-content-box">
                {/* Header */}
                <header className="quickwin-header">
                    <div className="header-left">
                        <div className="step-badge-container">
                            <img src={component1} alt="" className="step-badge-img" />
                            <span className="step-badge-number">3</span>
                            <img src={vector3} alt="" className="step-badge-vector" />
                        </div>
                        <div className="header-text">
                            <h1>Quick Win Canvas <span className="title-sub">(전술적 실행과제)</span></h1>
                            <p className="header-desc">
                                Quick Win은 전략목표 달성을 가로막는 장애물을 빠르게 제거하여 단기적으로 가시적인 성과를 만들어내는 실행과제입니다.
                            </p>
                            <p className="header-desc">
                                이 Quick Win이 실행되지 않으면, 우리는 지금 만들 수 있는 성과를 계속 '놓치게' 됩니다.
                            </p>
                        </div>
                    </div>
                    <div className="logo-container">
                        <img src={shinhanLogo} alt="신한은행" />
                    </div>
                </header>

                {/* Content */}
                <div className="quickwin-content">
                    {/* Alignment Section */}
                    <div className="alignment-section">
                        <div className="section-label cyan">전략목표 Alignment</div>
                        <div className="section-content">
                            <img src={pencil} alt="" className="edit-icon" />
                            <span>이 과제는 회사의 어떤 전략목표(방향)와 연계되어 있습니까?</span>
                        </div>
                    </div>

                    {/* Task Section */}
                    <div className="task-section">
                        <div className="task-rows">
                            <div className="task-row">
                                <div className="section-label cyan small">
                                    <span>전술적</span>
                                    <span>실행과제</span>
                                </div>
                                <div className="task-label">과제명</div>
                                <div className="task-content highlight">
                                    <img src={pencil} alt="" className="edit-icon" />
                                    <span>이 과제를 한 문장으로 표현하면, '무엇을 제거/해결하는 과제'입니까?</span>
                                </div>
                            </div>
                            <div className="task-row">
                                <div className="section-label cyan small invisible">
                                    <span>전술적</span>
                                    <span>실행과제</span>
                                </div>
                                <div className="task-label main-content-label">주요 내용</div>
                                <div className="task-content main-content">
                                    <img src={pencil} alt="" className="edit-icon" />
                                    <span>이 과제를 실행하면 [어떤 문제]가 해결되어 [어떤 결과]가 나올 것이라고 확신합니까?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Table */}
                    <div className="main-table">
                        <table>
                            <thead>
                                <tr className="header-row">
                                    <th className="situation">상황(Situation)</th>
                                    <th colSpan="2" className="input">투입(Input)</th>
                                    <th colSpan="4" className="activity">활동(Activity)</th>
                                    <th colSpan="2" className="outputs">산출(Outputs)</th>
                                </tr>
                                <tr className="subheader-row">
                                    <th className="crisis-header">위기의 신호 (Crisis Signal)</th>
                                    <th className="resource-header">필요 자원</th>
                                    <th className="quantity-header">수량</th>
                                    <th className="procedure-header">추진 절차</th>
                                    <th className="content-header">주요 내용</th>
                                    <th className="duration-header">소요기간</th>
                                    <th className="teamwork-header">팀 워크</th>
                                    <th className="teamwork-header2">팀 워크</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 행 1-2: 위기의 신호 */}
                                <tr>
                                    <td rowSpan="2" className="crisis-cell">
                                        <div className="cell-question">
                                            지금 이 과제를 실행해야 할<br />
                                            이유나 신호(Signal)는 무엇입니까?
                                        </div>
                                        <div className="cell-example">(예: 매출하락, 고객이탈 등)</div>
                                    </td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td rowSpan="5" className="teamwork-cell">
                                        <div className="cell-question">
                                            함께 추진할<br />
                                            Lead 그룹과<br />
                                            Support 그룹은<br />
                                            누구입니까?
                                        </div>
                                    </td>
                                    <td rowSpan="5" className="output-cell">
                                        <div className="cell-question">
                                            이 과제가 끝나면<br />
                                            '남는 것'은<br />
                                            무엇입니까?
                                        </div>
                                        <div className="cell-example">(업무 매뉴얼, 체크리스트,</div>
                                        <div className="cell-example">개선된 양식, 분석 보고서,</div>
                                        <div className="cell-example">시범 운영 결과 등)</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                </tr>
                                {/* 행 3: Pain/Touch point */}
                                <tr>
                                    <td className="pain-header-cell">Pain/Touch point</td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                </tr>
                                {/* 행 4-5: 성과를 막고... */}
                                <tr>
                                    <td rowSpan="2" className="pain-cell">
                                        <div className="cell-question">
                                            성과를 막고 문제를 발생시키는 구체적인<br />
                                            '장애물(Bottleneck)'은 무엇입니까?
                                        </div>
                                        <div className="cell-example">(예: 시스템 오류 등)</div>
                                    </td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                </tr>
                                <tr>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                    <td className="input-cell"><img src={pencil} alt="" className="edit-icon" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Outcomes Section */}
                    <div className="outcomes-section">
                        <div className="outcomes-header">성과(Outcomes)</div>
                        <div className="outcomes-content">
                            <div className="outcomes-row outcomes-title-row">
                                <div className="outcomes-cell outcomes-title-cell left">정성적 효과(체감되는 변화)</div>
                                <div className="outcomes-cell outcomes-title-cell right">정량적 효과(측정가능한 변화)</div>
                            </div>
                            <div className="outcomes-row">
                                <div className="outcomes-cell left">
                                    <span className="item-number">1.</span>
                                    <img src={pencil} alt="" className="edit-icon" />
                                    <span>현장에서 가장 먼저 체감되는 변화는 무엇입니까?</span>
                                </div>
                                <div className="outcomes-cell right">
                                    <span className="item-number">1.</span>
                                    <img src={pencil} alt="" className="edit-icon" />
                                    <span>6개월 내 수치로 확인 가능한 변화는 무엇입니까?</span>
                                </div>
                            </div>
                            <div className="outcomes-row">
                                <div className="outcomes-cell left">
                                    <span className="item-number">2.</span>
                                    <img src={pencil} alt="" className="edit-icon" />
                                </div>
                                <div className="outcomes-cell right">
                                    <span className="item-number">2.</span>
                                    <img src={pencil} alt="" className="edit-icon" />
                                </div>
                            </div>
                            <div className="outcomes-row">
                                <div className="outcomes-cell left last">
                                    <span className="item-number">3.</span>
                                    <img src={pencil} alt="" className="edit-icon" />
                                </div>
                                <div className="outcomes-cell right last">
                                    <span className="item-number">3.</span>
                                    <img src={pencil} alt="" className="edit-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickWinScreen;
