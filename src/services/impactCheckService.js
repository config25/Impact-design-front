import { createCanvasService } from "./canvasServiceFactory";

const buildBody = (answers) => {
    const body = {};
    for (let i = 1; i <= 12; i++) {
        body[`q${i}Score`] = answers[i] ?? null;
    }
    body.q13Text = answers[13] || null;
    body.q14Text = answers[14] || null;
    body.q15Text = answers[15] || null;
    body.q16Text = answers[16] || null;
    return body;
};

const service = createCanvasService("impact-check", buildBody);

export const getImpactCheck = service.get;
export const saveImpactCheck = service.save;
export const submitImpactCheck = service.submit;
