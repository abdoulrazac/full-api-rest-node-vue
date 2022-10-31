export const getLocalToken = () => localStorage.getItem('token');

export const saveLocalToken = (token: string) => localStorage.setItem('token', token);

export const removeLocalToken = () => localStorage.removeItem('token');

export const authHeadersBasic = (username: string, password: string) => {
    let basicAuth = btoa(`${username}:${password}`)
    return {
        headers: {
            Authorization: `Basic ${basicAuth}`,
        },
    };
};

export const authHeaders = (token: string) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}