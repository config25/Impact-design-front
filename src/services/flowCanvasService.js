import { createCanvasService } from "./canvasServiceFactory";

const buildBody = (goalCards, tacticalTables, strategicTables) => ({
    goals: goalCards.map((card, i) => ({
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
    })),
});

const service = createCanvasService("flow-canvas", buildBody);

export const getFlowCanvas = service.get;
export const saveFlowCanvas = service.save;
export const submitFlowCanvas = service.submit;
