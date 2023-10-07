import { INewResidentialBuiding } from "../models/residentialBuilding";
import axios from "axios";

export const getResidentialBuildings = async () => {
    const res = await axios.get("/ResidentialBuilding")
    return res.data
}

export const createNewBuilding = async (newResidentialBuildingDto: INewResidentialBuiding) => {
    const res = await axios.post("/ResidentialBuilding", newResidentialBuildingDto)
    return res.data;
};