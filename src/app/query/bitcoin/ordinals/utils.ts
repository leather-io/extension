import * as secp from '@noble/secp256k1';
import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';
import * as yup from 'yup';

import { NetworkModes } from '@shared/constants';
import { getBtcSignerLibNetworkByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { DerivationPathDepth } from '@shared/crypto/derivation-path.utils';

/**
 * Schema of data used from the `GET https://ordapi.xyz/address/:address` endpoint. Additional data
 * that is not currently used by the app may be returned by this endpoint.
 *
 * See API docs, https://ordapi.xyz/
 */
// export const ordApiXyzGetInscriptionByAddressSchema = yup
//   .array(
//     yup.object({
//       // NOTE: this next key is using a space " ", uncommon as that is.
//       ['content type']: yup.string().required(),
//
//       content: yup.string().required(),
//       preview: yup.string().required(),
//       title: yup.string().required(),
//     })
//   )
//   .required();

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

export function hasOrdinals(data: Array<unknown>) {
  return data.length !== 0;
}

export function getTaprootAddress(index: number, key: HDKey, network: NetworkModes) {
  if (key.depth !== DerivationPathDepth.Account)
    throw new Error('Expects keychain to be on the account index');

  const addressIndex = key.deriveChild(0).deriveChild(index);

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
