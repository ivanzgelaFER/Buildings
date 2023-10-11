import { useSelector } from "react-redux";
import { AppState } from "../../store/configureStore";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserDetails = () => {
    const user = useSelector((state: AppState) => state.user);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log(user);

    return (
        <BuildingContainer title="User details info">
            <div></div>
        </BuildingContainer>
    );
};
