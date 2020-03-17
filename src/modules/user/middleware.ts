import { Resolver } from '../../types/graphql';

export default async (
    resolver: Resolver,
    parent: any,
    args: any,
    context: any,
    info: any,
) => {
    //midleWare
    console.log('Args given 🍎', args);
    if (!context.session || !context.session.userId)
        throw new Error('No cookie 🙁🍪');

    return resolver(parent, args, context, info);

    //afterware
};
