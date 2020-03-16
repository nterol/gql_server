import { Resolver, GraphqlMiddlewareFunc } from '../types/graphql';

const createMiddleware = (
    middlewareFunc: GraphqlMiddlewareFunc,
    resolverFunc: Resolver,
) => (parent: any, args: any, context: any, info: any) => {
    return middlewareFunc(resolverFunc, parent, args, context, info);
};

export default createMiddleware;
