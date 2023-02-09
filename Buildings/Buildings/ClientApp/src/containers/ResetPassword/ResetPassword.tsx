import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { RedirectIfLoggedIn } from "../Login/RedirectIfLoggedIn";
import { checkPasswordResetToken, resetPassword } from "../../api/users";
import "../Login/Login.css";

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [repeatedPassword, setRepeatedPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [validToken, setValidToken] = useState(false);
    const [recoveryToken, setRecoveryToken] = useState("");
    const location: any = useLocation();
    const [success, setSuccess] = useState(false);
    const [sendingRequest, setSendingRequest] = useState(false);
    const disabled = password.length === 0 || repeatedPassword.length === 0 || sendingRequest;

    const handleCheckResetPasswordToken = async (token: string) => {
        try {
            setRecoveryToken(token);
            await checkPasswordResetToken(token);
            setValidToken(true);
        } catch {}
    };

    const handleResetPassword = async () => {
        setSendingRequest(true);
        try {
            await resetPassword({ token: recoveryToken, password });
            setSuccess(true);
        } catch (err) {
            let message = "Error changing password"
            if (axios.isAxiosError(err)) {
                message = err.response?.data ?? err.message;
            }
            setErrorMessage(message);
        } finally {
            setSendingRequest(false);
        }
    };

    useEffect(() => {
        handleCheckResetPasswordToken(location.search.split("=")[1] ?? "");
    }, [location.search]);

    useEffect(() => {
        if (password !== "" && repeatedPassword !== "" && password !== repeatedPassword)
            setErrorMessage("Passwords don't match.");
        else setErrorMessage("");
    }, [password, repeatedPassword]);

    return (
        <div className="login-container">
            <RedirectIfLoggedIn />
            <div className="center-login-container">
                <section className="login-form-container">
                    {success ? (
                        <>
                            <p>
                                Password successfully reset. Try logging in with your new password.
                            </p>
                            <Button
                                onClick={() => navigate("/login")}
                                label="Back to log in page"
                            />
                        </>
                    ) : validToken ? (
                        <>
                            <h2 id="centered-text">Reset password</h2>

                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password
                                    id="password"
                                    placeholder="New password"
                                    toggleMask
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>

                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password
                                    id="repeated-password"
                                    placeholder="Repeated new password"
                                    toggleMask
                                    feedback={false}
                                    value={repeatedPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setRepeatedPassword(e.target.value)
                                    }
                                />
                            </div>

                            <p id="login-error-message">{errorMessage}</p>

                            <hr />
                            <Button
                                loading={sendingRequest}
                                disabled={disabled}
                                label="Reset password"
                                onClick={handleResetPassword}
                            />
                        </>
                    ) : (
                        <p id="login-error-message">
                            Password reset token has expired or is invalid. Please try resetting
                            your password again.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
};
