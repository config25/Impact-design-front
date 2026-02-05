import { useState, useContext } from "react";
import pencil from "../../resource/start/pencil.png";
import { IdentityCanvasContext } from "../../contexts/IdentityCanvasContext";

const NewIdentitySection = () => {
    const [editingField, setEditingField] = useState(null);
    const { values, updateField } = useContext(IdentityCanvasContext);

    const handleEdit = (key) => {
        setEditingField(key);
    };

    const handleChange = (key, value) => {
        updateField(key, value);
    };

    const handleBlur = () => {
        setEditingField(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setEditingField(null);
        }
    };

    const renderItem = (key, title, subtitle, desc) => {
        const isEditing = editingField === key;
        const value = values[key];

        return (
            <div className="new-identity-item">
                <div className="new-item-title">{title}</div>
                <div className={`new-item-body ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <textarea
                            className="editable-input"
                            value={value}
                            onChange={(e) => handleChange(key, e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            placeholder="내용을 입력하세요"
                        />
                    ) : value ? (
                        <div className="input-value" onClick={() => handleEdit(key)}>
                            {value}
                        </div>
                    ) : (
                        <>
                            <img
                                src={pencil}
                                alt=""
                                className="edit-icon"
                                onClick={() => handleEdit(key)}
                            />
                            <span className="new-item-subtitle">{subtitle}</span>
                            <span className="new-item-desc">{desc}</span>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section className="new-identity-section">
            {/* 미래 방향성 헤더 - 400 x 100 */}
            <div className="new-identity-header">
                미래 방향성 (New Identity)
            </div>

            <div className="new-identity-content">
                {renderItem("newMission", "New 미션(Mission)", "(재정의된 존재 이유)", "우리가 선택한 존재 이유")}
                {renderItem("newVision", "New 비전(Vision)", "(새롭게 그리는 미래)", "우리가 도달할 구체적 모습")}
                {renderItem("newValue", "New 핵심가치(Value)", "(새로운 행동/판단기준)", "비전 달성을 위한 새로운 원칙")}
            </div>
        </section>
    );
};

export default NewIdentitySection;
