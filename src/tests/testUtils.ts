// src/tests/testUtils.ts
let globalToken: string;

export const setToken = (token: string) => {
    globalToken = token;
};

export const getToken = () => {
    if (!globalToken) {
        throw new Error("Global token is not set yet!");
    }
    return globalToken;
};
