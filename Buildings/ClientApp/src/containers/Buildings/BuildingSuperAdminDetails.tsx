import { useCallback, useEffect, useState } from "react";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getResidentialBuildingByGuid } from "../../api/residentialBuilding";
import { showToastMessage } from "../../actions/toastMessageActions";
import { residentialBuildingInit } from "../../models/residentialBuilding";
import { BuildingDetails } from "./BuildingDetails";

export const BuildingSuperAdminDetails = () => {
    const dispatch = useDispatch();
    const { guid } = useParams();
    const [loading, setLoading] = useState(false);
    const [buildingDetails, setBuildingDetails] = useState(residentialBuildingInit);
    const [deleteDialog, setDeleteDialog] = useState(false);

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
                    setBuildingDetails={setBuildingDetails}
                    loading={loading}
                    setLoading={setLoading}
                    getResidentialBuilding={getResidentialBuilding}
                    setDeleteDialog={() => setDeleteDialog(true)}
                />
            )}
        </BuildingContainer>
    );
};
