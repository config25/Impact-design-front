import { useState, useContext } from "react";
import pencil from "../../resource/start/pencil.png";
import { IdentityCanvasContext } from "../../contexts/IdentityCanvasContext";

const LegacySection = () => {
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

    const renderItem = (key, title, subtitle) => {
        const isEditing = editingField === key;
        const value = values[key];

        return (
            <div className="legacy-item">
                <div className="legacy-item-title">{title}</div>
                <div className={`legacy-item-body ${isEditing ? 'editing' : ''}`}>
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
                            <span className="legacy-item-subtitle">{subtitle}</span>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section className="legacy-section">
            <div className="legacy-header">
                기존 가치체계 (Current Legacy)
            </div>

            <div className="legacy-content">
                {renderItem("mission", "미션(Mission)", "(존재 이유)")}
                {renderItem("vision", "비전 (Vision)", "(지향하는 미래)")}
                {renderItem("value", "핵심가치 (Value)", "(행동 원칙)")}
            </div>
        </section>
    );
};

export default LegacySection;
