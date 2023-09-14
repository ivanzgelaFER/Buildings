import { INewResidentialBuiding } from "../models/residentialBuilding";
import axios from "axios";

export const createUser = async (newResidentialBuildingDto: INewResidentialBuiding) => {
    const res = await axios.post("/residentialbuilding", newResidentialBuildingDto)
    return res.data;
};