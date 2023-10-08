import { ReactNode } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import "./BuildingContainer.css";

interface BuildingContainerProps {
    children: ReactNode;
    backAction?: () => void;
    headerItems?: ReactNode;
    title?: string;
    loading?: boolean;
    noPadding?: boolean;
    centered?: boolean;
    fullscreen?: boolean;
    className?: string;
}

export const BuildingContainer = ({
    children,
    backAction,
    headerItems,
    title,
    loading = false,
    noPadding = false,
    centered = false,
    fullscreen = false,
    className = "",
    ...props
}: BuildingContainerProps) => {
    return (
        <div className="building-container" {...props}>
            {(title || backAction || headerItems) && (
                <div className="building-container-header">
                    <Tooltip target=".building-container-back-icon"></Tooltip>
                    <i
                        data-pr-tooltip="Back"
                        className={`pi pi-angle-left ${
                            backAction ? "building-container-back-icon" : ""
                        }`}
                        onClick={backAction}
                    />
                    {title && <h2 className="building-container-title">{title}</h2>}
                    {headerItems && (
                        <div className="building-container-header-items">{headerItems}</div>
                    )}
                </div>
            )}
            <div
                className={classNames({
                    "building-container-content": true,
                    "no-padding": noPadding,
                    "centered-content": centered,
                    fullscreen: fullscreen,
                    [className]: className,
                })}
            >
                <div className="content">
                    {loading ? <ProgressSpinner className="fluid" strokeWidth="3" /> : children}
                </div>
            </div>
        </div>
    );
};
