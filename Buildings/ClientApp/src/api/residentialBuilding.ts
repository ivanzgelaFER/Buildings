import { INewResidentialBuiding, IResidentialBuiding } from "../models/residentialBuilding";
import axios from "axios";

export const getResidentialBuildings = async () => {
    const res = await axios.get("/residentialBuilding/all");
    return res.data;
}

export const getResidentialBuildingByGuid = async (guid: string) => {
    const res = await axios.get(`/residentialBuilding/${guid}`);
    return res.data;
}

export const createNewBuilding = async (newResidentialBuildingDto: INewResidentialBuiding) => {
    const res = await axios.post("/residentialBuilding", newResidentialBuildingDto);
    return res.data;
};

export const editResidentialBuilding = async (data: IResidentialBuiding) => {
    const response = await axios.patch("/residentialBuilding", data);
    return response.data as IResidentialBuiding;
};