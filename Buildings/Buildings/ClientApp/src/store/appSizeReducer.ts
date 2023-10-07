import { Reducer } from "redux";
import { RESIZE } from "../actions/resizeActions";
import { AppSize } from "../models/appSize";

export const initialState: AppSize = localStorage.getItem("appSize") as AppSize ?? "m";

export const appSizeReducer: Reducer<AppSize> = (
    state: AppSize = initialState,
    action: any
): AppSize => {
    switch (action.type) {
        case RESIZE:
            return action.size;
        default:
            return state;
    }
};


