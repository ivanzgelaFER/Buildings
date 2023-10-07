// This file contains the sagas used for async actions in our app. It's divided into
// "effects" that the sagas call (`authorize` and `logout`) and the actual sagas themselves,
// which listen for actions.

// Sagas help us gather all our side effects (network requests in this case) in one place
import { take, call, put, race, delay, select } from "redux-saga/effects";
import { login, logout } from "../api/users";
import axios from "axios";
import { isExpired } from "../helpers/JwtHelper";
import {
    SENDING_LOGIN_REQUEST,
    REQUEST_LOGIN_ERROR,
    LOGIN_REQUEST,
    LOGOUT,
    SET_AUTH,
    CLEAR_LOGIN_ERROR,
    SET_USER,
    LoginRequestData,
    CLEAR_REDUX
} from "../actions/authentificationActions";

function getErrorMessage(error: Error) {
    if (axios.isAxiosError(error)) {
        return error.response?.data;
      } else {
        return error.message;
      }
}


export function* authorize({ username, password }: LoginRequestData) {
    // We send an action that tells Redux we're sending a request
    yield put({ type: SENDING_LOGIN_REQUEST, sending: true });

    // We then try to register or log in the user, depending on the request
    try {
        let response;
        //@ts-ignore
        response = yield call(login, username, password);
        return response;
    } catch (error) {
        // If we get an error we send Redux the appropiate action and return
        yield put({ type: REQUEST_LOGIN_ERROR, error: getErrorMessage(error as Error) });
        return false;
    } finally {
        // When done, we tell Redux we're not in the middle of a request any more
        yield put({ type: SENDING_LOGIN_REQUEST, sending: false });
    }
}

/**
 * Log in saga
 */
export function* loginFlow() {
    // Because sagas are generators, doing `while (true)` doesn't block our program
    // Basically here we say "this saga is always listening for actions"
    while (true) {
        // And we're listening for `LOGIN_REQUEST` actions and destructuring its payload
        //@ts-ignore
        const request = yield take(LOGIN_REQUEST);
        const { username, password } = request.data;

        // A `LOGOUT` action may happen while the `authorize` effect is going on, which may
        // lead to a race condition. This is unlikely, but just in case, we call `race` which
        // returns the "winner", i.e. the one that finished first
        //@ts-ignore
        const winner = yield race({
            auth: call(authorize, { username, password }),
            logout: take(LOGOUT),
        });

        // If `authorize` was the winner...
        if (winner.auth) {
            const user = winner.auth;
            // ...we send Redux appropiate actions
            yield put({ type: SET_AUTH, newAuthState: true, loggingOut: false, expired: false }); // User is logged in (authorized) after being registered
            yield put({ type: CLEAR_LOGIN_ERROR });
            yield put({ type: SET_USER, user });
        }
    }
}

/**
 * Log out saga
 * This is basically the same as the `if (winner.logout)` of above, just written
 * as a saga that is always listening to `LOGOUT` actions
 */
export function* logoutFlow() {
    while (true) {
        yield take(LOGOUT);
        yield put({ type: SET_AUTH, newAuthState: false, loggingOut: true });
        yield put({ type: CLEAR_REDUX });
        yield call(logout);
    }
}

/**
 * Token expiration saga
 * Set loggedIn false if stored token has expired and set the expired flag
 */
 export function* tokenExpiredFlow() {
    while (true) {
        yield delay(30 * 1000);
        const token : string | undefined = yield select(state => state.user.token);

        if (token && isExpired(token)) {
            yield put({ type: SET_AUTH, newAuthState: false, loggingOut: false, expired: true });
        }
    }
}
