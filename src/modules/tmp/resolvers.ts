import { ResolverMap } from '../../types/graphql';

export const resolvers: ResolverMap = {
    Query: {
        hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
            `Hello ${name || 'World'}`,
    },
};
