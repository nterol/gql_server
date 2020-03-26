import { v4 } from 'uuid';

import { ResolverMap } from '../../types/graphql';
import createMiddleware from '../../utils/createMiddleware';
import middleware from '../shared/middleware';
import { User } from '../../entity/User';
import { Graph } from '../../entity/Graph';

export const resolvers: ResolverMap = {
    Mutation: {
        createGraph: createMiddleware(
            middleware,
            async (_, { title }, { session }) => {
                const user = await User.findOne({
                    where: { id: session.userId },
                });
                console.log('GRAPH TITLE', title);
                if (user) {
                    const newGraph = Graph.create({
                        id: v4(),
                        author: user,
                        title,
                    });

                    user.graphs = [newGraph];

                    await Promise.all([newGraph.save(), user.save()]);
                    return null;
                }

                return [{ path: 'user', message: 'no user found' }];
            },
        ),
    },
};
