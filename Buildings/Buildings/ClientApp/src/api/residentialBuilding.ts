import { INewResidentialBuiding } from "../models/residentialBuilding";
import axios from "axios";

export const getResidentialBuildings = async () => {
    const res = await axios.get("/residentialbuilding")
}

export const createNewBuilding = async (newResidentialBuildingDto: INewResidentialBuiding) => {
    const res = await axios.post("/residentialbuilding", newResidentialBuildingDto)
    return res.data;
};