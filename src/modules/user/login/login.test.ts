import { Connection } from 'typeorm';

import { invalidLoginMessage, pleaseConfirm } from './errorMessages';
import { User } from '../../../entity/User';
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { TestClient } from '../../../utils/TestClient';

const email = 'test@example.com';
const password = 'dummypass';

let conn: Connection | any;

describe('*** login test suite ***', () => {
    beforeAll(async () => {
        conn = await createTypeormConn();
    });

    afterAll(async () => {
        await conn.close();
    });
    it('email not found return error', async () => {
        const client = new TestClient(process.env.TEST_HOST as string);
        const response = await client.login('bob@bob.com', 'cool');

        expect(response.data).toEqual({ login: invalidLoginMessage });
    });

    it('should return email not confirmed', async () => {
        const client = new TestClient(process.env.TEST_HOST as string);

        await client.register(email, password);

        const loginUser = await client.login(email, password);

        expect(loginUser.data).toEqual({
            login: [{ path: 'email', message: pleaseConfirm }],
        });
    });

    it('should login', async () => {
        const client = new TestClient(process.env.TEST_HOST as string);
        await User.update({ confirmed: true }, { email });

        const loginUser = await client.login(email, password);
        expect(loginUser.data).toEqual({
            login: [{ path: 'email', message: pleaseConfirm }],
        });
    });

    it('should return bad password', async () => {
        const client = new TestClient(process.env.TEST_HOST as string);

        const { data: loginUser } = await client.login(email, 'ddd');

        expect(loginUser).toEqual({ login: invalidLoginMessage });
    });
});
