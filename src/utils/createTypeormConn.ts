import { getConnectionOptions, createConnection } from 'typeorm';

export async function createTypeormConn() {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    // potentially I should return this.
    // but it works without it so...
    await createConnection({ ...connectionOptions, name: 'default' });
}
