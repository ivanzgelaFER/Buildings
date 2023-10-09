import { ReactNode, Dispatch, SetStateAction } from "react";
import { FieldInputProps, FieldProps, FieldMetaState, Field } from "react-final-form";
import { useSelector } from "react-redux";
import { UserRole } from "../models/userData";
import { AppState } from "../store/configureStore";
import { UserHasRoles } from "./RolesHelper";

export const submitFormWithId = (id: string) => {
    const formElement = document.getElementById(id);
    if (formElement) {
        formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
};

type IFieldOrDisplayProps = {
    editMode: boolean;
    name: string;
    fieldRender: (input: FieldInputProps<any>, hasError?: boolean) => ReactNode;
    displayRender: ReactNode;
    roles?: UserRole[];
    editUserGuid?: string;
    onChangeAdditional?: Dispatch<SetStateAction<any>>;
} & FieldProps<any, any>;

const isFormFieldValid = (meta: FieldMetaState<any>) => {
    return meta.touched && meta.error;
};

const getFormErrorMessage = (meta: FieldMetaState<any>) => {
    return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
};

export const FieldOrDisplay = ({
    editMode,
    name,
    fieldRender,
    displayRender,
    roles,
    editUserGuid,
    onChangeAdditional,
    ...props
}: IFieldOrDisplayProps) => {
    const user = useSelector((state: AppState) => state.user);

    const canEdit = () => {
        if (roles && UserHasRoles(user, roles)) {
            return true;
        } else if (editUserGuid) {
            return user.guid === editUserGuid;
        } else {
            return !roles;
        }
    };

    return (
        <>
            {editMode && canEdit() ? (
                <Field
                    {...props}
                    name={name}
                    render={({ input, meta }) => (
                        <>
                            {fieldRender(
                                onChangeAdditional
                                    ? {
                                          ...input,
                                          onChange: e => {
                                              input.onChange(e);
                                              onChangeAdditional(e);
                                          },
                                      }
                                    : input,
                                isFormFieldValid(meta)
                            )}
                            {getFormErrorMessage(meta)}
                        </>
                    )}
                />
            ) : (
                displayRender
            )}
        </>
    );
};
