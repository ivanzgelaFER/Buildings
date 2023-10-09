import { useParams } from "react-router-dom";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { showToastMessage } from "../../actions/toastMessageActions";
import { getResidentialBuildingByGuid } from "../../api/residentialBuilding";
import { IResidentialBuiding } from "../../models/residentialBuilding";
import { ProgressSpinner } from "primereact/progressspinner";
import { UserHasRole } from "../../helpers/RolesHelper";
import { UserRole } from "../../models/userData";
import { Button } from "primereact/button";
import { AppState } from "../../store/configureStore";
import { classNames } from "primereact/utils";

export const BuildingDetail = () => {
    const dispatch = useDispatch();
    const { guid } = useParams();
    const [loading, setLoading] = useState(false);
    const [buildingDetails, setBuildingDetails] = useState<IResidentialBuiding>();
    const user = useSelector((state: AppState) => state.user);
    const [editMode, setEditMode] = useState(false);

    const getResidentialBuildings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getResidentialBuildingByGuid(guid ?? "");
            setBuildingDetails(res);
        } catch (error) {
            dispatch(showToastMessage("Error while fetching company", "error"));
        } finally {
            setLoading(false);
        }
    }, [guid, dispatch]);

    useEffect(() => {
        getResidentialBuildings();
    }, [getResidentialBuildings]);

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
                                    //  onClick={setDeleteDialog}
                                />
                            )}
                            <Button
                                label={editMode ? "Cancle" : "Edit"}
                                onClick={() => {
                                    setEditMode(!editMode);
                                    //resetForm();
                                }}
                                className={classNames({
                                    "p-button-secondary": editMode,
                                })}
                                icon={editMode ? "pi pi-times" : "pi pi-pencil"}
                            />

                            {editMode && (
                                <Button
                                    label="Save changes"
                                    //disabled={hasError}
                                    className="p-button-success"
                                    onClick={() => {
                                        setEditMode(false);
                                        //submitFormWithId("company-details-form");
                                    }}
                                    icon="pi pi-save"
                                />
                            )}
                        </>
                    }
                >
                    <div></div>
                </BuildingContainer>
            )}
        </>
    );
};
