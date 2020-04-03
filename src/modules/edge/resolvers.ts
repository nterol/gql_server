import { v4 } from 'uuid';

import { Edge } from '../../entity/Edge';
import { ResolverMap } from '../../types/graphql';
import { Note } from '../../entity/Note';

export const resolver: ResolverMap = {
    Query: {
        edge: async (_, { id }) => {
            console.log('EDGE', id);
            const edge = await Edge.findOne({ where: { id } });
            return edge;
        },

        edges: async (_, __, { session }) => {
            console.log('SESSION FROM EDGES', session);
            const edges = await Edge.find({
                where: { author: session.userId },
            });

            return edges;
        },
    },

    Mutation: {
        addEdge: async (_, { targetId, sourceId, title }) => {
            const findSource = Note.findOne({ where: { id: sourceId } });
            const findTarget = Note.findOne({ where: { id: targetId } });

            const [source, target] = await Promise.all([
                findSource,
                findTarget,
            ]);

            if (source && target) {
                const edge = Edge.create({ id: v4(), target, source, title });
                source.asSource = [edge];
                target.asTarget = [edge];

                await Promise.all([edge.save(), source.save(), target.save()]);

                return edge;
            }

            return null;
        },

        removeEdge: async (_, { id }) => {
            const edge = await Edge.findOne({ where: { id } });

            if (edge) {
                edge.remove();
                return null;
            }
            return [{ path: 'edge', message: 'Could not find relation' }];
        },
    },
};
