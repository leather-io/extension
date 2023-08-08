import { FiArrowDown } from 'react-icons/fi';

import { Box } from '@stacks/ui';

import { SwapAsset } from '../../hooks/use-swap';
import { SwapAssetItem } from './swap-asset-item';
import { SwapAssetsPairLayout } from './swap-assets-pair.layout';

interface SwapAssetsPairProps {
  amountFrom: string;
  amountTo: string;
  assetFrom: SwapAsset;
  assetTo: SwapAsset;
}
export function SwapAssetsPair({ amountFrom, amountTo, assetFrom, assetTo }: SwapAssetsPairProps) {
  return (
    <SwapAssetsPairLayout>
      <SwapAssetItem icon={assetFrom.icon} symbol={assetFrom.balance.symbol} value={amountFrom} />
      <Box p="tight" size="32px">
        <FiArrowDown size="20px" />
      </Box>
      <SwapAssetItem icon={assetTo.icon} symbol={assetTo.balance.symbol} value={amountTo} />
    </SwapAssetsPairLayout>
  );
}
