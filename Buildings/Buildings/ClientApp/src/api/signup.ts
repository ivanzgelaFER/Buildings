import axios from "axios";
import { ISignup } from "../models/signup";

export const submitSignupRequest = async (signupForm: ISignup) => {
    return axios.post("/signup/", signupForm);
};
