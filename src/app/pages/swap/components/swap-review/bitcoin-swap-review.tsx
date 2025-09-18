import { SwapAssetsPair } from '../swap-assets-pair/swap-assets-pair';
import { BitcoinSwapDetails } from '../swap-details/bitcoin-swap-details';
import { SwapReviewLayout } from './swap-review.layout';

export function BitcoinSwapReview() {
  return (
    <SwapReviewLayout>
      <SwapAssetsPair />
      <BitcoinSwapDetails />
    </SwapReviewLayout>
  );
}
