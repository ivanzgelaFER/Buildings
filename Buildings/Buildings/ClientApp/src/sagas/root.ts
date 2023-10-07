import { fork } from "redux-saga/effects";
import { loginFlow, logoutFlow, tokenExpiredFlow } from "./loginSaga";
import { resizeFlow } from "./resizeSaga";

export default function* root() {
    yield fork(loginFlow);
    yield fork(logoutFlow);
    yield fork(tokenExpiredFlow);
    yield fork(resizeFlow);
}