import { AxiosResponse } from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { showToastMessage } from "../../actions/toastMessageActions";
import "./DeleteConfirmationModal.css";

const transPlaceholder = "_ITEM_NAME_";

export interface IDeleteConfirmationModal {
    visible: boolean;
    guid: string;
    itemName: string;
    deleteEndpoint: (guid: string) => Promise<AxiosResponse | void> | void;
    handleClose: () => void;
    description?: string;
    callback?: () => void;
}

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export const DeleteConfirmationModal = ({
    visible,
    guid,
    itemName,
    deleteEndpoint,
    handleClose,
    description,
    callback,
}: IDeleteConfirmationModal) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = async (guid: string) => {
        setLoading(true);
        try {
            await deleteEndpoint(guid);
            const msg = `${transPlaceholder} successfully deleted`;
            dispatch(showToastMessage(capitalize(msg), "success"));
            callback && callback();
        } catch (error) {
            console.log(error);
            const msg = `Unable to delete ${transPlaceholder}`;
            dispatch(showToastMessage(capitalize(msg), "error"));
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    const header = useMemo(() => {
        const template = `Delete ${transPlaceholder}`;
        return template.replace(transPlaceholder, itemName.toLowerCase());
    }, [itemName]);

    const message = useMemo(() => {
        const template = `Are you sure you want to delete ${transPlaceholder}?`;
        return (
            <>
                {description && (
                    <>
                        {description}
                        <br />
                    </>
                )}
                {template.replace(transPlaceholder, itemName.toLowerCase())}
            </>
        );
    }, [itemName]);

    const renderFooter = () => {
        return (
            <>
                <Button
                    label={"No"}
                    icon="pi pi-times"
                    onClick={handleClose}
                    className="p-button-text"
                />
                <Button
                    label={"Yes"}
                    className="p-button-danger"
                    onClick={() => handleDelete(guid)}
                    autoFocus
                />
            </>
        );
    };

    return (
        <Dialog
            className="delete-confirm-modal"
            header={
                <>
                    <i className="pi pi-exclamation-triangle"></i>
                    {header}
                </>
            }
            visible={visible}
            onHide={handleClose}
            draggable={false}
            closable={false}
            footer={renderFooter()}
        >
            {loading ? <ProgressSpinner /> : message}
        </Dialog>
    );
};
