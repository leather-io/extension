import { Account, getAppPrivateKey } from '@stacks/wallet-sdk';
import { SignaturePayload } from '@stacks/connect';
import { decodeToken, TokenVerifier } from 'jsontokens';
import { getPublicKeyFromPrivate } from '@stacks/encryption';
import { getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';

export function getPayloadFromToken(requestToken: string) {
  const token = decodeToken(requestToken);
  return token.payload as unknown as SignaturePayload;
}

function getTransactionVersionFromRequest(signature: SignaturePayload) {
  const { network } = signature;
  if (!network) return TransactionVersion.Mainnet;
  if (![TransactionVersion.Mainnet, TransactionVersion.Testnet].includes(network.version)) {
    throw new Error('Invalid network version provided');
  }
  return network.version;
}

const UNAUTHORIZED_SIGNATURE_REQUEST =
  'The signature request provided is not signed by this wallet.';
/**
 * Verify a transaction request.
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
  accounts: Account[];
  appDomain: string;
}
export async function verifySignatureRequest({
  requestToken,
  accounts,
  appDomain,
}: VerifySignatureRequestArgs): Promise<SignaturePayload> {
  const token = decodeToken(requestToken);
  const signature = token.payload as unknown as SignaturePayload;
  const { publicKey, stxAddress } = signature;
  const txVersion = getTransactionVersionFromRequest(signature);
  const verifier = new TokenVerifier('ES256k', publicKey);
  const isSigned = await verifier.verifyAsync(requestToken);
  if (!isSigned) {
    throw new Error('Signature request is not signed');
  }
  const foundAccount = accounts.find(account => {
    const appPrivateKey = getAppPrivateKey({
      account,
      appDomain,
    });
    const appPublicKey = getPublicKeyFromPrivate(appPrivateKey);
    if (appPublicKey !== publicKey) return false;
    if (!stxAddress) return true;
    const accountStxAddress = getAddressFromPrivateKey(account.stxPrivateKey, txVersion);
    if (stxAddress !== accountStxAddress) return false;
    return true;
  });
  if (!foundAccount) {
    throw new Error(UNAUTHORIZED_SIGNATURE_REQUEST);
  }
  return signature;
}
