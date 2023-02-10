import { initialState as user } from "../store/userReducer";
import { initialState as loginRedirectPath } from "../store/loginRedirectPathReducer";
import { AppState } from "../store/configureStore";
import { initialState as toastMessage } from "../store/toastMessageReducer";
import { initialState as appSize } from "../store/appSizeReducer";


export type ClearAppState = Omit<AppState, "login">;

export const getClearState: () => ClearAppState = () => {
    return {
        user,
        loginRedirectPath,
        toastMessage,
        appSize
    };
};
