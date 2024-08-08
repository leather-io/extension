import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@stacks/common';
import StacksApp from '@zondax/ledger-stacks';
import ecdsaFormat from 'ecdsa-sig-formatter';

import { getIdentityDerivationPath } from '@shared/crypto/stacks/stacks-address-gen';

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
  return bytesToHex(sha256(payload));
}

export function signLedgerJwtHash(app: StacksApp) {
  return async (payload: string, accountIndex: number) =>
    app.sign_jwt(getIdentityDerivationPath(accountIndex), payload);
}
