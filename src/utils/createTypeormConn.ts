import {  getConnectionOptions, createConnection } from "typeorm";


export async function createTypeormConn() {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    await createConnection({...connectionOptions, name:"default"});
}