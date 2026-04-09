const ModifyModal = ({
    show, onClose, gameInfo,
    modifyName, setModifyName, modifyTarget, setModifyTarget,
    modifyMonth, setModifyMonth, modifyDay, setModifyDay,
    modifyHour, setModifyHour, modifyMinute, setModifyMinute,
    handleModifySave, rangeArray,
}) => {
    if (!show) return null;

    return (
        <div className="td2-modal-overlay" onClick={onClose}>
            <div className="td2-modify-modal" onClick={e => e.stopPropagation()}>
                <div className="td2-modify-header">
                    <span className="td2-modify-title">
                        <i className="fa fa-hand-o-down" style={{ marginRight: 6 }}></i>
                        강의실 기본정보 입력
                    </span>
                    <button className="td2-modify-close" onClick={onClose}>&times;</button>
                </div>
                <div className="td2-modify-body">
                    <div className="td2-modify-row">
                        <label className="td2-modify-label">강의실 명</label>
                        <div className="td2-modify-field">
                            <input
                                type="text"
                                className="td2-modify-input"
                                value={modifyName}
                                onChange={e => setModifyName(e.target.value)}
                                placeholder="강의실 명"
                            />
                        </div>
                    </div>
                    <div className="td2-modify-row">
                        <label className="td2-modify-label">강의대상</label>
                        <div className="td2-modify-field">
                            <input
                                type="text"
                                className="td2-modify-input"
                                value={modifyTarget}
                                onChange={e => setModifyTarget(e.target.value)}
                                placeholder="강의대상"
                            />
                        </div>
                    </div>
                    <div className="td2-modify-row">
                        <label className="td2-modify-label">팀 수</label>
                        <div className="td2-modify-field">
                            <span className="td2-modify-static">{gameInfo.numTeam} 팀</span>
                        </div>
                    </div>
                    <div className="td2-modify-row">
                        <label className="td2-modify-label">팀원 수</label>
                        <div className="td2-modify-field">
                            <span className="td2-modify-static">1 팀</span>
                        </div>
                    </div>
                    <div className="td2-modify-row">
                        <label className="td2-modify-label">제출시간</label>
                        <div className="td2-modify-field">
                            <div className="td2-modify-time-row">
                                <select className="td2-deadline-select" value={modifyMonth} onChange={e => setModifyMonth(Number(e.target.value))}>
                                    {rangeArray(1, 12).map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <span className="td2-deadline-unit">월</span>
                                <select className="td2-deadline-select" value={modifyDay} onChange={e => setModifyDay(Number(e.target.value))}>
                                    {rangeArray(1, 31).map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <span className="td2-deadline-unit">일</span>
                            </div>
                            <div className="td2-modify-time-row" style={{ marginTop: 6 }}>
                                <select className="td2-deadline-select" value={modifyHour} onChange={e => setModifyHour(Number(e.target.value))}>
                                    {rangeArray(0, 23).map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                                <span className="td2-deadline-unit">시</span>
                                <select className="td2-deadline-select" value={modifyMinute} onChange={e => setModifyMinute(Number(e.target.value))}>
                                    {rangeArray(0, 5).map(m => <option key={m} value={m * 10}>{m * 10}</option>)}
                                </select>
                                <span className="td2-deadline-unit">분</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "center", marginTop: 20 }}>
                        <button className="td2-btn-primary" onClick={handleModifySave}>강의실 수정</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyModal;
