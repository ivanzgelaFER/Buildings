import { useSelector } from "react-redux";
import { AppState } from "../../store/configureStore";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./HomePage.css";

export const HomePage = () => {
    
    return (
        <BuildingContainer title="Home page">
            <DataTable>
                <Column></Column>
            </DataTable>
        </BuildingContainer>
    );
};
