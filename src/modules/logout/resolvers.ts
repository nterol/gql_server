import { ResolverMap } from '../../types/graphql';
import { removeUserSessions } from '../../utils/removeUserSessions';

export const resolvers: ResolverMap = {
    Query: {
        dummy: () => 'dummy',
    },

    Mutation: {
        logout: async (_, __, { session, redis }) => {
            const { userId } = session;
            if (userId) {
                await removeUserSessions(userId, redis);
                return true;
            }
            return false;
        },
    },
};
