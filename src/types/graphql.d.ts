import { Redis } from 'ioredis';

export interface ISession extends Express.Session {
    userId?: string;
    save: () => {};
}

export interface Context {
    redis: Redis;
    url: string;
    session: ISession;
    req: Express.Request;
}

export type Resolver = (
    parent: any,
    args: any,
    context: Context,
    info: any,
) => any;

export type GraphqlMiddlewareFunc = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: Context,
    info: any,
) => any;

export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver;
    };
}
