import "./TableTemplate.css";
import { DataTable, DataTableProps } from "primereact/datatable";
import { Dispatch, ReactElement, SetStateAction } from "react";
import { Column, ColumnProps } from "primereact/column";

export interface TableProps
    extends Omit<
        DataTableProps,
        | "children"
        | "filters"
        | "first"
        | "paginator"
        | "lazy"
        | "value"
        | "sortField"
        | "sortOrder"
    > {
    value: any[];
    usePagination?: boolean;
    initialSortField?: string;
    //initialSortOrder?: DataTableSortOrderType;
    //querySetter?: Dispatch<SetStateAction<AcontoQuery>>;
    children?: ReactElement<TableColumnProps>[];
    selectedItems?: any[];
    selectedItemsSetter?: Dispatch<SetStateAction<any>>;
}

export interface TableColumnProps
    extends Omit<ColumnProps, "showFilterOperator" | "showAddButton"> {
    multiFilter?: boolean;
    showTime?: boolean;
    maxTextLength?: number;
    hideOnMobile?: boolean;
    hideOnComputer?: boolean;
}

export const TableColumn = ({ multiFilter = false, ...props }: TableColumnProps) => (
    <Column {...props} />
);

export const TableTemplate = ({
    initialSortField,
    dataKey = "guid",
    usePagination = true,
    totalRecords,
    rows = usePagination ? 15 : 0,
    onPage,
    onSort,
    onFilter,
    selectedItems,
    selectedItemsSetter,
    children = [],
    ...props
}: TableProps) => {
    return (
        <>
            <DataTable
                lazy
                dataKey={dataKey}
                rows={rows}
                paginator={usePagination}
                totalRecords={usePagination ? totalRecords : undefined}
                emptyMessage={"No result found"}
                size={props.size ?? "small"}
                {...props}
            >
                {children.map((c, i) =>
                    c.type === TableColumn ? <Column {...c.props} key={i} /> : c
                )}
            </DataTable>
        </>
    );
};
