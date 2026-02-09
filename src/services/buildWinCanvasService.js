import { API_BASE, authFetch } from "./apiConfig";

const BASE_URL = `${API_BASE}/build-win-canvas`;

export const getBuildWinCanvas = async () => {
    const response = await authFetch(BASE_URL);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "조회에 실패했습니다." };
};

export const saveBuildWinCanvas = async ({ strategicGoal, taskName, taskContent, crisisSignal, painPoint, tableCells, teamwork, output, outcomes }) => {
    const taskInputs = tableCells.map((row, i) => ({
        resourceName: row[0] || null,
        quantity: row[1] ? Number(row[1]) : null,
        orderNo: i + 1,
    }));

    const taskActivities = tableCells.map((row, i) => ({
        processStep: row[2] || null,
        activityContent: row[3] || null,
        duration: row[4] || null,
        orderNo: i + 1,
    }));

    const taskOutcomes = [
        ...outcomes.qualitative.map((content, i) => ({
            outcomeType: "QUALITATIVE",
            outcomeContent: content || null,
            orderNo: i + 1,
        })),
        ...outcomes.quantitative.map((content, i) => ({
            outcomeType: "QUANTITATIVE",
            outcomeContent: content || null,
            orderNo: i + 4,
        })),
    ];

    const body = {
        strategicGoal: strategicGoal || null,
        taskName: taskName || null,
        taskDescription: taskContent || null,
        crisisSignal: crisisSignal || null,
        painTouchPoint: painPoint || null,
        taskInputs,
        taskActivities,
        teamwork: {
            activityTeamwork: teamwork || null,
            workType: output || null,
        },
        taskOutcomes,
    };

    const response = await authFetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "저장에 실패했습니다." };
};

export const submitBuildWinCanvas = async () => {
    const response = await authFetch(`${BASE_URL}/submit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    if (response.status === 409) {
        return { success: false, message: "이미 제출되었습니다." };
    }

    return { success: false, message: result.data?.message || "제출에 실패했습니다." };
};
