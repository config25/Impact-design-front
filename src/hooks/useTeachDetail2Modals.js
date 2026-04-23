import { useState } from "react";
import { updateClass } from "../services/teachClassService";
import { getTeamInfo, updateTeamInfo, deleteTeamMembers, setTeamWriter, addTeamMember, getDeletedTeams, restoreTeam } from "../services/teachTeamService";
import { getImpactCheckByTeam, getIdentityCanvasByTeam, getFlowCanvasByTeam, getQuickWinByTeam, getBuildWinByTeam, getFundingByTeam, getFundingResultByTeam, rollbackMission } from "../services/teachSubmissionService";

/* 미션 코드 → rollback stage */
const ROLLBACK_STAGE_MAP = {
    "A-1": "A",
    "B-1": "B",
    "C-1": "C",
    "D-1": "D",
    "E-1": "E",
    "F-1": "F_QUICK",
    "F-2": "F_BUILD",
};

const useTeachDetail2Modals = ({ gameId, gameInfo, refreshTeams, onGameInfoUpdate }) => {
    /* 현재 열린 미션 코드 + 선택된 팀 ID (모달 내 팀 전환용) */
    const [activeMissionCode, setActiveMissionCode] = useState(null);
    const [activeTeamId, setActiveTeamId] = useState(null);

    /* 미션 열람 모달 */
    const [showMissionModal, setShowMissionModal] = useState(false);
    const [missionModalTitle, setMissionModalTitle] = useState("");
    const [missionModalData, setMissionModalData] = useState(null);
    const [missionModalTeamId, setMissionModalTeamId] = useState(null);

    /* 정체성 설계 열람 모달 */
    const [showIdentityModal, setShowIdentityModal] = useState(false);
    const [identityModalTitle, setIdentityModalTitle] = useState("");
    const [identityModalData, setIdentityModalData] = useState(null);

    /* 성과경로 설계 열람 모달 */
    const [showFlowModal, setShowFlowModal] = useState(false);
    const [flowModalTitle, setFlowModalTitle] = useState("");
    const [flowModalData, setFlowModalData] = useState(null);

    /* 전술적 실행과제 열람 모달 */
    const [showQuickWinModal, setShowQuickWinModal] = useState(false);
    const [quickWinModalTitle, setQuickWinModalTitle] = useState("");
    const [quickWinModalData, setQuickWinModalData] = useState(null);

    /* 전략적 실행과제 열람 모달 */
    const [showBuildWinModal, setShowBuildWinModal] = useState(false);
    const [buildWinModalTitle, setBuildWinModalTitle] = useState("");
    const [buildWinModalData, setBuildWinModalData] = useState(null);

    /* 실행과제 검증 열람 모달 (F-1, F-2) */
    const [showFundingModal, setShowFundingModal] = useState(false);
    const [fundingModalTitle, setFundingModalTitle] = useState("");
    const [fundingModalData, setFundingModalData] = useState(null);
    const [fundingModalType, setFundingModalType] = useState("quick");

    /* 최종 결과 열람 모달 (F-3) */
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultModalTitle, setResultModalTitle] = useState("");
    const [resultModalData, setResultModalData] = useState(null);

    /* 삭제된 팀 모달 */
    const [showDeletedModal, setShowDeletedModal] = useState(false);
    const [deletedTeams, setDeletedTeams] = useState([]);
    const [selectedDeleted, setSelectedDeleted] = useState([]);

    /* 팀/참여자 정보입력 모달 */
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [modalTeam, setModalTeam] = useState(null);
    const [modalTeamName, setModalTeamName] = useState("");
    const [modalMembers, setModalMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    /* 보고서(파일 다운) 모달 */
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportTeamId, setReportTeamId] = useState(null);

    /* 강의실 수정 모달 */
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [modifyName, setModifyName] = useState("");
    const [modifyTarget, setModifyTarget] = useState("");
    const [modifyMonth, setModifyMonth] = useState(new Date().getMonth() + 1);
    const [modifyDay, setModifyDay] = useState(new Date().getDate());
    const [modifyHour, setModifyHour] = useState(1);
    const [modifyMinute, setModifyMinute] = useState(0);

    /* 미션 아이템 클릭 */
    const handleMissionClick = async (missionCode, teamId, teamName) => {
        setActiveMissionCode(missionCode);
        setActiveTeamId(teamId);
        if (missionCode === "A-1") {
            const result = await getImpactCheckByTeam(teamId);
            if (result.success) {
                setMissionModalTitle(`${teamName} - 성과관리 현황진단`);
                setMissionModalData(result.data);
                setMissionModalTeamId(teamId);
                setShowMissionModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "B-1") {
            const result = await getIdentityCanvasByTeam(teamId);
            if (result.success) {
                setIdentityModalTitle(`${teamName} - 정체성 설계`);
                setIdentityModalData(result.data);
                setShowIdentityModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "C-1") {
            const result = await getFlowCanvasByTeam(teamId);
            if (result.success) {
                setFlowModalTitle(`${teamName} - 성과경로 설계`);
                setFlowModalData(result.data);
                setShowFlowModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "D-1") {
            const result = await getQuickWinByTeam(teamId);
            if (result.success) {
                setQuickWinModalTitle(`${teamName} - 전술적 실행과제`);
                setQuickWinModalData(result.data);
                setShowQuickWinModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "E-1") {
            const result = await getBuildWinByTeam(teamId);
            if (result.success) {
                setBuildWinModalTitle(`${teamName} - 전략적 실행과제`);
                setBuildWinModalData(result.data);
                setShowBuildWinModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "F-1") {
            const result = await getFundingByTeam("quick", teamId);
            if (result.success) {
                setFundingModalTitle(`${teamName} - Quick Win 평가`);
                setFundingModalData(result.data);
                setFundingModalType("quick");
                setShowFundingModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "F-2") {
            const result = await getFundingByTeam("build", teamId);
            if (result.success) {
                setFundingModalTitle(`${teamName} - Build Win 평가`);
                setFundingModalData(result.data);
                setFundingModalType("build");
                setShowFundingModal(true);
            } else {
                alert(result.message);
            }
        } else if (missionCode === "F-3") {
            const result = await getFundingResultByTeam(teamId);
            if (result.success) {
                setResultModalTitle(`${teamName} - 최종 결과 확인`);
                setResultModalData(result.data);
                setShowResultModal(true);
            } else {
                alert(result.message);
            }
        } else {
            alert("준비 중인 기능입니다.");
        }
    };

    /* 팀/참여자 정보입력 모달 열기 */
    const handleOpenTeamModal = async (teamId) => {
        const result = await getTeamInfo(teamId);
        if (result.success) {
            setModalTeam(result.data);
            setModalTeamName(result.data.teamName || "");
            setModalMembers(result.data.members || []);
            setSelectedMembers([]);
            setShowTeamModal(true);
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 팀원 체크박스 */
    const handleMemberCheck = (userId) => {
        setSelectedMembers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    /* 모달 - 선택된 팀원 삭제 */
    const handleDeleteMembers = async () => {
        if (selectedMembers.length === 0) {
            alert("삭제할 팀원을 선택해주세요.");
            return;
        }
        if (!window.confirm(`선택된 ${selectedMembers.length}명의 팀원을 삭제하시겠습니까?`)) return;

        const result = await deleteTeamMembers(selectedMembers);
        if (result.success) {
            setModalMembers(prev => prev.filter(m => !selectedMembers.includes(m.userId)));
            setSelectedMembers([]);
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 팀원 추가 */
    const handleAddMember = async () => {
        const result = await addTeamMember(modalTeam.teamId, gameId);
        if (result.success) {
            alert(`팀원이 추가되었습니다. (ID: ${result.loginId})`);
            const refreshed = await getTeamInfo(modalTeam.teamId);
            if (refreshed.success) setModalMembers(refreshed.data.members || []);
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 대표 작성자 지정 */
    const handleSetWriter = async () => {
        const writerMember = modalMembers.find(m => m.writer === "1");
        if (!writerMember) {
            alert("대표 작성자로 지정할 팀원의 체크박스를 선택해주세요.");
            return;
        }
        const result = await setTeamWriter(modalTeam.teamId, writerMember.userId);
        if (result.success) {
            alert("대표 작성자가 지정되었습니다.");
        } else {
            alert(result.message);
        }
    };

    /* 모달 - 입력완료 (저장) */
    const handleTeamModalSave = async () => {
        const result = await updateTeamInfo(modalTeam.teamId, {
            teamName: modalTeamName,
            sequence: modalTeam.sequence,
            isDoing: modalTeam.isDoing,
            aiPlay: 0,
        });

        if (result.success) {
            alert("저장되었습니다.");
            setShowTeamModal(false);
            await refreshTeams();
        } else {
            alert(result.message);
        }
    };

    /* 삭제된 팀 보기 */
    const handleShowDeleted = async () => {
        const result = await getDeletedTeams(gameId);
        if (result.success) {
            if (result.data.length === 0) {
                alert("삭제된 팀이 없습니다.");
                return;
            }
            setDeletedTeams(result.data);
            setSelectedDeleted([]);
            setShowDeletedModal(true);
        } else {
            alert(result.message);
        }
    };

    /* 삭제된 팀 복구 */
    const handleRestore = async () => {
        if (selectedDeleted.length === 0) {
            alert("복구할 팀을 선택해주세요.");
            return;
        }
        const names = deletedTeams.filter(t => selectedDeleted.includes(t.teamId)).map(t => t.teamName);
        if (!window.confirm(`${names.join(", ")} 팀을 복구하시겠습니까?`)) return;

        let successCount = 0;
        for (const teamId of selectedDeleted) {
            const result = await restoreTeam(teamId, gameId);
            if (result.success) successCount++;
        }

        if (successCount > 0) {
            alert(`${successCount}개 팀이 복구되었습니다.`);
            setShowDeletedModal(false);
            await refreshTeams();
        } else {
            alert("팀 복원에 실패했습니다.");
        }
    };

    /* 강의실 수정 모달 열기 */
    const handleOpenModify = () => {
        if (gameInfo) {
            setModifyName(gameInfo.name);
            setModifyTarget(gameInfo.target || "");
        }
        setShowModifyModal(true);
    };

    /* 강의실 수정 저장 */
    const handleModifySave = async () => {
        if (!modifyName.trim()) {
            alert("강의실 명을 입력해주세요.");
            return;
        }

        const year = new Date().getFullYear();
        const mm = String(modifyMonth).padStart(2, "0");
        const dd = String(modifyDay).padStart(2, "0");
        const hh = String(modifyHour).padStart(2, "0");
        const min = String(modifyMinute).padStart(2, "0");
        const enddate = `${year}-${mm}-${dd} ${hh}:${min}`;

        const result = await updateClass(gameId, {
            name: modifyName,
            enddate: enddate,
            target: modifyTarget,
        });

        if (result.success) {
            alert("강의실이 수정되었습니다.");
            onGameInfoUpdate(modifyName, modifyTarget);
            setShowModifyModal(false);
        } else {
            alert(result.message);
        }
    };

    /* 미션 아이템 클릭 → 바로 팀1 데이터로 모달 열기 */
    const handleMissionItemClick = (missionCode, teams) => {
        if (!teams || teams.length === 0) {
            alert("등록된 팀이 없습니다.");
            return;
        }
        const firstTeam = teams[0];
        handleMissionClick(missionCode, firstTeam.teamId, firstTeam.teamName);
    };

    /* 모달 안에서 팀 변경 */
    const handleModalTeamChange = (teamId, teamName) => {
        if (activeMissionCode && teamId) {
            handleMissionClick(activeMissionCode, teamId, teamName);
        }
    };

    /* 미션 Rollback (반려) */
    const handleRollback = async () => {
        if (!activeTeamId || !activeMissionCode) return;
        const stage = ROLLBACK_STAGE_MAP[activeMissionCode];
        if (!stage) {
            alert("반려할 수 없는 미션입니다.");
            return;
        }
        if (!window.confirm("미션을 반려하시겠습니까?")) return;

        const result = await rollbackMission(activeTeamId, stage);
        if (!result.success) {
            alert(result.message);
            return;
        }

        alert("미션이 반려되었습니다.");
        setShowMissionModal(false);
        setShowIdentityModal(false);
        setShowFlowModal(false);
        setShowQuickWinModal(false);
        setShowBuildWinModal(false);
        setShowFundingModal(false);
        await refreshTeams();
    };

    return {
        /* 미션 섹션 (TeachDetail2 JSX에서 직접 사용) */
        handleMissionItemClick,
        activeTeamId, handleModalTeamChange,

        /* 미션 Rollback */
        handleRollback,

        /* 팀 모달 열기 (TeachDetail2 JSX에서 직접 사용) */
        handleOpenTeamModal,

        /* 보고서 모달 열기 (TeachDetail2 JSX에서 직접 사용) */
        setReportTeamId, setShowReportModal,

        /* 수정/삭제 (TeachDetail2 JSX에서 직접 사용) */
        handleOpenModify, handleShowDeleted,

        /* TeachDetail2Modals에 전달할 모달 상태 */
        showMissionModal, setShowMissionModal,
        missionModalTitle, missionModalData,
        showIdentityModal, setShowIdentityModal,
        identityModalTitle, identityModalData,
        showFlowModal, setShowFlowModal,
        flowModalTitle, flowModalData,
        showQuickWinModal, setShowQuickWinModal,
        quickWinModalTitle, quickWinModalData,
        showBuildWinModal, setShowBuildWinModal,
        buildWinModalTitle, buildWinModalData,
        showFundingModal, setShowFundingModal,
        fundingModalTitle, fundingModalData, fundingModalType,
        showResultModal, setShowResultModal,
        resultModalTitle, resultModalData,
        showDeletedModal, setShowDeletedModal,
        deletedTeams, selectedDeleted, setSelectedDeleted,
        handleRestore,
        showTeamModal, setShowTeamModal,
        modalTeam, modalTeamName, setModalTeamName,
        modalMembers, setModalMembers, selectedMembers,
        handleMemberCheck, handleDeleteMembers,
        handleAddMember, handleSetWriter, handleTeamModalSave,
        showReportModal, reportTeamId,
        showModifyModal, setShowModifyModal,
        modifyName, setModifyName, modifyTarget, setModifyTarget,
        modifyMonth, setModifyMonth, modifyDay, setModifyDay,
        modifyHour, setModifyHour, modifyMinute, setModifyMinute,
        handleModifySave,
    };
};

export default useTeachDetail2Modals;
