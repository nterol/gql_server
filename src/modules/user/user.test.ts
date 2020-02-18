import axios from 'axios';

import { User } from '../../entity/User';
import { createTypeormConn } from '../../utils/createTypeormConn';

const email = 'bob@gmail.com';
const password = 'fakePassword';

const loginMutation = (e: string, p: string) => `
mutation {
    login(email: "${e}", password: "${p}") {
        path
        message
    }
}`;

const meQuery = `{
    me {
        id 
        email
    }
}`;

beforeAll(async () => {
    await createTypeormConn();
    await User.create({
        email,
        password,
        confirmed: true,
    }).save();
});

describe('*** user resolvers test suite ***', () => {
    it('cannot get user if not logged in', async () => {});

    it('should return current user', async () => {
        await axios.post(
            process.env.TEST_HOST as string,
            {
                query: loginMutation(email, password),
            },
            { withCredentials: true },
        );

        const response = await axios.post(
            process.env.TEST_HOST as string,
            { query: meQuery },
            { withCredentials: true },
        );

        console.log('RESPONSE', response.data);

        expect(response.data.data).not.toEqual({ me: null });
    });
});
