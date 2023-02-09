import { AppSize } from "../models/appSize";

export const RESIZE = "RESIZE";

export const resizeApp = (size: AppSize) => {
    return { type: RESIZE, size };
};
