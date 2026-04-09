import { useState } from "react";

const extractText = (node) => {
    if (node == null) return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node.props?.children) return extractText(node.props.children);
    return "";
};

export const ClickableTd = ({ children, className, rowSpan, colSpan }) => {
    const [show, setShow] = useState(false);
    const text = extractText(children).trim();
    return (
        <td
            className={`${className || ""} td2-clickable-cell`}
            rowSpan={rowSpan}
            colSpan={colSpan}
            onClick={() => { if (text) setShow(true); }}
        >
            {children}
            {show && text && (
                <div className="td2-popover-overlay" onClick={e => { e.stopPropagation(); setShow(false); }}>
                    <div className="td2-popover" onClick={e => e.stopPropagation()}>
                        <div className="td2-popover-body">{text}</div>
                        <button className="td2-popover-close" onClick={() => setShow(false)}>닫기</button>
                    </div>
                </div>
            )}
        </td>
    );
};

export const ClickableDiv = ({ children, className, text }) => {
    const [show, setShow] = useState(false);
    const content = text || "";
    return (
        <div
            className={`${className || ""} td2-clickable-cell`}
            onClick={() => { if (content) setShow(true); }}
        >
            {children}
            {show && content && (
                <div className="td2-popover-overlay" onClick={e => { e.stopPropagation(); setShow(false); }}>
                    <div className="td2-popover" onClick={e => e.stopPropagation()}>
                        <div className="td2-popover-body">{content}</div>
                        <button className="td2-popover-close" onClick={() => setShow(false)}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};
