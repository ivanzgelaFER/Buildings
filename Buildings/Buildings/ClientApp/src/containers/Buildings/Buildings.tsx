import { DataTable } from "primereact/datatable";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { Column } from "primereact/column";
import { useState } from "react";
import { IResidentialBuiding } from "../../models/residentialBuilding";

export const Buildings = () => {
    const [buildings, setBuildings] = useState<IResidentialBuiding[]>([]);

    return (
        <BuildingContainer>
            <DataTable>
                <Column></Column>
            </DataTable>
        </BuildingContainer>
    );
};
