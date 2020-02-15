import {importSchema} from "graphql-import";
import * as path from "path";
import {GraphQLServer} from "graphql-yoga";
import * as fs from 'fs';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import {GraphQLSchema} from 'graphql';


import {createTypeormConn} from "./utils/createTypeormConn";
import redis from './redis';
import { confirmEmail } from './routes/confirmEmail';

export async function startServer() {
    const schemas: GraphQLSchema[] = [];
    const folders = fs.readdirSync(path.join(__dirname, "./modules"));

    folders.forEach(folder => {
        const { resolvers } = require(`./modules/${folder}/resolvers`);
        const typeDefs = importSchema(path.join(__dirname, `./modules/${folder}/schema.graphql`));
        schemas.push(makeExecutableSchema({ resolvers, typeDefs }))
    });

    
    
    const server = new GraphQLServer({ 
        schema: mergeSchemas({schemas}), 
        context:({request}) =>  ({
            redis, 
            url: request.protocol + "://" + request.get("host") })
    });

    server.express.get("/confirm/:id", confirmEmail)

    await createTypeormConn();
    const app = await server.start({port: process.env.NODE_ENV === "test" ? 0 : 4000});
    console.log('🚀 Server is running on localhost:4000 ! ')

    return app;
}