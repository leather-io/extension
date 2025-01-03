import { Callout } from '@leather.io/ui';

import { SwapAssetsPair } from '../swap-assets-pair/swap-assets-pair';
import { BitcoinSwapDetails } from '../swap-details/bitcoin-swap-details';
import { SwapReviewLayout } from './swap-review.layout';

export function BitcoinSwapReview() {
  return (
    <SwapReviewLayout>
      <Callout borderRadius="4px" variant="warning" width="100%">
        Note that bridging from sBTC back to BTC is currently unavailable.
      </Callout>
      <SwapAssetsPair />
      <BitcoinSwapDetails />
    </SwapReviewLayout>
  );
}
