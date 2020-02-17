import { GraphQLServer } from 'graphql-yoga';
import * as session from 'express-session';
import * as connectRedisStore from 'connect-redis';

import { createTypeormConn } from './utils/createTypeormConn';
import redis from './redis';
import { confirmEmail } from './routes/confirmEmail';
import { genSchema } from './utils/generateSchema';

const SESSION_SECRET = 'SESSION_SECRET';

const RedisStore = connectRedisStore(session);

export async function startServer() {
    const server = new GraphQLServer({
        schema: genSchema(),
        context: ({ request }) => ({
            redis,
            url: request.protocol + '://' + request.get('host'),
            req: request.session,
        }),
    });

    server.express.use(
        session({
            name: 'quid',
            store: new RedisStore({ client: redis }),
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7,
            },
        }),
    );

    const cors = {
        credientials: true,
        origin: process.env.FRONTEND_HOST,
    };

    server.express.get('/confirm/:id', confirmEmail);

    await createTypeormConn();
    const app = await server.start({
        cors,
        port: process.env.NODE_ENV === 'test' ? 0 : 4000,
    });
    console.log('🚀 Server is running on localhost:4000 ! ');

    return app;
}
