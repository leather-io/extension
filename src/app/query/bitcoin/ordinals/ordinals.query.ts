import { useQuery } from '@tanstack/react-query';

import { useCurrentTaprootAccountKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import {
  getTaprootAddress,
  hasOrdinals,
  ordApiXyzGetInscriptionByInscriptionSchema,
  ordApiXyzGetTransactionOutput,
} from './utils';

const stopSearchAfterNumberAddressesWithoutOrdinals = 20;

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
      // TODO: extract to type
      const foundOrdinals: { title: string; content: string; preview: string }[] = [];

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
        const responseOrdApiOutput = await fetch(
          `https://ordapi.xyz/output/${unspentTransactions[0].txid}:0`
        );
        if (!responseOrdApiOutput.ok) {
          throw new Error(`Failed to fetch ordinal info for address ${address}`);
        }

        const parsedResponseOrdApiOutput = await responseOrdApiOutput.json();

        const validatedResDataOrdApiOutput = ordApiXyzGetTransactionOutput.validateSync(
          parsedResponseOrdApiOutput
        );

        // 3.
        const responseOrdApiInscriptions = await fetch(
          `https://ordapi.xyz${validatedResDataOrdApiOutput.inscriptions}`
        );
        if (!responseOrdApiInscriptions.ok) {
          throw new Error(`Failed to fetch ordinal info for address ${address}`);
        }

        const parsedResponseInscriptions = await responseOrdApiInscriptions.json();

        const validatedResDataOrdApiInscriptions =
          ordApiXyzGetInscriptionByInscriptionSchema.validateSync(parsedResponseInscriptions);

        if (validatedResDataOrdApiInscriptions['content type'].startsWith('image/')) {
          foundOrdinals.push({
            title: validatedResDataOrdApiInscriptions.title,
            content: `https://ordinals.com${validatedResDataOrdApiInscriptions.content}`,
            preview: `https://ordinals.com${validatedResDataOrdApiInscriptions.preview}`,
          });
        }
        index += 1;
      }

      return foundOrdinals;
    },
    { enabled: Boolean(keychain) }
  );
}
