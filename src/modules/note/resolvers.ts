import { v4 } from 'uuid';

import { ResolverMap } from '../../types/graphql';
import createMiddleware from '../../utils/createMiddleware';
import middleware from '../shared/middleware';
import { Graph } from '../../entity/Graph';
import { Note } from '../../entity/Note';
import { User } from '../../entity/User';

export const resolvers: ResolverMap = {
    Query: {
        note: async (_, { id }) => {
            const note = await Note.findOne({ where: { id } });
            return note;
        },

        notes: async (_, __, { session }) => {
            console.log('SESSION NOTES', session.userId);
            const notes = await Note.find({
                where: { author: session.userId },
            });

            return notes;
        },
    },
    Mutation: {
        createNote: createMiddleware(
            middleware,
            async (_, { title, body, graphId }, { session }) => {
                const [graph, user] = await Promise.all([
                    Graph.findOne({ where: { id: graphId } }),
                    User.findOne({ where: { id: session.userId } }),
                ]);

                if (graph && user) {
                    const newNote = Note.create({
                        id: v4(),
                        title,
                        body,
                        author: user,
                        graph: graph,
                    });

                    graph.notes = [newNote];
                    user.notes = [newNote];
                    await Promise.all([graph.save(), user.save()]);

                    await newNote.save();

                    return newNote;
                }
                return null;
            },
        ),
        deleteNote: createMiddleware(middleware, async (_, { noteId }) => {
            const note = await Note.findOne({ where: { id: noteId } });
            if (note) {
                await note.remove();
                return null;
            }
            return [{ path: 'note', message: 'No Note found' }];
        }),
    },
};
