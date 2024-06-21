import type React from 'react';

import type { Blockchains, Currencies } from '@leather.io/models';
import { ItemLayout, Pressable } from '@leather.io/ui';

import { capitalize } from '@app/common/utils';
import { useCheckLedgerBlockchainAvailable } from '@app/store/accounts/blockchain/utils';

import type { AssetListVariant } from '../asset-list';
import { ConnectLedgerButton } from './connect-ledger-asset-button';

interface ConnectLedgerAssetItemFallbackProps {
  chain: Blockchains;
  icon: React.ReactNode;
  symbol: Currencies;
  variant: AssetListVariant;
}
export function ConnectLedgerAssetItemFallback({
  chain,
  icon,
  symbol,
  variant,
}: ConnectLedgerAssetItemFallbackProps) {
  const checkBlockchainAvailable = useCheckLedgerBlockchainAvailable();
  if (variant === 'interactive' && !checkBlockchainAvailable(chain)) return null;
  return (
    <Pressable my="space.02">
      <ItemLayout
        flagImg={icon}
        captionLeft={symbol}
        titleLeft={capitalize(chain)}
        titleRight={<ConnectLedgerButton chain={chain} />}
      />
    </Pressable>
  );
}
