import { User } from '../../../entity/User';
import {
    duplicateEmail,
    wrongEmailLength,
    wrongEmailFormat,
    wrongPasswordLength,
} from './errorMessages';
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { Connection } from 'typeorm';
import { TestClient } from '../../../utils/TestClient';

const email = 'bob@gmail.com';
const password = 'bob';

let conn: Connection | any;

describe('*** register test suite ***', () => {
    beforeAll(async () => {
        conn = await createTypeormConn();
    });

    afterAll(async () => {
        await conn.close();
    });

    const client = new TestClient(process.env.TEST_HOST as string);

    it('should register a user', async () => {
        const { data: response } = await client.register(email, password);
        expect(response).toEqual({ register: null });

        const users = await User.find({ where: { email } });
        expect(users).toHaveLength(1);
        const [user] = users;
        expect(user.email).toEqual(email);
        expect(user.password).not.toEqual(password);
    });

    it('should not register duplicate email', async () => {
        const { data: response2 } = await client.register(email, password);
        expect(response2.register).toHaveLength(1);
        expect(response2.register[0]).toEqual({
            path: 'email',
            message: duplicateEmail,
        });
    });

    it('should not register user on wrong email', async () => {
        const { data: response3 } = await client.register('b', password);
        expect(response3.register).toHaveLength(2);
        expect(response3.register).toEqual([
            {
                path: 'email',
                message: wrongEmailLength,
            },
            {
                path: 'email',
                message: wrongEmailFormat,
            },
        ]);
    });

    it('should no register user on wrong password', async () => {
        const { data: response4 } = await client.register(email, 'b');
        expect(response4.register).toHaveLength(1);
        expect(response4.register).toEqual([
            {
                path: 'password',
                message: wrongPasswordLength,
            },
        ]);
    });

    it('should not register user on wrong email and password ', async () => {
        const { data: response4 } = await client.register('b', 'b');
        expect(response4.register).toHaveLength(3);
        expect(response4.register).toEqual([
            {
                path: 'email',
                message: wrongEmailLength,
            },
            {
                path: 'email',
                message: wrongEmailFormat,
            },
            {
                path: 'password',
                message: wrongPasswordLength,
            },
        ]);
    });
});
