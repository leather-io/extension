export enum WorkerScript {
  DecryptionWorker = 'decryption-worker.js',
}

export function createWorker(scriptName: WorkerScript) {
  return new Worker(scriptName);
}
