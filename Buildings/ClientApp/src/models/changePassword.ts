export interface IChangePassword {
    token: string;
    password: string;
    newPassword: string;
    newPasswordRepeat: string;
}

export const initChangePassword: IChangePassword = {
    token: "",
    password: "",
    newPassword: "",
    newPasswordRepeat: "",
};
