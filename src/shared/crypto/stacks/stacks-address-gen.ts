import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils';
import { HDKey } from '@scure/bip32';

import { makeAccountIndexDerivationPathFactory } from '@leather.io/stacks';

export const DATA_DERIVATION_PATH = `m/888'/0'`;

export function deriveStacksSalt(keychain: HDKey) {
  if (keychain.depth !== 2)
    throw new Error('Stacks "salt" must be derived from the data derivation path');
  const publicKeyHex = utf8ToBytes(bytesToHex(keychain.publicKey!));
  return bytesToHex(sha256(publicKeyHex));
}

const stxIdentityDerivationWithAccount = `m/888'/0'/{account}'`;

export const getIdentityDerivationPath = makeAccountIndexDerivationPathFactory(
  stxIdentityDerivationWithAccount
);
