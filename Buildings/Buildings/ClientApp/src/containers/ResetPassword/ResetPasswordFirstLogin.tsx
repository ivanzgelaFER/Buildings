import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPasswordRecoveryToken } from "../../actions/authentificationActions";
import { resetPassword } from "../../api/users";
import { AppState } from "../../store/configureStore";
import { useLocation, useNavigate } from "react-router-dom";
import { showToastMessage } from "../../actions/toastMessageActions";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { IChangePassword, initChangePassword } from "../../models/changePassword";
import { Field, FieldMetaState, Form } from "react-final-form";
import { classNames } from "primereact/utils";
import "./ResetPasswordFirstLogin.css";

export const ResetPasswordFirstLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state: AppState) => state.user);
    console.log(user);
    const [sendingRequest, setSendingRequest] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const validateChangePassword = (data: IChangePassword) => {
        const errors: any = {};
        if (!data.newPassword) errors.newPassword = "New password is required.";
        else if (
            //https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
            //password regex with our conditions
            !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*,.:;-]).{8,}$/.test(
                data.newPassword
            )
        )
            errors.newPassword = [
                "At least one lowercase",
                "At least one numeric",
                "At least one upercase",
                "Minimum 8 characters",
                "At least one special character",
            ].join("\r\n");
        if (!data.newPasswordRepeat) errors.newPasswordRepeat = "New password is required.";
        if (
            data.newPassword &&
            data.newPasswordRepeat &&
            data.newPassword !== data.newPasswordRepeat
        ) {
            errors.newPassword = "Passwords don't match";
            errors.newPasswordRepeat = "Passwords don't match";
        }
        return errors;
    };

    const checkPasswordFormValid = (meta: FieldMetaState<any>) => {
        return meta.submitFailed && meta.error;
    };

    const getChangePasswordFormMessage = (meta: FieldMetaState<any>) => {
        if (checkPasswordFormValid(meta)) {
            return (
                <div className="multiple-password-validation-errors">
                    {(meta.error as string).split("\n").map(error => (
                        <small className="p-error">{error}</small>
                    ))}
                </div>
            );
        }
    };

    const handleResetPassword = async (data: IChangePassword) => {
        setSendingRequest(true);
        try {
            await resetPassword({ token: user.passwordRecoveryToken, password: data.newPassword });
            dispatch(showToastMessage("Password successfully changed", "success"));
            dispatch(clearPasswordRecoveryToken());
            localStorage.setItem(
                "user",
                JSON.stringify({ ...user, passwordRecoveryToken: undefined })
            );
            navigate("/");
        } catch (err) {
            let message = "Error changing password";
            if (axios.isAxiosError(err)) {
                message = err.response?.data ?? err.message;
            }
            setErrorMessage(message);
        } finally {
            setSendingRequest(false);
        }
    };

    useEffect(() => {
        if (!!user.passwordRecoveryToken && location.pathname !== "/") navigate("/");
    }, [navigate, user.passwordRecoveryToken, location.pathname]);

    return (
        <Dialog
            onHide={() => {}}
            className="reset-password-modal"
            visible={
                user.passwordRecoveryToken !== undefined && user.passwordRecoveryToken !== null
            }
            draggable={false}
            resizable={false}
            closable={false}
            header="This is your first log in. Please change your password."
        >
            <Form
                id="change-password-form"
                onSubmit={data => handleResetPassword(data)}
                initialValues={initChangePassword}
                validate={validateChangePassword}
                validateOnBlur
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="form-container" autoComplete="off">
                        <Field
                            name="newPassword"
                            render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Password
                                            disabled={sendingRequest}
                                            toggleMask
                                            id="newPassword"
                                            {...input}
                                            className={classNames({
                                                "p-invalid": checkPasswordFormValid(meta),
                                            })}
                                        />
                                        <label
                                            htmlFor="newPassword"
                                            className={classNames({
                                                "p-error": checkPasswordFormValid(meta),
                                            })}
                                        >
                                            {"New password"}
                                            <span className="input-required">*</span>
                                        </label>
                                    </span>
                                    {getChangePasswordFormMessage(meta)}
                                </div>
                            )}
                        />

                        <Field
                            name="newPasswordRepeat"
                            render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Password
                                            disabled={sendingRequest}
                                            toggleMask
                                            id="newPasswordRepeat"
                                            {...input}
                                            className={classNames({
                                                "p-invalid": checkPasswordFormValid(meta),
                                            })}
                                        />
                                        <label
                                            htmlFor="newPasswordRepeat"
                                            className={classNames({
                                                "p-error": checkPasswordFormValid(meta),
                                            })}
                                        >
                                            {"New password"}
                                            <span className="input-required">*</span>
                                        </label>
                                    </span>
                                    {getChangePasswordFormMessage(meta)}
                                </div>
                            )}
                        />
                        <Button
                            className="initial-reset-password-submit-button"
                            label={"Submit"}
                            loading={sendingRequest}
                            icon="pi pi-check"
                            type="submit"
                        />
                    </form>
                )}
            />
        </Dialog>
    );
};
