import { SwapAssetsPair } from '../swap-assets-pair/swap-assets-pair';
import { StacksSwapDetails } from '../swap-details/stacks-swap-details';
import { SwapReviewLayout } from './swap-review.layout';

export function StacksSwapReview() {
  return (
    <SwapReviewLayout>
      <SwapAssetsPair />
      <StacksSwapDetails />
    </SwapReviewLayout>
  );
}
