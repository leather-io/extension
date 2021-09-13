import { createWorker, WorkerScript } from '../../workers';

interface GenerateEncryptionKeyArgs {
  password: string;
  salt: string;
}
export async function generateEncryptionKey(args: GenerateEncryptionKeyArgs): Promise<string> {
  const worker = createWorker(WorkerScript.DecryptionWorker);

  return new Promise(resolve => {
    worker.addEventListener('message', (e: MessageEvent<string>) => {
      worker.terminate();
      resolve(e.data);
    });
    worker.postMessage(args);
  });
}
