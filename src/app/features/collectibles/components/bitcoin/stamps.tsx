import { useEffect } from 'react';

import { analytics } from '@shared/utils/analytics';

import { useStampsByAddress } from '@app/query/bitcoin/stamps/stamps-by-address.hooks';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { Stamp } from './stamp';

export function Stamps() {
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const { data: stamps = [] } = useStampsByAddress(currentAccountBtcAddress);

  useEffect(() => {
    if (!stamps.length) return;
    if (stamps.length > 0) {
      void analytics.track('view_collectibles', {
        stamps_count: stamps.length,
      });
      void analytics.identify(undefined, { stamps_count: stamps.length });
    }
  }, [stamps]);

  if (!stamps.length) return null;

  return stamps.map(s => <Stamp bitcoinStamp={s} key={s.tx_hash} />);
}
