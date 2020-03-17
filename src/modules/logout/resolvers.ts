import { ResolverMap } from '../../types/graphql';

export const resolvers: ResolverMap = {
    Query: {
        dummy: () => 'dummy',
    },

    Mutation: {
        logout: (_, __, { session }) =>
            new Promise(res =>
                session.destroy(err => {
                    console.log('Logout 👋');

                    if (err) {
                        console.log('LOG OUT ERROR', err);
                    }

                    res(true);
                }),
            ),
    },
};
