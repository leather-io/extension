import * as secp from '@noble/secp256k1';
import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';
import * as yup from 'yup';

import { NetworkConfiguration, NetworkModes } from '@shared/constants';
import { getBtcSignerLibNetworkByMode } from '@shared/crypto/bitcoin/bitcoin.network';

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

export function getTaprootAddress(index: number, key: HDKey, network: NetworkConfiguration) {
  const account = key.derive(`m/86'/1'/0'/0/${index}`);

  if (!account.privateKey) {
    throw new Error('Expected privateKey to be defined.');
  }

  const address = btc.p2tr(
    secp.schnorr.getPublicKey(account.privateKey),
    undefined,
    getBtcSignerLibNetworkByMode(network.id as NetworkModes)
  );

  const addressString = address.address;
  if (!addressString) {
    throw new Error('Expected address to be defined.');
  }
  return addressString;
}
