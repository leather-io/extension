import { deserializeCV } from '@stacks/transactions';
import { getAppPrivateKey } from '@stacks/wallet-sdk';
import { decodeToken, TokenInterface, TokenVerifier } from 'jsontokens';
import { getPublicKeyFromPrivate } from '@stacks/encryption';

import { AccountWithAddress } from '@app/store/accounts/account.models';
import { isString } from '@shared/utils';
import {
  CommonSignaturePayload,
  SignaturePayload,
  StructuredDataSignaturePayload,
} from '@stacks/connect';

export function getGenericSignaturePayloadFromToken(requestToken: string): CommonSignaturePayload {
  const token = decodeToken(requestToken);
  return token.payload as unknown as CommonSignaturePayload;
}

export function getSignaturePayloadFromToken(requestToken: string): SignaturePayload {
  const token = decodeToken(requestToken);
  return token.payload as unknown as SignaturePayload;
}

export function getStructuredDataPayloadFromToken(
  requestToken: string
): StructuredDataSignaturePayload {
  const token = decodeToken(requestToken);
  if (isString(token.payload)) throw new Error('error decoding json token');

  const result = token.payload as unknown as TokenInterface & {
    message: string;
    domain: string;
  };

  return {
    ...(result as unknown as CommonSignaturePayload),
    message: deserializeCV(Buffer.from(result.message, 'hex')),
    domain: deserializeCV(Buffer.from(result.domain, 'hex')),
  };
}

const UNAUTHORIZED_SIGNATURE_REQUEST =
  'The signature request provided is not signed by this wallet.';

/**
 * Verify a signature request.
 * A transaction request is a signed JWT that is created on an app,
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
 * @returns The decoded and validated `SignaturePayload`
 * @throws if the transaction request is invalid
 */
interface VerifySignatureRequestArgs {
  requestToken: string;
  accounts: AccountWithAddress[];
  appDomain: string;
}
export async function verifySignatureRequest({
  requestToken,
  accounts,
  appDomain,
}: VerifySignatureRequestArgs): Promise<CommonSignaturePayload> {
  const token = decodeToken(requestToken);
  const signature = token.payload as unknown as CommonSignaturePayload;
  const { publicKey, stxAddress } = signature;
  const verifier = new TokenVerifier('ES256k', publicKey);
  const isSigned = await verifier.verifyAsync(requestToken);
  if (!isSigned) {
    throw new Error('Signature request is not signed');
  }
  const foundAccount = accounts.find(account => {
    if (account.type === 'ledger') {
      throw new Error('sdlkjsdlkf');
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
    throw new Error(UNAUTHORIZED_SIGNATURE_REQUEST);
  }
  return signature;
}
