import * as secp from '@noble/secp256k1';
import { HDKey } from '@scure/bip32';
import { useQuery } from '@tanstack/react-query';
import * as btc from 'micro-btc-signer';

import { NetworkConfiguration, NetworkModes } from '@shared/constants';
import { getBtcSignerLibNetworkByMode } from '@shared/crypto/bitcoin/bitcoin.network';

import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { ordApiXyzGetInscriptionByAddressSchema } from './utils';

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

  return address.address;
}

export function useGetOrdinalsQuery() {
  const network = useCurrentNetwork();
  const account = useCurrentAccount();
  const keychain = useKeychain();

  return useQuery(
    ['ordinals', account, keychain, network] as const,
    async ({ queryKey }) => {
      const [_, __, keychain, network] = queryKey;
      if (!keychain) throw new Error('Expected keychain to be provided.');

      let currentNumberOfAddressesWithoutOrdinals = 0;
      let index = 0;
      const foundOrdinals: { title: string; content: string; preview: string }[] = [];

      while (
        currentNumberOfAddressesWithoutOrdinals < stopSearchAfterNumberAddressesWithoutOrdinals
      ) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // TODO: look into optimizing throttling

        const address = getTaprootAddress(index, keychain(0), network);

        const responseOrdApi = await fetch(`https://ordapi.xyz/address/${address}`);
        if (!responseOrdApi.ok) {
          throw new Error(`Failed to fetch ordinal info for address ${address}`);
        }

        const parsedResponse = await responseOrdApi.json();

        const validatedResData =
          ordApiXyzGetInscriptionByAddressSchema.validateSync(parsedResponse);

        if (hasNoOrdinals(validatedResData)) {
          currentNumberOfAddressesWithoutOrdinals += 1;
          index += 1;
          // eslint-disable-next-line no-console
          console.log('Fresh address with no ordinals: ', address);
          break;
        }

        currentNumberOfAddressesWithoutOrdinals = 0;

        const filteredOrdinals = validatedResData.filter(entry => {
          return ['image/webp', 'image/jpeg'].includes(entry['content type']);
        });
        const data = filteredOrdinals.map(i => ({
          title: i.title,
          content: `https://ordinals.com${i.content}`,
          preview: `https://ordinals.com${i.preview}`,
        }));
        foundOrdinals.concat(data);
        index += 1;
      }

      return foundOrdinals;
    },
    { enabled: Boolean(account) }
  );
}
