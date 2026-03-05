import { createCanvasService } from "./canvasServiceFactory";

const service = createCanvasService("identity-canvas");

export const getIdentityCanvas = service.get;
export const saveIdentityCanvas = service.save;
export const submitIdentityCanvas = service.submit;
