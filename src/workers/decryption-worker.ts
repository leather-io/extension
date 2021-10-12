import argon2, { ArgonType } from 'argon2-browser';

const context = self as unknown as Worker;

interface GenerateEncryptionKeyArgs {
  password: string;
  salt: string;
}
async function generateEncryptionKey({ password, salt }: GenerateEncryptionKeyArgs) {
  const argonHash = await argon2.hash({
    pass: password,
    salt,
    hashLen: 48,
    time: 44,
    mem: 1024 * 32,
    type: ArgonType.Argon2id,
  });
  return argonHash.hashHex;
}

async function stretchKeyPostMessageHandler(e: MessageEvent<GenerateEncryptionKeyArgs>) {
  const hex = await generateEncryptionKey(e.data);
  context.postMessage(hex);
}

context.addEventListener('message', stretchKeyPostMessageHandler, false);
