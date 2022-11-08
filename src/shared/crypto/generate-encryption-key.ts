import { WorkerScript, createWorker } from '../workers';

const worker = createWorker(WorkerScript.DecryptionWorker);
interface GenerateEncryptionKeyArgs {
  password: string;
  salt: string;
}
export async function generateEncryptionKey(args: GenerateEncryptionKeyArgs): Promise<string> {
  return new Promise(resolve => {
    const handler = (e: MessageEvent<string>) => resolve(e.data);
    worker.addEventListener('message', handler);
    worker.postMessage(args);
  });
}
