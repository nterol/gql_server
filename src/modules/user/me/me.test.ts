import { User } from '../../../entity/User';
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { Connection } from 'typeorm';
import { TestClient } from '../../../utils/TestClient';
import { noCookie } from './errorMessage';

const email = 'bob@gmail.com';
const password = 'fakePassword';
let conn: Connection;
let userId: string;

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
    await conn.close;
});

describe('*** user resolvers test suite ***', () => {
    it('should return null if not user', async () => {
        const client = new TestClient(process.env.TEST_HOST as string);
        const response = await client.me();

        expect(response.errors[0].message).toBe(noCookie);
    });

    it('should return current user', async () => {
        const client = new TestClient(process.env.TEST_HOST as string);
        await client.login(email, password);

        const response = await client.me();

        expect(response.data).toEqual({ me: { id: userId, email } });
    });
});
