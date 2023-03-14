import { PsbtPayload } from '@stacks/connect';
import { getPublicKeyFromPrivate } from '@stacks/encryption';
import { getAppPrivateKey } from '@stacks/wallet-sdk';
import { TokenVerifier, decodeToken } from 'jsontokens';

import { isString } from '@shared/utils';

import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

const unauthorizedPsbtRequestErrorMessage =
  'The psbt request provided is not signed by this wallet';

export function getPsbtPayloadFromToken(requestToken: string): PsbtPayload {
  const token = decodeToken(requestToken);
  if (isString(token.payload)) throw new Error('Error decoding json token');
  return token.payload as unknown as PsbtPayload;
}

/**
 * Verify a psbt request.
 * A psbt request is a signed JWT that is created on an app,
 * via `@stacks/connect`. The private key used to sign this JWT is an
 * `appPrivateKey`, which an app can get from authentication.
 *
 * The payload in this JWT can include an `stxAddress`. This indicates the
 * 'default' STX address that should be used to sign this transaction. This allows
 * the wallet to use the same account to sign a transaction as it used to sign
 * in to the app.
 *
 * This JWT is invalidated if:
 * - The JWT is not signed properly
 * - The public key used to sign this tx request does not match an `appPrivateKey`
 * for any of the accounts in this wallet.
 * - The `stxAddress` provided in the payload does not match an STX address
 * for any of the accounts in this wallet.
 *
 * @returns The decoded and validated `PsbtPayload`
 * @throws if the transaction request is invalid
 */
interface VerifyPsbtRequestArgs {
  requestToken: string;
  accounts: StacksAccount[];
  appDomain: string;
}
export async function verifyPsbtRequest({
  requestToken,
  accounts,
  appDomain,
}: VerifyPsbtRequestArgs): Promise<PsbtPayload> {
  const token = decodeToken(requestToken);
  const payload = token.payload as unknown as PsbtPayload;
  const { publicKey, stxAddress } = payload;
  const verifier = new TokenVerifier('ES256k', publicKey);
  const isSigned = await verifier.verifyAsync(requestToken);
  if (!isSigned) {
    throw new Error('Psbt request is not signed');
  }
  const foundAccount = accounts.find(account => {
    if (account.type === 'ledger') {
      throw new Error('Invalid account type');
    }
    const appPrivateKey = getAppPrivateKey({
      account,
      appDomain,
    });
    const appPublicKey = getPublicKeyFromPrivate(appPrivateKey);
    if (appPublicKey !== publicKey) return false;
    if (!stxAddress) return true;

    if (stxAddress !== account.address) return false;
    return true;
  });

  if (!foundAccount) {
    throw new Error(unauthorizedPsbtRequestErrorMessage);
  }
  return payload;
}
