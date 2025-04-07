import { useQuery } from '@tanstack/react-query';

import { bitcoinNetworkModeToCoreNetworkMode } from '@leather.io/bitcoin';
import { createGetBnsNamesOwnedByAddressQueryOptions } from '@leather.io/query';
import { isUndefined } from '@leather.io/utils';

import { parseIfValidPunycode } from '@app/common/utils';
import { formatAccountName } from '@app/common/utils/format-account-name';
import { getAutogeneratedAccountDisplayName } from '@app/common/utils/get-account-display-name';
import { useBnsV2Client } from '@app/query/stacks/bns/bns-v2-client';
import {
  useCurrentStacksAccount,
  useCurrentStacksAccountAddress,
} from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export function useCurrentAccountDisplayName() {
  const account = useCurrentStacksAccount();
  const address = useCurrentStacksAccountAddress();
  const { chain } = useCurrentNetworkState();
  const network = bitcoinNetworkModeToCoreNetworkMode(chain.bitcoin.mode);
  const client = useBnsV2Client();

  return useQuery({
    ...createGetBnsNamesOwnedByAddressQueryOptions({ address, network, client }),
    select: resp => {
      if (isUndefined(account?.index) && (!account || typeof account?.index !== 'number'))
        return 'Account';
      const names = resp.names ?? [];
      if (names.length && names[0]) return parseIfValidPunycode(names[0]);
      return getAutogeneratedAccountDisplayName(account?.index);
    },
  });
}

export function useAccountDisplayName({ address, index }: { index: number; address: string }) {
  const { chain } = useCurrentNetworkState();
  const network = bitcoinNetworkModeToCoreNetworkMode(chain.bitcoin.mode);
  const client = useBnsV2Client();
  const query = useQuery({
    ...createGetBnsNamesOwnedByAddressQueryOptions({
      address,
      network,
      client,
    }),
    select: resp => {
      const names = resp.names ?? [];
      return (
        parseIfValidPunycode(formatAccountName(names[0])) ||
        getAutogeneratedAccountDisplayName(index)
      );
    },
  });

  return {
    ...query,
    data: query.data || getAutogeneratedAccountDisplayName(index),
  };
}
