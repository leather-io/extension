import { decryptMnemonic } from '@background/crypto/mnemonic-encryption';
import { getWallet } from './wallet-utils';

export async function getDecryptedWalletDetails(
  encryptedSecretKey: string,
  password: string,
  salt: string | undefined
) {
  const hasSetPassword = password !== undefined;
  const decryptedData = await decryptMnemonic({
    encryptedSecretKey,
    password,
    salt,
  });

  const keyInfo = {
    secretKey: decryptedData.secretKey,
    encryptedSecretKey: encryptedSecretKey,
    currentAccountIndex: 0,
    hasSetPassword,
  };

  const wallet = await getWallet({
    secretKey: decryptedData.secretKey,
    salt: decryptedData.salt,
    password,
  });

  const result = {
    ...keyInfo,
    wallet,
    salt: decryptedData.salt,
    encryptedSecretKey: decryptedData.encryptedSecretKey,
  };
  return result;
}
