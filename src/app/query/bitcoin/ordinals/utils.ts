import * as secp from '@noble/secp256k1';
import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';
import * as yup from 'yup';

import { NetworkModes } from '@shared/constants';
import { getBtcSignerLibNetworkByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { deriveAddressIndexKeychainFromAccount } from '@shared/crypto/bitcoin/bitcoin.utils';
import { DerivationPathDepth } from '@shared/crypto/derivation-path.utils';

/**
 * Schema of data used from the `GET https://ordapi.xyz/inscriptions/:id` endpoint. Additional data
 * that is not currently used by the app may be returned by this endpoint.
 *
 * See API docs, https://ordapi.xyz/
 */
export const ordApiXyzGetInscriptionByInscriptionSchema = yup
  .object({
    // NOTE: this next key is using a space " ", uncommon as that is.
    ['content type']: yup.string().required(),

    content: yup.string().required(),
    preview: yup.string().required(),
    title: yup.string().required(),
  })
  .required();

/**
 * Schema of data used from the `GET https://ordapi.xyz/output/:tx` endpoint. Additional data
 * that is not currently used by the app may be returned by this endpoint.
 *
 * See API docs, https://ordapi.xyz/
 */
export const ordApiXyzGetTransactionOutput = yup
  .object({
    inscriptions: yup.string().required(),
  })
  .required();

export type OrdApiXyzGetTransactionOutput = yup.InferType<typeof ordApiXyzGetTransactionOutput>;

export function hasOrdinals(data: Array<unknown>) {
  return data.length !== 0;
}

export function getTaprootAddress(index: number, keychain: HDKey, network: NetworkModes) {
  if (keychain.depth !== DerivationPathDepth.Account)
    throw new Error('Expects keychain to be on the account index');

  const addressIndex = deriveAddressIndexKeychainFromAccount(keychain)(index);

  if (!addressIndex.privateKey) {
    throw new Error('Expected privateKey to be defined.');
  }

  const payment = btc.p2tr(
    secp.schnorr.getPublicKey(addressIndex.privateKey),
    undefined,
    getBtcSignerLibNetworkByMode(network)
  );

  if (!payment.address) throw new Error('Expected address to be defined.');

  return payment.address;
}

/**
 * Ordinals contain arbitrary data. When retrieving an ordinal, it should be
 * classified into one of the types below, indicating that the app can handle it
 * appropriately and securely. Ordinals of types not ready to be handled by the
 * app should be classified as "other".
 */
const supportedOrdinalTypes = ['image', 'text', 'other'] as const;

type SupportedOrdinalType = (typeof supportedOrdinalTypes)[number];

interface BaseOrdinalInfo {
  /**
   * The kind of ordinal as classified by this app. Different kinds of ordinals
   * require different treatment (e.g., images vs documents).
   */
  type: SupportedOrdinalType;

  /**
   * Title which can be rendered in the UI alongside the ordinal.
   */
  title: string;

  /**
   * A link to a detailed techincal description about the ordinal.
   */
  infoUrl: string;
}

interface ImageOrdinalInfo extends BaseOrdinalInfo {
  type: 'image';

  /**
   * URL where the image can be found.
   */
  src: string;
}

interface TextOrdinalInfo extends BaseOrdinalInfo {
  type: 'text';

  /**
   * URL where the text content can be found.
   */
  contentSrc: string;
}

interface OtherOrdinalInfo extends BaseOrdinalInfo {
  type: 'other';
}

export type OrdinalInfo = ImageOrdinalInfo | TextOrdinalInfo | OtherOrdinalInfo;

export function createInfoUrl(contentPath: string) {
  return `https://ordinals.com${contentPath}`.replace('content', 'inscription');
}

export function whenOrdinalType<T>(
  mimeType: string,
  branches: { [k in SupportedOrdinalType]?: () => T }
) {
  if (mimeType.startsWith('image/') && branches.image) {
    return branches.image();
  }

  if (mimeType.startsWith('text') && branches.text) {
    return branches.text();
  }

  if (branches.other) return branches.other();

  throw new Error('Unhandled ordinal type.');
}
