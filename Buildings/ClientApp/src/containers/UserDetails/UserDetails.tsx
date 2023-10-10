import { useSelector } from "react-redux";
import { AppState } from "../../store/configureStore";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";

export const UserDetails = () => {
    const user = useSelector((state: AppState) => state.user);
    console.log(user);

    return (
        <BuildingContainer title="User details info">
            <div></div>
        </BuildingContainer>
    );
};
