import jwtDecode from 'jwt-decode'

interface TokenExp {
    exp: number;
}

export const getExpirationDate = (token: string) => {
    const decoded = jwtDecode<TokenExp>(token);
    return new Date(decoded.exp * 1000);
};

export const isExpired = (token?: string) => {
    if (!token) return true;
    const expDate = getExpirationDate(token);
    return new Date().getTime() > expDate.getTime();
};
