import { take } from "redux-saga/effects";
import { RESIZE } from "../actions/resizeActions";

export function* resizeFlow() {
    while (true) {
        const sizeString = localStorage.getItem("appSize") ?? "m";
        document.documentElement.className = sizeString;
        //@ts-ignore
        const request = yield take(RESIZE);
        localStorage.setItem("appSize", request.size)
    }
}

