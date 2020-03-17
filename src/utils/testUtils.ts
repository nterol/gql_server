export const loginMutation = (e: string, p: string) => `
mutation {
    login(email: "${e}", password: "${p}") {
        path
        message
    }
}`;

export const meQuery = `{
    me {
        id 
        email
    }
}`;
