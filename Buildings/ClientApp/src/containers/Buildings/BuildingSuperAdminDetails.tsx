import { useCallback, useEffect, useState } from "react";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getResidentialBuildingByGuid } from "../../api/residentialBuilding";
import { showToastMessage } from "../../actions/toastMessageActions";
import { IResidentialBuiding } from "../../models/residentialBuilding";
import { BuildingDetail } from "./BuildingDetail";

export const BuildingSuperAdminDetails = () => {
    const dispatch = useDispatch();
    const { guid } = useParams();
    const [loading, setLoading] = useState(false);
    const [buildingDetails, setBuildingDetails] = useState<IResidentialBuiding>();

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
        <BuildingContainer title="Residential building super admin details">
            {buildingDetails && <BuildingDetail />}
        </BuildingContainer>
    );
};
