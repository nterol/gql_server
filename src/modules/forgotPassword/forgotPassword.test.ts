import * as Redis from 'ioredis';
import { Connection } from 'typeorm';

import { createTypeormConn } from '../../utils/createTypeormConn';
import { User } from '../../entity/User';
import { TestClient } from '../../utils/TestClient';
import { createForgotPasswordLink } from '../../utils/createForgotPasswordLink';
import { invalidLogin, accountIsLocked } from '../login/errorMessages';
import { lockUserAccount } from '../../utils/lockUserAccount';
import { expiredLink } from './errorMessage';
import { wrongEmailLength } from '../register/errorMessages';

const redis = new Redis();
let conn: Connection;
let email = 'tsx@yopmail.com';
const password = 'cegenredepasswordmamene';
let newPassword = 'cegenredenouveaupassword';
let userId: string;

describe('forgot password test suite', () => {
    beforeAll(async () => {
        conn = await createTypeormConn();
        const user = await User.create({
            email,
            password,
            confirmed: true,
        }).save();
        userId = user.id;
    });

    afterEach(async () => {
        const user = await User.findOne({ where: { email } });
        if (user && user.accountLocked) {
            await User.update({ email }, { accountLocked: false });
        }
    });

    afterAll(() => {
        conn.close();
    });
    const client = new TestClient(process.env.TEST_HOST as string);
    it('should test forgot password sequence', async () => {
        await lockUserAccount(userId, redis);

        expect(await client.login(email, password)).toEqual({
            data: { login: [{ path: 'email', message: accountIsLocked }] },
        });

        const link = await createForgotPasswordLink('', userId, redis);

        const parts = link.split('/');
        const key = parts[parts.length - 1];

        const response = await client.changePassword(newPassword, key);

        expect(response.data).toEqual({ changePassword: null });

        expect(await client.login(email, password)).toEqual({
            data: { login: [{ message: invalidLogin, path: 'login' }] },
        });

        expect(await client.login(email, newPassword)).toEqual({
            data: { login: null },
        });
    });

    it('should test wrong new password format', async () => {
        newPassword = 'a';
        await lockUserAccount(userId, redis);
        const link = await createForgotPasswordLink('', userId, redis);

        const parts = link.split('/');
        const key = parts[parts.length - 1];
        const response = await client.changePassword(newPassword, key);
        expect(response.data).toEqual({
            changePassword: [
                { path: 'newPassword', message: wrongEmailLength },
            ],
        });
    });

    test('changePassword should ne be reusable with the same key', async () => {
        newPassword = 'correctpassword';
        await lockUserAccount(userId, redis);
        const link = await createForgotPasswordLink('', userId, redis);

        const parts = link.split('/');
        const key = parts[parts.length - 1];
        await client.changePassword(newPassword, key);
        const response = await client.changePassword('newPassword', key);

        expect(response.data).toEqual({
            changePassword: [{ path: 'key', message: expiredLink }],
        });
    });
});
