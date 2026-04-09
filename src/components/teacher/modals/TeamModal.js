const TeamModal = ({
    show, onClose, modalTeam, modalTeamName, setModalTeamName,
    modalMembers, setModalMembers, selectedMembers,
    handleMemberCheck, handleDeleteMembers, handleAddMember, handleSetWriter, handleTeamModalSave,
}) => {
    if (!show || !modalTeam) return null;

    return (
        <div className="td2-modal-overlay" onClick={onClose}>
            <div className="td2-team-modal" onClick={e => e.stopPropagation()}>
                <div className="td2-team-modal-header">
                    <span className="td2-team-modal-title">팀/참여자 정보입력</span>
                    <button className="td2-modify-close" onClick={onClose}>&times;</button>
                </div>
                <div className="td2-team-modal-body">
                    <h4 className="td2-team-modal-subtitle">참여자 정보입력</h4>

                    {/* 팀 기본정보 */}
                    <table className="td2-team-modal-info">
                        <tbody>
                            <tr>
                                <th>팀 번호</th>
                                <td>{modalTeam.sequence}</td>
                            </tr>
                            <tr>
                                <th>팀 이름</th>
                                <td>
                                    <input
                                        type="text"
                                        className="td2-team-modal-input"
                                        value={modalTeamName}
                                        onChange={e => setModalTeamName(e.target.value)}
                                        placeholder="팀 이름"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 참여자 테이블 */}
                    <table className="td2-member-table">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}></th>
                                <th>번호</th>
                                <th>User ID</th>
                                <th>성명</th>
                                <th>메일주소</th>
                                <th>대표작성자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalMembers.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: "center", padding: 20, color: "#999" }}>등록된 팀원이 없습니다.</td></tr>
                            ) : (
                                modalMembers.map((m, idx) => (
                                    <tr key={m.userId}>
                                        <td style={{ textAlign: "center" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(m.userId)}
                                                onChange={() => handleMemberCheck(m.userId)}
                                            />
                                        </td>
                                        <td>{idx + 1}</td>
                                        <td>{m.loginId}</td>
                                        <td className="td2-member-editable">{m.name || m.loginId}</td>
                                        <td className="td2-member-editable">{m.mail || "@"}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <input
                                                type="checkbox"
                                                checked={m.writer === "1"}
                                                onChange={() => {
                                                    setModalMembers(prev => prev.map(mb => ({
                                                        ...mb,
                                                        writer: mb.userId === m.userId ? "1" : null
                                                    })));
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* 하단 버튼 + 안내문구 */}
                    <div className="td2-team-modal-actions">
                        <div className="td2-team-modal-btns">
                            <button className="td2-modal-btn-gray" onClick={handleDeleteMembers}>선택된 팀원삭제</button>
                            <button className="td2-modal-btn-blue" onClick={handleAddMember}>팀원추가</button>
                            <button className="td2-modal-btn-blue" onClick={handleSetWriter}>대표 작성자 지정</button>
                            <button className="td2-modal-btn-blue" onClick={handleTeamModalSave}>입력완료</button>
                        </div>
                        <p className="td2-team-modal-note">CEO와 각 계정당 직책은 오직 1명만 가능합니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamModal;
