import { startServer } from '../src/startServer';

module.exports = async function() {
    if (!process.env.TEST_HOST){
        const app = await startServer();
        const { port } = app.address();
        process.env.TEST_HOST = `http://127.0.0.1:${port}`;
    };
};