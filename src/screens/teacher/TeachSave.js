import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClass } from "../../services/teachClassService";
import "./TeachSave.css";

const TeachSave = () => {
    const navigate = useNavigate();
    const [classType, setClassType] = useState("Basic");
    const [groupType, setGroupType] = useState("team");
    const [className, setClassName] = useState("");
    const [target, setTarget] = useState("");
    const [projectDate, setProjectDate] = useState("");
    const [teamCount, setTeamCount] = useState(3);
    const [memberCount, setMemberCount] = useState(1);
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = async () => {
        if (!className.trim()) {
            alert("강의실 명을 입력해주세요.");
            return;
        }
        if (!window.confirm("새로운 강의실을 생성하시겠습니까?")) return;

        const result = await createClass({
            name: className,
            numTeam: teamCount,
            numMember: memberCount,
            classType: classType,
            target: target,
            projectDate: projectDate,
        }, imageFile);

        if (result.success) {
            alert("강의실이 생성되었습니다.");
            navigate("/teacher/list");
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="tsv-container">
            <div className="tsv-panel">
                <div className="tsv-panel-heading">
                    <span className="tsv-panel-title">강의실 기본정보 입력</span>
                </div>
                <div className="tsv-panel-body">
                    <table className="tsv-form-table">
                        <tbody>
                            <tr>
                                <th>강의실 유형</th>
                                <td>
                                    <select
                                        className="tsv-select-type"
                                        value={classType}
                                        onChange={e => setClassType(e.target.value)}
                                    >
                                        <option value="Basic">Basic</option>
                                        <option value="Start">Start</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>강의실 유형</th>
                                <td>
                                    <label className="tsv-radio">
                                        <input
                                            type="radio"
                                            name="groupType"
                                            value="team"
                                            checked={groupType === "team"}
                                            onChange={e => setGroupType(e.target.value)}
                                        />
                                        팀
                                    </label>
                                    <label className="tsv-radio">
                                        <input
                                            type="radio"
                                            name="groupType"
                                            value="individual"
                                            checked={groupType === "individual"}
                                            onChange={e => setGroupType(e.target.value)}
                                        />
                                        개인
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <th>강의실 명</th>
                                <td>
                                    <input
                                        type="text"
                                        className="tsv-input-name"
                                        placeholder="강의실 명"
                                        value={className}
                                        onChange={e => setClassName(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>대상</th>
                                <td>
                                    <input
                                        type="text"
                                        className="tsv-input-name"
                                        placeholder="대상을 입력해주세요"
                                        value={target}
                                        onChange={e => setTarget(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Project Date</th>
                                <td>
                                    <input
                                        type="date"
                                        className="tsv-input-date"
                                        value={projectDate}
                                        onChange={e => setProjectDate(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>팀 수</th>
                                <td>
                                    <select
                                        className="tsv-select-num"
                                        value={teamCount}
                                        onChange={e => setTeamCount(Number(e.target.value))}
                                    >
                                        {Array.from({ length: 4 }, (_, i) => i + 3).map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                    <span className="tsv-unit">팀</span>
                                </td>
                            </tr>
                            <tr>
                                <th>팀원 수</th>
                                <td>
                                    <select
                                        className="tsv-select-num"
                                        value={memberCount}
                                        onChange={e => setMemberCount(Number(e.target.value))}
                                    >
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                    <span className="tsv-unit">명</span>
                                </td>
                            </tr>
                            <tr>
                                <th>강의실 이미지</th>
                                <td>
                                    <label className="tsv-file-label">
                                        <span className="tsv-file-btn">파일 선택</span>
                                        <input
                                            type="file"
                                            className="tsv-file-input"
                                            accept="image/*"
                                            onChange={e => setImageFile(e.target.files[0] || null)}
                                        />
                                        <span className="tsv-file-name">
                                            {imageFile ? imageFile.name : "선택된 파일 없음"}
                                        </span>
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="tsv-panel-footer">
                    <button className="tsv-btn-submit" onClick={handleSubmit}>강의실 생성</button>
                </div>
            </div>
        </div>
    );
};

export default TeachSave;
