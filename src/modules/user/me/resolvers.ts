import { ResolverMap } from '../../../types/graphql';
import { User } from '../../../entity/User';
import createMiddleware from '../../../utils/createMiddleware';
import middleware from '../../shared/middleware';
import { Graph } from '../../../entity/Graph';
import { Note } from '../../../entity/Note';
import { Edge } from '../../../entity/Edge';

export const resolvers: ResolverMap = {
    Query: {
        me: createMiddleware(middleware, async (_, __, { session }, info) => {
            const user = await User.findOne({ where: { id: session.userId } });

            console.log('💖 ARGUMENTS', info.fieldNodes);
            if (user) {
                const graphs = await Graph.find({ where: { author: user } });

                console.log('GRAPH FOUND: ', graphs);
                const notePromises = [];
                const edgePromises = [];

                for (let i = 0; i < graphs.length; i++) {
                    console.log('I do this anyway');
                    notePromises.push(
                        Note.find({ where: { graph: graphs[i] } }),
                    );
                    edgePromises.push(
                        Edge.find({ where: { graph: graphs[i] } }),
                    );
                }

                const notesArr = await Promise.all(notePromises);
                const edgeArr = await Promise.all(edgePromises);

                graphs.forEach((graph, i) => {
                    graph.notes = notesArr[i];
                    graph.edges = edgeArr[i];
                });

                console.log('notes found', notesArr);

                user.graphs = [...graphs];
            }

            return user;
        }),
    },
};
