import { useSelector } from "react-redux";
import { AppState } from "../../store/configureStore";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { TableTemplate } from "../TableTemplate/TableTemplate";
import "./HomePage.css";
import { UserHasRole } from "../../helpers/RolesHelper";
import { UserRole } from "../../models/userData";

export const HomePage = () => {
    const user = useSelector((state: AppState) => state.user);
    console.log(user);
    return (
        <>
            {UserHasRole(user, UserRole.SuperAdmin) && <div>Only for super admin</div>}
            <BuildingContainer title="Residential building informations">
                <TableTemplate value={[]}></TableTemplate>
            </BuildingContainer>
        </>
    );
};
