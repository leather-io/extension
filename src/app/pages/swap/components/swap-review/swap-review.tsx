import { useParams } from 'react-router-dom';

import { BitcoinSwapReview } from './bitcoin-swap-review';
import { StacksSwapReview } from './stacks-swap-review';

export function SwapReview() {
  const { origin } = useParams();

  switch (origin) {
    case 'bitcoin':
      return <BitcoinSwapReview />;
    case 'stacks':
      return <StacksSwapReview />;
    default:
      return null;
  }
}
