import { useSelector } from "react-redux";
import { AppState } from "../../store/configureStore";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import "./HomePage.css";

export const HomePage = () => {
    const user = useSelector((state: AppState) => state.user);

    return (
        <BuildingContainer title="Residential building informations">
            <div>
                <h1>Name</h1>
                <h2>Address</h2>
            </div>
        </BuildingContainer>
    );
};
