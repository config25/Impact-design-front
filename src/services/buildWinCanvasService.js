import { createWinCanvasService } from "./winCanvasService";

const service = createWinCanvasService("build-win-canvas");

export const getBuildWinCanvas = service.get;
export const saveBuildWinCanvas = service.save;
export const submitBuildWinCanvas = service.submit;
