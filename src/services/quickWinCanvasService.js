import { createWinCanvasService } from "./winCanvasService";

const service = createWinCanvasService("quick-win-canvas");

export const getQuickWinCanvas = service.get;
export const saveQuickWinCanvas = service.save;
export const submitQuickWinCanvas = service.submit;
