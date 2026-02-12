import React from 'react';
import './TipsModal.css';

function TipsModal({ show, onClose, title, concept, method }) {
  if (!show) return null;

  return (
    <div className="tips-modal-overlay" onClick={onClose}>
      <div className="tips-modal-box" onClick={e => e.stopPropagation()}>
        <div className="tips-modal-header">
          <span className="tips-modal-header-title">작성 Tips — {title}</span>
          <button className="tips-modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="tips-modal-content">
          <div className="tips-modal-section concept">
            <div className="tips-modal-section-title">💡 개념이해</div>
            <div className="tips-modal-section-body">{concept}</div>
          </div>
          <div className="tips-modal-section method">
            <div className="tips-modal-section-title">📝 작성방법</div>
            <div className="tips-modal-section-body">{method}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TipsModal;
