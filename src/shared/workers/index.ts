import { getAnalyticsClient } from '@shared/utils/analytics';

export enum WorkerScript {
  DecryptionWorker = 'decryption-worker.js',
}

export function createWorker(scriptName: WorkerScript) {
  const worker = new Worker(scriptName);
  worker.addEventListener('error', error => {
    void getAnalyticsClient().then(
      client => client && client.track(`worker_error_thrown_${scriptName}`, { error })
    );
  });
  return worker;
}
