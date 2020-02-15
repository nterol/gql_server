import * as uuidv4 from 'uuid/v4';
import { Redis } from 'ioredis';

export async function createConfirmEmailLink(
    url: string,
    userId: string,
    redis: Redis,
) {
    const id = uuidv4();
    await redis.set(id, userId, 'ex', 60 * 60 * 24);
    const link = `${url}/confirm/${id}`;
    return link;
}
