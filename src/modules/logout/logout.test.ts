import { Connection } from 'typeorm';

import { User } from '../../entity/User';
import { createTypeormConn } from '../../utils/createTypeormConn';
import { TestClient } from '../../utils/TestClient';

let conn: Connection;
let userId: string;
const email = 'bob@gmail.com';
const password = 'fakePassword';

beforeAll(async () => {
    conn = await createTypeormConn();
    const user = await User.create({
        email,
        password,
        confirmed: true,
    }).save();

    userId = user.id;
});

afterAll(async () => {
    await conn.close();
});

describe('*** logout resolver test suite ***', () => {
    it('should login, query me, log out and fail query me', async () => {
        const client = new TestClient(process.env.TEST_HOST as string);

        await client.login(email, password);
        const meResponse = await client.me();

        expect(meResponse.data).toEqual({ me: { id: userId, email } });

        await client.logout();

        const nullMeQueryRes = await client.me();

        expect(nullMeQueryRes.errors[0].message).toBe('No cookie 🙁🍪');
    });
});
