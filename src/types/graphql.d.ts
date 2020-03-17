import { Redis } from 'ioredis';

export interface ISession extends Express.Session {
    userId?: string;
    save: () => {};
}

export type Resolver = (
    parent: any,
    args: any,
    context: {
        redis: Redis;
        url: string;
        session: ISession;
    },
    info: any,
) => any;

export type GraphqlMiddlewareFunc = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: {
        redis: Redis;
        url: string;
        session: ISession;
    },
    info: any,
) => any;

export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver;
    };
}
