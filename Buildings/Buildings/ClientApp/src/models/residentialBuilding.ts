export interface IResidentialBuiding {
    name: string;
    address: string;
}

export const residentialBuildingInit: IResidentialBuiding = {
    name: "",
    address: ""
}

export interface INewResidentialBuiding {
    name: string;
    address: string;
    userName: string;
    adminPassword: string;
    firstName: string;
    lastName: string;
}

export const newResidentialBuildingInit: INewResidentialBuiding = {
    name: "",
    address: "",
    userName: "",
    adminPassword: "",
    firstName: "",
    lastName: ""
}