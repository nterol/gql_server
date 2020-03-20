import { Resolver } from '../../../types/graphql';
import { noCookie } from './errorMessage';

export default async (
    resolver: Resolver,
    parent: any,
    args: any,
    context: any,
    info: any,
) => {
    //midleWare
    if (!context.session || !context.session.userId) throw new Error(noCookie);

    return resolver(parent, args, context, info);

    //afterware
};
