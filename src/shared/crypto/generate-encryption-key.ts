import { InternalMethods } from '@shared/message-types';

interface GenerateEncryptionKeyArgs {
  password: string;
  salt: string;
}
export async function generateEncryptionKey(payload: GenerateEncryptionKeyArgs): Promise<string> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ method: InternalMethods.StretchKey, payload }, response => {
      resolve(response);
    });
  });
}
