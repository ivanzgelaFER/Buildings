import { useCallback, useEffect, useState } from "react";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    deleteResidentialBuilding,
    getResidentialBuildingByGuid,
} from "../../api/residentialBuilding";
import { showToastMessage } from "../../actions/toastMessageActions";
import { residentialBuildingInit } from "../../models/residentialBuilding";
import { BuildingDetails } from "./BuildingDetails";
import { DeleteConfirmationModal } from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";

export const BuildingSuperAdminDetails = () => {
    const dispatch = useDispatch();
    const { guid } = useParams();
    const [loading, setLoading] = useState(false);
    const [buildingDetails, setBuildingDetails] = useState(residentialBuildingInit);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const navigate = useNavigate();

    const getResidentialBuilding = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getResidentialBuildingByGuid(guid ?? "");
            setBuildingDetails(res);
        } catch (error) {
            dispatch(showToastMessage("Error while fetching residential building", "error"));
        } finally {
            setLoading(false);
        }
    }, [guid, dispatch]);

    useEffect(() => {
        getResidentialBuilding();
    }, [getResidentialBuilding]);

    return (
        <BuildingContainer>
            {buildingDetails && (
                <BuildingDetails
                    buildingDetails={buildingDetails}
                    loading={loading}
                    setLoading={setLoading}
                    getResidentialBuilding={getResidentialBuilding}
                    setDeleteDialog={() => setDeleteDialog(true)} //when an event or action occurs in the child component, this trigger the display of a delete confirmation dialog and this function will be called
                />
            )}
            <DeleteConfirmationModal
                guid={buildingDetails.guid ?? ""}
                itemName={buildingDetails.name}
                description="All users within this building will be deleted. Are you sure you want to delete this building?"
                visible={deleteDialog}
                handleClose={() => setDeleteDialog(false)}
                deleteEndpoint={deleteResidentialBuilding}
                callback={() => navigate("/buildings/all")}
            />
        </BuildingContainer>
    );
};
