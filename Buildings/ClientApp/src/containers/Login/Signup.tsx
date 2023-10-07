import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { signupInit } from "../../models/signup";
import { submitSignupRequest } from "../../api/signup";
import { useDispatch } from "react-redux";
import { showToastMessage } from "../../actions/toastMessageActions";

export const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [signupForm, setSignupForm] = useState(signupInit);

    const disabled = () => {
        return (
            signupForm.firstName.length === 0 ||
            signupForm.lastName.length === 0 ||
            signupForm.email.length === 0
        );
    };

    const onSignUpCLick = async () => {
        try {
            await submitSignupRequest(signupForm);
            dispatch(showToastMessage("Success! Check your inbox!", "success"));
        } catch (error) {
            dispatch(showToastMessage("Error while submitting your request.", "error"));
        } finally {
            navigate("/login");
        }
    };

    const onChange = (e: any) => {
        setSignupForm({ ...signupForm, [e.target.id]: e.target.value });
    };

    return (
        <div className="login-container">
            <div className="center-login-container">
                <section className="login-form-container">
                    <div id="login-logo-container">
                        <h2>Business administration made easy</h2>
                    </div>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText
                            id="firstName"
                            placeholder="First name"
                            value={signupForm.firstName}
                            onChange={onChange}
                        />
                    </div>

                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText
                            id="lastName"
                            placeholder="Last name"
                            value={signupForm.lastName}
                            onChange={onChange}
                        />
                    </div>

                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-envelope"></i>
                        </span>
                        <InputText
                            id="email"
                            placeholder="Email"
                            value={signupForm.email}
                            onChange={onChange}
                        />
                    </div>
                    {/*
                    <div className="p-inputgroup last-signup-element">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-home"></i>
                        </span>
                        <InputText
                            id="companyName"
                            placeholder="Company name"
                            value={signupForm.companyName}
                            onChange={onChange}
                        />
                    </div>
                    */}
                    <hr />
                    <Button
                        className="sign-up-button"
                        disabled={disabled()}
                        onClick={onSignUpCLick}
                        label="Sign up"
                    />
                </section>
            </div>
        </div>
    );
};
