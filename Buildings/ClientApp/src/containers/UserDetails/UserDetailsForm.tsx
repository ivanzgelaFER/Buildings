import { useSelector } from "react-redux";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { AppState } from "../../store/configureStore";

export const UserDetailsForm = () => {
    //const user = useSelector((state: AppState) => state.user);

    return (
        <BuildingContainer title="Add new user" centered>
            <div></div>
        </BuildingContainer>
    );
};
