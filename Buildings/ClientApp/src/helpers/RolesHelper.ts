import { UserData, UserRole } from "../models/userData";

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