const worker = new Worker('./decryption-worker.js');

interface GenerateEncryptionKeyArgs {
  password: string;
  salt: string;
}
export async function generateEncryptionKey({ password, salt }: GenerateEncryptionKeyArgs) {
  return new Promise(resolve => {
    worker.postMessage({ password, salt });
    worker.addEventListener('message', e => {
      console.log('bg', e);
      resolve(e.data);
    });
  });
}
