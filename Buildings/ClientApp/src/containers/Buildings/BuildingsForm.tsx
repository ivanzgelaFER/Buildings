import { useDispatch } from "react-redux";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { useNavigate } from "react-router-dom";
import { INewResidentialBuiding, residentialBuildingInit } from "../../models/residentialBuilding";
import { showToastMessage } from "../../actions/toastMessageActions";
import { createNewBuilding } from "../../api/residentialBuilding";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import "./Buildings.css";

export const BuildingsForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: INewResidentialBuiding) => {
        setLoading(true);
        try {
            await createNewBuilding(data);
            dispatch(showToastMessage("Residential building successfully created", "success"));
        } catch (error) {
            dispatch(showToastMessage("Unable to add new residential building", "error"));
        } finally {
            setLoading(false);
            navigate("*");
        }
    };

    return (
        <BuildingContainer title="Add new residential building" centered>
            <div className="residential-building-form-container add-form">
                <Form
                    onSubmit={onSubmit}
                    initialValues={residentialBuildingInit}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="form-container" autoComplete="off">
                            <Field
                                name="name"
                                render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="name" {...input} />
                                            <label htmlFor="name">Residential building name</label>
                                        </span>
                                    </div>
                                )}
                            />
                            <Field
                                name="address"
                                render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="address" {...input} />
                                            <label htmlFor="address">Address</label>
                                        </span>
                                    </div>
                                )}
                            />
                            <Field
                                name="firstName"
                                render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="firstName" {...input} />
                                            <label htmlFor="firstName">Admin first name</label>
                                        </span>
                                    </div>
                                )}
                            />
                            <Field
                                name="lastName"
                                render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="lastName" {...input} />
                                            <label htmlFor="lastName">Admin last name</label>
                                        </span>
                                    </div>
                                )}
                            />
                            <Field
                                name="userName"
                                render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="userName" {...input} />
                                            <label htmlFor="userName">Admin username</label>
                                        </span>
                                    </div>
                                )}
                            />
                            <Field
                                name="adminPassword"
                                render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Password id="adminPassword" {...input} />
                                            <label htmlFor="adminPassword">Admin password</label>
                                        </span>
                                    </div>
                                )}
                            />
                            <Button
                                type="submit"
                                label="Submit"
                                loading={loading}
                                disabled={loading}
                            />
                        </form>
                    )}
                />
            </div>
        </BuildingContainer>
    );
};
