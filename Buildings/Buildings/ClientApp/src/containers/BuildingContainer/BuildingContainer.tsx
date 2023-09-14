import { ReactNode } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
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
            {title && (
                <div>
                    <h2>{title}</h2>
                </div>
            )}
            <div>
                <div>{loading ? <ProgressSpinner /> : children}</div>
            </div>
        </div>
    );
};
