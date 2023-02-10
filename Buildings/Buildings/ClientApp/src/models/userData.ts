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

export const UserHasRole = (user: UserData, role: UserRole): boolean => {
    return UserHasRoles(user, [role]);
};

export const UserHasRoles = (user: UserData, roles: UserRole[]): boolean => {
    if (user.roles) {
        return user.roles.some(value => roles.includes(value));
    } else {
        return false;
    }
};

export const UserDetailsHasRoles = (userRoles: UserRole[], roles: UserRole[]): boolean => {
    if (userRoles) {
        return userRoles.some(value => roles.includes(value));
    } else {
        return false;
    }
};
export enum Locale {
    en = 0,
    hr = 1,
}