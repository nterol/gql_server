import { Redis } from 'ioredis';
import { removeUserSessions } from './removeUserSessions';
import { User } from '../entity/User';

export async function lockUserAccount(userId: string, redis: Redis) {
    await User.update({ id: userId }, { accountLocked: true });
    await removeUserSessions(userId, redis);
}
