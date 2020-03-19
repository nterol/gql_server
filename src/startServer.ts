import 'reflect-metadata';
import 'dotenv/config';
import { GraphQLServer } from 'graphql-yoga';
import * as session from 'express-session';
const rateLimit = require('express-rate-limit');
const RateLimitStore = require('rate-limit-redis');

import { redis } from './redis';
import { createTypeormConn } from './utils/createTypeormConn';
import { confirmEmail } from './routes/confirmEmail';
import { genSchema } from './utils/generateSchema';
import { redisSessionPrefix } from './utils/constants';
const RedisStore = require('connect-redis')(session);
const SESSION_SECRET = 'SESSION_SECRET';

export async function startServer() {
    const server = new GraphQLServer({
        schema: genSchema(),
        context: ({ request }) => {
            // console.log('CHECK WHATS IN REQUEST BRUH 🕵️‍♀️', request.session);
            return {
                redis,
                url: request.protocol + '://' + request.get('host'),
                session: request.session,
                req: request,
            };
        },
    });

    server.express.use(
        rateLimit({
            store: new RateLimitStore({ client: redis }),
            windowMs: 15 * 60 * 1000,
            max: 100,
            delayMs: 0,
        }),
    );

    server.express.use(
        session({
            store: new RedisStore({
                client: redis as any,
                prefix: redisSessionPrefix,
            }),
            name: 'gid',
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            },
        }),
    );

    const cors = {
        credentials: true,
        origin:
            process.env.NODE_ENV === 'test' ? '*' : process.env.FRONTEND_HOST,
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
