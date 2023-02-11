import axios, { AxiosResponse } from "axios";
import { IChangePassword } from "../models/changePassword";

export const login = async (username: string, password: string) => {
    const res = await axios.post("/users/authenticate", { username, password });
    const user = await handleResponse(res);
    if (user.token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("loggedIn", JSON.stringify(true));
    }
    return user;
};

const handleResponse = async (res: AxiosResponse) => {
    const data = res.data;
    if (res.status !== 200) {
        if (res.status === 401) logout();
        if (res.status === 403) return Promise.reject("403");
        const error = (data && data.message) || res.statusText;
        return Promise.reject(error);
    }
    return data || res.status === 200;
};

export const logout = () => {
    localStorage.removeItem("user");
    localStorage.setItem("loggedIn", JSON.stringify(false));
    localStorage.setItem("language", "de");
};

/*
export const getUsers = async (params: AcontoQuery) => {
    const res = await axios.get("/users", { params: params });
    return res.data as IPaginationWrapper<UserData>;
};

export const getUsersByCompanyGuid = async (query: AcontoQuery, guid?: string) => {
    const response = await axios.get(`/users/companyUsers`, {
        params: { guid, ...query },
    });
    return response.data as IPaginationWrapper<UserData>;
};

export const getUser = async (guid: string) => {
    const response = await axios.get(`/users/${guid}`);
    return response.data as UserDetails;
};

export const getStaffAsProps = async () => {
    const res = await axios.get("/users/props");
    return res.data as StaffState[];
};
export const createUser = async (userDto: INewUser) => {
    const res = await axios.post("/users", userDto);
    return res.data as UserData;
};

export const editUser = async (userDto: UserDetails) => {
    return axios.patch(`/users/${userDto.guid}`, userDto);
};

export const deleteUser = async (guid: string) => {
    return axios.delete("/users/" + guid);
};*/

export const forgotPassword = async (username: string) => {
    return axios.post("/users/forgotPassword", username);
};

export const checkPasswordResetToken = async (token: string) => {
    return axios.get("/users/resetPassword", { params: { token: token } });
};

export const resetPassword = async (resetPasswordDto: any) => {
    console.log("1.korak")
    console.log(resetPasswordDto)
    return axios.post("/users/resetPassword", resetPasswordDto);
};

export const getChangePasswordToken = async () => {
    const res = await axios.get("/users/changePasswordToken");
    return res.data;
};

export const changeUserPassword = async (changePasswordDto: IChangePassword) => {
    const res = await axios.post("/users/changePassword", changePasswordDto);
    return res.data;
};