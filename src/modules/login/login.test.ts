import { request } from 'graphql-request';
import { invalidLoginMessage, pleaseConfirm } from './errorMessages';
import { User } from '../../entity/User';
import { createTypeormConn } from '../../utils/createTypeormConn';

const email = 'test@example.com';
const password = 'dummypass';

const registerMutation = (e: string, p: string) => `
mutation {
    register(email: "${e}", password: "${p}") {
        path
        message
    }
}`;

const loginMutation = (e: string, p: string) => `
mutation {
    login(email: "${e}", password: "${p}") {
        path
        message
    }
}`;

describe('*** login test suite ***', () => {
    beforeAll(async () => {
        await createTypeormConn();
    });
    it('email not found return error', async () => {
        const response = await request(
            process.env.TEST_HOST as string,
            loginMutation('bob@bob.com', 'cool'),
        );

        expect(response).toEqual({ login: invalidLoginMessage });
    });

    it('should return email not confirmed', async () => {
        await request(
            process.env.TEST_HOST as string,
            registerMutation(email, password),
        );

        const loginUser = await request(
            process.env.TEST_HOST as string,
            loginMutation(email, password),
        );

        expect(loginUser).toEqual({
            login: [{ path: 'email', message: pleaseConfirm }],
        });
    });

    it('should login', async () => {
        await User.update({ confirmed: true }, { email });

        const loginUser = await request(
            process.env.TEST_HOST as string,
            loginMutation(email, password),
        );

        console.log(loginUser);

        expect(loginUser).toEqual({
            login: [{ path: 'email', message: pleaseConfirm }],
        });
    });

    it('should return bad password', async () => {
        const loginUser = await request(
            process.env.TEST_HOST as string,
            loginMutation(email, 'ddd'),
        );

        expect(loginUser).toEqual({ login: invalidLoginMessage });
    });
});
