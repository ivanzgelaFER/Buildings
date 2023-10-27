import { useLocation } from "react-router-dom";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { showToastMessage } from "../../actions/toastMessageActions";
import { editResidentialBuilding } from "../../api/residentialBuilding";
import { IResidentialBuiding } from "../../models/residentialBuilding";
import { ProgressSpinner } from "primereact/progressspinner";
import { UserHasRole } from "../../helpers/RolesHelper";
import { UserRole } from "../../models/userData";
import { Button } from "primereact/button";
import { AppState } from "../../store/configureStore";
import { classNames } from "primereact/utils";
import { Form } from "react-final-form";
import { FieldOrDisplay, submitFormWithId } from "../../helpers/FormsHelper";
import { InputText } from "primereact/inputtext";

interface Props {
    buildingDetails: IResidentialBuiding;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    getResidentialBuilding: () => Promise<void>;
    setDeleteDialog?: () => void;
}

export const BuildingDetails = ({
    buildingDetails,
    loading,
    setLoading,
    getResidentialBuilding,
    setDeleteDialog,
}: Props) => {
    const user = useSelector((state: AppState) => state.user);
    const location = useLocation();
    const [editMode, setEditMode] = useState(location.pathname.endsWith("edit"));
    const dispatch = useDispatch();

    let resetForm = () => {};

    const onSubmit = useCallback(
        async (data: IResidentialBuiding) => {
            setLoading(true);
            try {
                await editResidentialBuilding(data);
                await getResidentialBuilding();
                dispatch(showToastMessage("Changes saved successfully", "success"));
            } catch (error) {
                dispatch(showToastMessage("Error while saving changes", "error"));
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    return (
        <>
            {loading ? (
                <ProgressSpinner />
            ) : (
                <BuildingContainer
                    title="Residential building details"
                    loading={loading}
                    headerItems={
                        <>
                            {UserHasRole(user, UserRole.SuperAdmin) && (
                                <Button
                                    label="Delete"
                                    className="p-button-danger"
                                    onClick={setDeleteDialog}
                                />
                            )}
                            <Button
                                label={editMode ? "Cancle" : "Edit"}
                                onClick={() => {
                                    setEditMode(!editMode);
                                    resetForm();
                                }}
                                className={classNames({
                                    "p-button-secondary": editMode,
                                })}
                                icon={editMode ? "pi pi-times" : "pi pi-pencil"}
                            />

                            {editMode && (
                                <Button
                                    label="Save changes"
                                    className="p-button-success"
                                    onClick={() => {
                                        setEditMode(false);
                                        submitFormWithId("building-details-form");
                                    }}
                                    icon="pi pi-save"
                                />
                            )}
                        </>
                    }
                >
                    <Form onSubmit={onSubmit} initialValues={buildingDetails}>
                        {({ handleSubmit, form }) => {
                            resetForm = form.reset;
                            return (
                                <form
                                    id="building-details-form"
                                    onSubmit={handleSubmit}
                                    autoComplete="off"
                                >
                                    <table className="dataview">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    <strong>Name</strong>
                                                </th>
                                                <td>
                                                    <FieldOrDisplay
                                                        editMode={editMode}
                                                        name="name"
                                                        roles={[
                                                            UserRole.Admin,
                                                            UserRole.SuperAdmin,
                                                        ]}
                                                        fieldRender={(input, hasErrors) => (
                                                            <InputText
                                                                className={classNames({
                                                                    "p-invalid": hasErrors,
                                                                })}
                                                                {...input}
                                                            />
                                                        )}
                                                        displayRender={
                                                            <span>{buildingDetails.name}</span>
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <strong>Address</strong>
                                                </th>
                                                <td>
                                                    <FieldOrDisplay
                                                        editMode={editMode}
                                                        name="address"
                                                        roles={[
                                                            UserRole.Admin,
                                                            UserRole.SuperAdmin,
                                                        ]}
                                                        fieldRender={(input, hasErrors) => (
                                                            <InputText
                                                                className={classNames({
                                                                    "p-invalid": hasErrors,
                                                                })}
                                                                {...input}
                                                            />
                                                        )}
                                                        displayRender={
                                                            <span>{buildingDetails.address}</span>
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
                            );
                        }}
                    </Form>
                </BuildingContainer>
            )}
        </>
    );
};
