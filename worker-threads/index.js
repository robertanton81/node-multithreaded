import fastify from 'fastify';
import { createCryptoWorker } from './workerFactory.js';
import { getCryptoed } from '../utils/performanceTestMethods.js';
import { Worker } from 'worker_threads';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const server = fastify({ logger: false });

const iterations = 1000000;
server.get('/workers/multi', async (request, reply) => {
    console.log(`responding from workers. Worker pid: ${process.pid}`);

    const workerPromises = [];
    // simulating four threads
    for (let i = 0; i < 4; i++) {
        workerPromises.push(createCryptoWorker(iterations));
    }

    const results = (await Promise.all(workerPromises)).reduce(
        (acc, curr) => acc + curr,
        ''
    );

    return `total fibs: ${results}`;
});

server.get('/workers/manual', async (request, reply) => {
    console.log(`responding from workers. Worker pid: ${process.pid}`);
    const __dirname = dirname(fileURLToPath(import.meta.url));

    const worker1 = new Worker(`${__dirname}/worker.js`, {
        workerData: { iterations: iterations },
    });
    const worker2 = new Worker(`${__dirname}/worker.js`, {
        workerData: { iterations: iterations },
    });
    const worker3 = new Worker(`${__dirname}/worker.js`, {
        workerData: { iterations: iterations },
    });
    const worker4 = new Worker(`${__dirname}/worker.js`, {
        workerData: { iterations: iterations },
    });

    worker1.on('message', (data) => {
        console.log(`Worker pid: ${process.pid} .Responding from worker 1`);
    });

    worker2.on('message', (data) => {
        console.log(`Worker pid: ${process.pid} .Responding from worker 2`);
    });

    worker3.on('message', (data) => {
        console.log(`Worker pid: ${process.pid} .Responding from worker 3`);
    });

    worker4.on('message', (data) => {
        console.log(`Worker pid: ${process.pid} .Responding from worker 4`);
    });

    return `done cryptoing four times`;
});

server.get('/workers/single', async (request, reply) => {
    console.log(`responding from workers. Worker pid: ${process.pid}`);

    const fibFirst = getCryptoed(iterations);
    const fibSecond = getCryptoed(iterations);
    const fibThird = getCryptoed(iterations);
    const fibFourth = getCryptoed(iterations);

    return `done cryptoing four times`;
});

server.listen({ port: 3010 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Worker pid: ${process.pid} .Listening at ${address}`);
});
