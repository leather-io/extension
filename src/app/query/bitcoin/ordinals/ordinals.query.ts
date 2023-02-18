import { useQuery } from '@tanstack/react-query';

import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { ordApiXyzGetInscriptionByAddressSchema } from './utils';

export function useGetOrdinalsQuery() {
  // TODO: although this hook returns a btc address, it's not the correct one for ordinals.
  const bitcoinAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();

  return useQuery(['ordinals', bitcoinAddress] as const, async ({ queryKey }) => {
    const [_, address] = queryKey;

    if (!address) return [];

    const responseOrdApi = await fetch(`https://ordapi.xyz/address/${address}`);
    const parsedResponse = await responseOrdApi.json();

    const validatedResData = ordApiXyzGetInscriptionByAddressSchema.validateSync(parsedResponse);

    const filteredOrdinals = validatedResData.filter(entry => {
      return ['image/webp', 'image/jpeg'].includes(entry['content type']);
    });
    const data = filteredOrdinals.map(i => ({
      title: i.title,
      content: `https://ordinals.com${i.content}`,
      preview: `https://ordinals.com${i.preview}`,
    }));

    return data;
  });
}
