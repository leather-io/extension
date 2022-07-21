import StacksApp from '@zondax/ledger-blockstack';
import ecdsaFormat from 'ecdsa-sig-formatter';
import { sha256 } from 'sha.js';
import { getIdentityDerivationPath } from '../../ledger-utils';

function reformatDerSignatureToJose(derSignature: Uint8Array) {
  // Stacks authentication uses `ES256k`, however `ecdsa-sig-formatter` doesn't
  // accept this. As it only uses this to validate key length, and the key
  // lengths are the same, it works despite this confusing disparity.
  return ecdsaFormat.derToJose(Buffer.from(derSignature), 'ES256');
}

export function addSignatureToAuthResponseJwt(authResponse: string, signature: Uint8Array) {
  const resultingSig = reformatDerSignatureToJose(signature);
  return [authResponse, resultingSig].join('.');
}

export function getSha256HashOfJwtAuthPayload(payload: string) {
  return new sha256().update(payload).digest('hex');
}

export function signLedgerJwtHash(app: StacksApp) {
  return async (payload: string, accountIndex: number) =>
    app.sign_jwt(getIdentityDerivationPath(accountIndex), payload);
}
