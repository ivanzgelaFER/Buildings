import { Reducer } from "redux";

import {
    SET_USER,
    AuthentificationActionType,
    CLEAR_PASSWORD_RECOVERY_TOKEN,
} from "../actions/authentificationActions";
import { isExpired } from "../helpers/JwtHelper";
import {  UserData } from "../models/userData";

const getSavedState = () => {
    const stateStr = localStorage.getItem("user");
    if (stateStr) {
        const state : UserData = JSON.parse(stateStr);
        return isExpired(state.token) ? null : state;
    } else {
        return null;
    }
}

const savedState: UserData | null = getSavedState();

export const initialState: UserData = {
    guid: undefined,
    userName: undefined,
    firstName: undefined,
    lastName: undefined,
    token: undefined,
    roles: undefined,
};

export const userReducer: Reducer<UserData> = (
    state: UserData = savedState || initialState,
    action: AuthentificationActionType
): UserData => {
    switch (action.type) {
        case SET_USER:
            return { ...action.user };
        case CLEAR_PASSWORD_RECOVERY_TOKEN:
            return { ...state, passwordRecoveryToken: undefined };
        default:
            return state;
    }
};

export default userReducer;
