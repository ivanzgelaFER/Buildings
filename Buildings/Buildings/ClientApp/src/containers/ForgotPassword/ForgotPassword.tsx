import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { RedirectIfLoggedIn } from "../Login/RedirectIfLoggedIn";
import { forgotPassword } from "../../api/users";
import "../Login/Login.css";

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [success, setSuccess] = useState(false);
    const [sendingRequest, setSendingRequest] = useState(false);
    const disabled = username.length === 0 || sendingRequest;

    const handleSendForgotPassword = async () => {
        setSendingRequest(true);
        try {
            await forgotPassword(username);
            setSuccess(true);
        } catch {
        } finally {
            setSendingRequest(false);
        }
    };

    return (
        <div className="login-container">
            <RedirectIfLoggedIn />
            <div className="center-login-container">
                <section className="login-form-container">
                    {success ? (
                        <>
                            <p>
                                We have sent you an email with instructions how to reset your
                                password.
                            </p>
                            <Button
                                label="Back to login"
                                onClick={() => navigate("/")}
                            />
                        </>
                    ) : (
                        <>
                            <h2 id="centered-text">Forgot password</h2>
                            <p>
                                Enter your email address and we'll send you an email with
                                instructions how to reset your password.
                            </p>

                            <div className="p-inputgroup">
                                <InputText
                                    id="username"
                                    value={username}
                                    onChange={(e: any) => setUsername(e.target.value)}
                                />
                            </div>
                            <hr />
                            <Button
                                loading={sendingRequest}
                                disabled={disabled}
                                label="Send password reset email"
                                onClick={handleSendForgotPassword}
                            />
                            <Button
                                className="p-button-secondary"
                                label="Back to login"
                                onClick={() => navigate("/")}
                            />
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};
