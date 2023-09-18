import { useSelector } from "react-redux";
import { AppState } from "../../store/configureStore";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./HomePage.css";

export const HomePage = () => {
    const user = useSelector((state: AppState) => state.user);
    console.log(user);
    return (
        <BuildingContainer title="Home page">
            <DataTable>
                <Column></Column>
            </DataTable>
        </BuildingContainer>
    );
};
