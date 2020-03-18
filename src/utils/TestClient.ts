import * as rpromise from 'request-promise';

export class TestClient {
    _url: string;
    _options: {
        withCredentials: boolean;
        jar: any;
        json: boolean;
    };
    constructor(url: string) {
        this._url = url;
        this._options = {
            withCredentials: true,
            jar: rpromise.jar(),
            json: true,
        };
    }

    async register(email: string, password: string) {
        return rpromise.post(this._url, {
            ...this._options,
            body: {
                query: `
                mutation {
                    register(email: "${email}", password: "${password}") {
                        path
                        message
                    }
                }`,
            },
        });
    }

    async login(email: string, password: string) {
        return rpromise.post(this._url, {
            ...this._options,
            body: {
                query: `
                mutation {
                    login(email: "${email}", password: "${password}") {
                        path
                        message
                    }
                }`,
            },
        });
    }

    async me() {
        return rpromise.post(this._url, {
            ...this._options,
            body: {
                query: `{
                    me {
                        id 
                        email
                    }
                }`,
            },
        });
    }

    async changePassword(newPassword: string, key: string) {
        return rpromise.post(this._url, {
            ...this._options,
            body: {
                query: `mutation {
                    changePassword(newPassword: "${newPassword}", key: "${key}") {
                        path
                        message
                    }
                }`,
            },
        });
    }

    async logout() {
        return rpromise.post(this._url, {
            ...this._options,
            body: {
                query: `
                    mutation { logout }
                `,
            },
        });
    }
}
