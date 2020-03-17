import { Connection } from 'typeorm';

import { User } from '../../entity/User';
import { createTypeormConn } from '../../utils/createTypeormConn';
import { TestClient } from '../../utils/TestClient';
import { noCookie } from '../user/errorMessage';

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

        expect(nullMeQueryRes.errors[0].message).toBe(noCookie);
    });

    test('multiple session on logout', async () => {
        // computer 1
        const sess1 = new TestClient(process.env.TEST_HOST as string);
        // computer 2
        const sess2 = new TestClient(process.env.TEST_HOST as string);

        await sess1.login(email, password);

        await sess2.login(email, password);

        expect(await sess1.me()).toEqual(await sess2.me());

        await sess1.logout();

        const { data } = await sess1.me();

        const { data: d2 } = await sess2.me();

        expect(data).toEqual(d2);
    });
});
