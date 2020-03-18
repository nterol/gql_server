import * as uuidv4 from 'uuid/v4';
import { Redis } from 'ioredis';
import { forgotPasswordPrefix } from './constants';

export async function createForgotPasswordLink(
    url: string,
    userId: string,
    redis: Redis,
) {
    const id = uuidv4();
    await redis.set(`${forgotPasswordPrefix}${id}`, userId, 'ex', 60 * 20);
    const link = `${url}/change-password/${id}`;
    return link;
}
