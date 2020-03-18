import { redisSessionPrefix, userIdSessionPrefix } from './constants';
import { Redis } from 'ioredis';

export async function removeUserSessions(userId: string, redis: Redis) {
    const sessionIds = await redis.lrange(
        `${userIdSessionPrefix}${userId}`,
        0,
        -1,
    );

    const promises = [];
    for (let i = 0; i < sessionIds.length; i++) {
        promises.push(redis.del(`${redisSessionPrefix}${sessionIds[i]}`));
    }
    await Promise.all(promises);
}
