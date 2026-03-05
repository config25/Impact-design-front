import { createCanvasService } from "./canvasServiceFactory";

const buildBody = ({ strategicGoal, taskName, taskContent, crisisSignal, painPoint, tableCells, teamwork, output, outcomes }) => {
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

    return {
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
};

export const createWinCanvasService = (endpoint) => createCanvasService(endpoint, buildBody);
