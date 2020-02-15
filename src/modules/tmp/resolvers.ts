import {ResolveMap} from "../../types/graphql";


export const resolvers: ResolveMap = {
    Query: {
        hello: (_:any, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
    },
};