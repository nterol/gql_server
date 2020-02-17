import { Redis } from 'ioredis';

export interface ISession {
    userId?: string;
}
export interface ResolverMap {
    [key: string]: {
        [key: string]: (
            parent: any,
            args: any,
            context: {
                redis: Redis;
                url: string;
                session: ISession;
            },
            info: any,
        ) => any;
    };
}
