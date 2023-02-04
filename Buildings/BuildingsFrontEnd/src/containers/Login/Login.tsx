import "./Login.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store/configureStore";
import { loginRequest } from "../../actions/authentificationActions";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { RedirectIfLoggedIn } from "./RedirectIfLoggedIn";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export const Login = () => {
    const loginState = useSelector((state: AppState) => state.login);
    const disabled = loginState.currentlySending;
    const dispatch = useDispatch();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="login">
            <RedirectIfLoggedIn />
            <div className="login-container">
                <div>
                    <span className="p-float-label">
                        <InputText
                            id="username"
                            value={username}
                            onChange={e => setUserName(e.target.value)}
                        />
                        <label htmlFor="username">Username</label>
                    </span>
                </div>
                <div>
                    <span className="p-float-label">
                        <Password
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                            feedback={false}
                            toggleMask
                        />
                        <label htmlFor="password">Password</label>
                    </span>
                </div>
                {loginState.error && <p id="login-error-message">Incorrect input!</p>}
                <Button
                    loading={loginState.currentlySending}
                    disabled={disabled}
                    onClick={() => {
                        dispatch(loginRequest({ username, password }));
                    }}
                    label="Log in"
                />
            </div>
        </div>
    );
};
