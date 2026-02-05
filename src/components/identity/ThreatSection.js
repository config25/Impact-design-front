import { useState, useContext } from "react";
import pencilIcon from "../../resource/identity/pencil.png";
import polygon3 from "../../resource/identity/Polygon 3.png";
import polygon2 from "../../resource/identity/Polygon 2.png";
import { IdentityCanvasContext } from "../../contexts/IdentityCanvasContext";

const ThreatSection = () => {
    const [editingCard, setEditingCard] = useState(null);
    const { values, updateField } = useContext(IdentityCanvasContext);

    const handleBlur = () => {
        setEditingCard(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setEditingCard(null);
        }
    };

    const renderThreatCard = (key, title, question) => {
        const isEditing = editingCard === `threat-${key}`;
        const value = values[key];

        return (
            <div className="threat-card">
                <div className="threat-card-title">{title}</div>
                <div className={`threat-card-content ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <textarea
                            className="editable-input"
                            value={value}
                            onChange={(e) => updateField(key, e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            placeholder="내용을 입력하세요"
                        />
                    ) : value ? (
                        <div className="input-value" onClick={() => setEditingCard(`threat-${key}`)}>
                            {value}
                        </div>
                    ) : (
                        <>
                            <div className="threat-card-question">
                                {question}
                            </div>
                            <img
                                src={pencilIcon}
                                alt=""
                                className="pencil-icon"
                                onClick={() => setEditingCard(`threat-${key}`)}
                            />
                        </>
                    )}
                </div>
            </div>
        );
    };

    const renderInternalCard = (key, title, question) => {
        const isEditing = editingCard === `internal-${key}`;
        const value = values[key];

        return (
            <div className="internal-card">
                <div className="internal-card-title">{title}</div>
                <div className={`internal-card-content ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <textarea
                            className="editable-input"
                            value={value}
                            onChange={(e) => updateField(key, e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            placeholder="내용을 입력하세요"
                        />
                    ) : value ? (
                        <div className="input-value" onClick={() => setEditingCard(`internal-${key}`)}>
                            {value}
                        </div>
                    ) : (
                        <>
                            {question && (
                                <div className="internal-card-question">
                                    {question}
                                </div>
                            )}
                            <img
                                src={pencilIcon}
                                alt=""
                                className="pencil-icon"
                                onClick={() => setEditingCard(`internal-${key}`)}
                            />
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section className="identity-section threat-section">
            {/* 왼쪽 삼각형 */}
            <img src={polygon3} alt="" className="polygon-left" />

            {/* 외부의 위협 신호 헤더 */}
            <div className="threat-header">
                <div className="threat-header-title">
                    외부의 위협 신호 (External Threats)
                </div>
                <div className="threat-header-subtitle">
                    "우리를 위협하는 외부의 경고는 무엇입니까?
                </div>
            </div>

            {/* 4가지 카드를 감싼 빨간 박스 */}
            <div className="threat-body">
                <div className="threat-grid">
                    {renderThreatCard("macro", "정책/경제 (Macro)", <>규제강화, 원가상승 등<br />불리한 환경요인은?</>)}
                    {renderThreatCard("tech", "기술 (Tech)", <>우리의 경쟁력을 위협하는<br />새로운 기술은?</>)}
                    {renderThreatCard("customer", "고객/사회 (Customer)", <>고객의 취향은 얼마나<br />냉정하게 변했는가?</>)}
                    {renderThreatCard("competitor", "경쟁 (Competitor)", <>경쟁사가 우리보다<br />앞서고 있는 것은 없는가?</>)}
                </div>
            </div>

            {/* 내부의 한계점 헤더 */}
            <div className="internal-header">
                <div className="internal-header-title">
                    내부의 한계점 (Internal Limits)
                </div>
                <div className="internal-header-subtitle">
                    "앞으로의 성장을 위해 넘어서야 할 내부의 한계는 무엇입니까?
                </div>
            </div>

            {/* 내부의 한계점 - 4가지 카드 */}
            <div className="internal-body">
                <div className="internal-grid">
                    {renderInternalCard("capability", "역량 (Capability)", <>미래 성장을 위해 시급히<br />보완해야 할 스킬은?</>)}
                    {renderInternalCard("culture", "문화(Culture)", <>미래 성장을 위해 시급히<br />보완해야 할 스킬은?</>)}
                    {renderInternalCard("structure", "구조(Structure)", <>속도를 떨어뜨리는<br />비효율적 체계는?</>)}
                    {renderInternalCard("etc", "기타", null)}
                </div>
            </div>

            {/* 오른쪽 삼각형 */}
            <img src={polygon2} alt="" className="polygon-right" />
        </section>
    );
};

export default ThreatSection;
