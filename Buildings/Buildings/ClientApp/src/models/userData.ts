export interface UserData {
    guid?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
    roles?: UserRole[];
    token?: string;
    passwordRecoveryToken?: string;
}

export enum UserRole {
    Admin = "Admin",
    SuperAdmin = "SuperAdmin",
    Tenant = "Tenant",
}

export enum Locale {
    en = 0,
    hr = 1,
}