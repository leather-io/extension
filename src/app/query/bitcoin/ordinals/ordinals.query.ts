import { useQuery } from '@tanstack/react-query';

import { useCurrentTaprootAccountKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import {
  OrdApiXyzGetInscriptionByInscriptionSchema,
  OrdApiXyzGetTransactionOutput,
  getTaprootAddress,
  hasOrdinals,
  ordApiXyzGetInscriptionByInscriptionSchema,
  ordApiXyzGetTransactionOutput,
} from './utils';

const stopSearchAfterNumberAddressesWithoutOrdinals = 20;

/**
 * Ordinals contain arbitrary data. When retrieving an ordinal, we should
 * classify it into one of the types below, indicating that it is handled
 * appropriately. Ordinals of types not ready to be handled by the app should be
 * classified as `Other`.
 */
export enum OrdinalType {
  Image = 'IMAGE',
  Other = 'OTHER',
}
interface BaseOrdinalInfo {
  /**
   * The kind of ordinal as classified by this app. Different kinds of ordinals
   * require different treatment (e.g., images vs documents).
   */
  type: OrdinalType;

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
  /**
   * A URL of where the image can be downloaded from.
   */
  type: OrdinalType.Image;
  content: string;
}
interface OtherOrdinalInfo extends BaseOrdinalInfo {
  /**
   * A URL of where the image can be downloaded from.
   */
  type: OrdinalType.Other;
}

type OrdinalInfo = ImageOrdinalInfo | OtherOrdinalInfo;

export function useGetOrdinalsQuery() {
  const network = useCurrentNetwork();
  const keychain = useCurrentTaprootAccountKeychain();
  const client = useBitcoinClient();

  return useQuery(
    // Only scan for ordinals for the current account
    ['ordinals', keychain.pubKeyHash, network.id] as const,
    async () => {
      let currentNumberOfAddressesWithoutOrdinals = 0;
      let index = 0;
      const foundOrdinals: OrdinalInfo[] = [];

      // What is this loop doing?
      //
      // 1. We query a generic blockchain API (blockstream) to get unspent transactions for the address and cherrypick the first to appear
      // 2. Then we pass that tx_hash to https://ordapi.xyz/output/:id to get the inscription ID
      // 3. Then we use the inscription ID to query https://ordapi.xyz/inscription/:id for the inscription metadata

      while (
        currentNumberOfAddressesWithoutOrdinals < stopSearchAfterNumberAddressesWithoutOrdinals
      ) {
        const address = getTaprootAddress(index, keychain, network.chain.bitcoin.network);

        // 1.
        const unspentTransactions = await client.addressApi.getUtxosByAddress(address);

        if (!hasOrdinals(unspentTransactions)) {
          currentNumberOfAddressesWithoutOrdinals += 1;
          index += 1;
          // eslint-disable-next-line no-console
          console.log('Fresh address with no ordinals: ', address);
          continue;
        }

        currentNumberOfAddressesWithoutOrdinals = 0;

        // 2.
        const responseOrdApiOutput = await Promise.all(
          unspentTransactions.map(transaction =>
            fetch(`https://ordapi.xyz/output/${transaction.txid}:0`)
          )
        );

        const successfullResponsesOrdApiOutput = responseOrdApiOutput.filter(res => res.ok);

        const parsedResponsesOrdApiOutput = await Promise.all(
          successfullResponsesOrdApiOutput.map(res => res.json())
        );

        const validatedResDataOrdApiOutput = (
          await Promise.allSettled(
            parsedResponsesOrdApiOutput.map(res => ordApiXyzGetTransactionOutput.validate(res))
          )
        )
          .filter(
            (p): p is PromiseFulfilledResult<OrdApiXyzGetTransactionOutput> =>
              p.status === 'fulfilled'
          )
          .map(p => p.value);

        // 3.
        const responseOrdApiInscriptions = await Promise.all(
          validatedResDataOrdApiOutput.map(res => fetch(`https://ordapi.xyz${res.inscriptions}`))
        );

        const successfullResponseOrdApiInscriptions = responseOrdApiInscriptions.filter(
          res => res.ok
        );

        const parsedResponseInscriptions = await Promise.all(
          successfullResponseOrdApiInscriptions.map(res => res.json())
        );

        const validatedResDataOrdApiInscriptions = (
          await Promise.allSettled(
            parsedResponseInscriptions.map(res =>
              ordApiXyzGetInscriptionByInscriptionSchema.validate(res)
            )
          )
        )
          .filter(
            (p): p is PromiseFulfilledResult<OrdApiXyzGetInscriptionByInscriptionSchema> =>
              p.status === 'fulfilled'
          )
          .map(p => p.value);

        validatedResDataOrdApiInscriptions.forEach(data => {
          // TODO: this if/else contains some repetition and works due to the
          // limited amount of ordinal types currently supported. Perhaps worth
          // converting to switch when new ordinal types are supported and
          // extracting reusable code from each branch.
          if (data['content type'].startsWith('image/')) {
            foundOrdinals.push({
              type: OrdinalType.Image,
              title: data.title,
              infoUrl: `https://ordinals.com${data.content}`.replace('content', 'inscription'),
              content: `https://ordinals.com${data.content}`,
            });
          } else {
            foundOrdinals.push({
              type: OrdinalType.Other,
              title: data.title,
              infoUrl: `https://ordinals.com${data.content}`.replace('content', 'inscription'),
            });
          }
        });
        index += 1;
      }

      return foundOrdinals;
    },
    {
      enabled: Boolean(keychain),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 5 * 60 * 1000,
    }
  );
}
