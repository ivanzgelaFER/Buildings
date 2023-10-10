import { DataTable } from "primereact/datatable";
import { BuildingContainer } from "../BuildingContainer/BuildingContainer";
import { Column } from "primereact/column";
import { useCallback, useEffect, useState } from "react";
import { IResidentialBuiding } from "../../models/residentialBuilding";
import { getResidentialBuildings } from "../../api/residentialBuilding";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState } from "../../store/configureStore";
import { Button } from "primereact/button";
import { showToastMessage } from "../../actions/toastMessageActions";

const cols = [
    { field: "name", header: "Name", sortable: true },
    { field: "address", header: "Address", sortable: false },
];

export const Buildings = () => {
    const user = useSelector((state: AppState) => state.user);
    const dispatch = useDispatch();
    const [buildings, setBuildings] = useState<IResidentialBuiding[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const fetchBuildings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getResidentialBuildings();
            setBuildings(res);
        } catch (error) {
            dispatch(showToastMessage("Unable to fetch residential buildings", "error"));
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchBuildings();
    }, [fetchBuildings]);

    return (
        <BuildingContainer
            title={"List of registrated buildings"}
            loading={loading}
            headerItems={
                <Button
                    label="Add new"
                    icon="pi pi-plus"
                    onClick={() => navigate("/buildings/add")}
                />
            }
        >
            <DataTable
                value={buildings}
                emptyMessage={"No results yet"}
                onRowClick={row => navigate(`/buildings/${row.data.guid}`)}
            >
                {cols.map(col => {
                    return (
                        <Column
                            key={col.field}
                            field={col.field}
                            header={col.header}
                            sortable={col.sortable}
                        />
                    );
                })}
            </DataTable>
        </BuildingContainer>
    );
};
