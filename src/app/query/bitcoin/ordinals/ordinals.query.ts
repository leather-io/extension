import * as secp from '@noble/secp256k1';
import { HDKey } from '@scure/bip32';
import { useQuery } from '@tanstack/react-query';
import * as btc from 'micro-btc-signer';

import { NetworkConfiguration, NetworkModes } from '@shared/constants';
import { getBtcSignerLibNetworkByMode } from '@shared/crypto/bitcoin/bitcoin.network';

import { useKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { ordApiXyzGetInscriptionByInscriptionSchema, ordApiXyzGetTransactionOutput } from './utils';

const stopSearchAfterNumberAddressesWithoutOrdinals = 20;

function hasNoOrdinals(data: Array<unknown>) {
  return data.length === 0;
}

function getTaprootAddress(index: number, key: HDKey, network: NetworkConfiguration) {
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

export function useGetOrdinalsQuery() {
  const network = useCurrentNetwork();
  const account = useCurrentAccount();
  const keychain = useKeychain();
  const client = useBitcoinClient();

  return useQuery(
    ['ordinals', account, keychain, network] as const,
    async ({ queryKey }) => {
      const [_, __, keychain, network] = queryKey;
      if (!keychain) throw new Error('Expected keychain to be provided.');

      let currentNumberOfAddressesWithoutOrdinals = 0;
      let index = 0;
      const foundOrdinals: { title: string; content: string; preview: string }[] = [];

      // What is this loop doing?
      //
      // 1. We query a generic blockchain API (blockstream) to get unspent transactions for the address and cherrypick the first to appear
      // 2. Then we pass that tx_hash to https://ordapi.xyz/output/:id to get the inscription ID
      // 3. Then we use the inscription ID to query https://ordapi.xyz/inscription/:id for the inscription metadata

      while (
        currentNumberOfAddressesWithoutOrdinals < stopSearchAfterNumberAddressesWithoutOrdinals
      ) {
        const address = getTaprootAddress(index, keychain(0), network);

        // 1.
        const unspentTransactions = await client.addressApi.getUtxosByAddress(address);

        if (hasNoOrdinals(unspentTransactions)) {
          currentNumberOfAddressesWithoutOrdinals += 1;
          index += 1;
          // eslint-disable-next-line no-console
          console.log('Fresh address with no ordinals: ', address);
          continue;
        }

        currentNumberOfAddressesWithoutOrdinals = 0; // TODO: is this in right place still?

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

      console.log('DATA: ', foundOrdinals);

      return foundOrdinals;
    },
    { enabled: Boolean(account) }
  );
}
