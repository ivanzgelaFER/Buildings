import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../../actions/authentificationActions";
import { AppState } from "../../store/configureStore";
import { RedirectIfLoggedIn } from "./RedirectIfLoggedIn";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import "./Login.css";

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginState = useSelector((state: AppState) => state.login);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialogDismissed, setDialogDismissed] = useState(false);
    const disabled = loginState.currentlySending;

    const handleKeyPress = (e: any) =>
        !disabled && (e.key === "Enter" || e.charCode === 13)
            ? dispatch(loginRequest({ username, password }))
            : null;

    const onSignUpCLick = () => {
        navigate("/sign-up");
    };

    return (
        <div className="login-container">
            <RedirectIfLoggedIn />
            <div className="center-login-container">
                <section className="login-form-container">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e: any) => setUsername(e.target.value)}
                            onKeyPress={(e: any) => handleKeyPress(e)}
                        />
                    </div>

                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-key"></i>
                        </span>
                        <Password
                            id="password"
                            type="password"
                            placeholder="Password"
                            toggleMask
                            feedback={false}
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                            onKeyPress={(e: any) => handleKeyPress(e)}
                        />
                    </div>
                    <Link className="forgot-pass" to="/forgot-password">
                        <i className="pi pi-lock"></i>Forgot password
                    </Link>
                    <p id="login-error-message">{loginState.error}</p>
                    <hr />
                    <Button
                        loading={loginState.currentlySending}
                        disabled={disabled}
                        onClick={() => {
                            dispatch(loginRequest({ username, password }));
                        }}
                        label="Log in"
                    />
                    <label id="sign-up-label">Don't have an account yet?</label>
                    <Button className="sign-up-button" onClick={onSignUpCLick} label="Sign up" />
                </section>
            </div>
            <Dialog
                header={"Your session has expired"}
                className="dialog-box"
                visible={loginState.expired && !dialogDismissed}
                draggable={false}
                onHide={() => setDialogDismissed(true)}
                closable={false}
                footer={<Button label="OK" onClick={() => setDialogDismissed(true)} autoFocus />}
            >
                <p>Your session has expired, please log in again</p>
            </Dialog>
        </div>
    );
};
