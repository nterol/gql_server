import { ResolverMap } from '../../types/graphql';
import { User } from '../../entity/User';
import createMiddleware from '../../utils/createMiddleware';
import middleware from './middleware';

export const resolvers: ResolverMap = {
    Query: {
        me: createMiddleware(middleware, async (_, __, { session }) => {
            console.log('SESSION FROM USER', session);
            const user = await User.findOne({ where: { id: session.userId } });

            console.log('USER', user);

            return user;
        }),
    },
};
