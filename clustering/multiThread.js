import cluster from 'cluster';
import { cpus } from 'os';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const osCpusCount = cpus().length;
const halfOfThreads = Math.ceil(osCpusCount / 2);
const maxFailCount = 5;
let failCount = 0;

console.log(`number of cores: ${osCpusCount}`);
console.log(`Primary pid: ${process.pid}`);
cluster.setupPrimary({
    exec: `${__dirname}/singleThread.js`,
});

console.log(`spinning ${halfOfThreads} threads`);
for (let i = 0; i < halfOfThreads; i++) {
    console.log(`forking thread no.: ${i}`);
    cluster.fork();
}

cluster.on('disconnect', (worker) => {
    console.log(`Worker ${worker.id} disconnected`);
});

cluster.on('exit', (worker, code, signal) => {
    console.log(
        `Worker ${worker.process.id} exited with code: ${code} and signal: ${signal}`
    );
    if (failCount >= maxFailCount) {
        console.log('Max fail count reached. Exiting...');
        process.exit(1);
    } else {
        failCount++;
        console.log('Starting a new worker');
        cluster.fork();
    }
});
