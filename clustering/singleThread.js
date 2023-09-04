import fastify from 'fastify';
import { getCryptoed } from '../utils/performanceTestMethods.js';

const iterations = 1000000;
const server = fastify({ logger: false });

server.get('/clusters/blocking', (request, reply) => {
    console.log(
        `responding from  blocking operation. Worker pid: ${process.pid}`
    );

    setTimeout(() => {
        console.log('timeout done');
        reply.send(`blocking operation worker pid: ${process.pid}`);
    }, 7000);
});

server.get('/clusters/non-blocking', async (request, reply) => {
    console.log(
        `responding from non-blocking operation. Worker pid: ${process.pid}`
    );
    return `non-blocking worker pid: ${process.pid}`;
});

server.get('/clusters/heavy', async (request, reply) => {
    console.log(`responding from crypto. Worker pid: ${process.pid}`);
    const tick = performance.now();
    getCryptoed(iterations);
    const tock = performance.now();
    console.log(`heavy took ${tock - tick} milliseconds`);
    return `crypto worker pid: ${process.pid}`;
});

server.listen({ port: 3009 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Worker pid: ${process.pid} .Listening at ${address}`);
});
