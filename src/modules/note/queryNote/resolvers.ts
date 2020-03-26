import { Note } from '../../../entity/Note';
import { ResolverMap } from '../../../types/graphql';

export const resolvers: ResolverMap = {
    Query: {
        note: async (_, { id }) => {
            const note = await Note.findOne({ where: { id } });
            return note;
        },

        notes: async (_, __, { session }) => {
            const notes = await Note.find({
                where: { author: session.userId },
            });

            return notes;
        },
    },

    Note: {},
};
