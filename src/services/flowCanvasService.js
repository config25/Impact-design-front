import { API_BASE, authFetch } from "./apiConfig";

const BASE_URL = `${API_BASE}/flow-canvas`;

export const getFlowCanvas = async () => {
    const response = await authFetch(BASE_URL);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "조회에 실패했습니다." };
};

export const saveFlowCanvas = async (goalCards, tacticalTables, strategicTables) => {
    const goals = goalCards.map((card, i) => ({
        goalId: card.goalId || null,
        goalTitle: card.title || null,
        goalDescription: card.content || null,
        orderNo: i + 1,
        tacticals: tacticalTables[i].map((row, j) => ({
            metricId: row.metricId || null,
            tacticalMetric: row.indicator || null,
            tacticalGoal: row.target || null,
            orderNo: j + 1,
        })),
        strategicActivities: strategicTables[i].map((row, j) => ({
            activityId: row.activityId || null,
            activityMetric: row.indicator || null,
            interCriteria: row.target || null,
            orderNo: j + 1,
        })),
    }));

    const response = await authFetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals }),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "저장에 실패했습니다." };
};

export const submitFlowCanvas = async () => {
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
