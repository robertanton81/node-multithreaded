import { parentPort, workerData } from 'worker_threads';
import { getCryptoed } from '../utils/performanceTestMethods.js';

parentPort.postMessage(getCryptoed(workerData.iterations));
