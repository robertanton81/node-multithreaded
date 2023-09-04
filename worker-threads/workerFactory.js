import { Worker } from 'worker_threads';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const createCryptoWorker = (iterations) =>
    new Promise((resolve, reject) => {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const worker = new Worker(`${__dirname}/worker.js`, {
            workerData: { iterations: iterations },
        });

        worker.on('message', (data) => {
            console.log(`Worker pid: ${process.pid} .Responding from worker`);
            resolve('success');
        });
        worker.on('error', (err) => reject(err));
    });
