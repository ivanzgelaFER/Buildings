import { useSelector } from "react-redux";
import { AppState } from "../../store/configureStore";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { TableTemplate } from "../TableTemplate/TableTemplate";
import "./HomePage.css";

export const HomePage = () => {
    const user = useSelector((state: AppState) => state.user);

    return (
        <BuildingContainer title="Residential building informations">
            <TableTemplate value={[]}></TableTemplate>
        </BuildingContainer>
    );
};
