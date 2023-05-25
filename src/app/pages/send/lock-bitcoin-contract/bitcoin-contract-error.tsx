// import { useLocation } from 'react-router-dom';

// import get from 'lodash.get';

// import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
// import { useOnMount } from '@app/common/hooks/use-on-mount';

// import { BroadcastErrorLayout } from './components/broadcast-error.layout';

// export function LockBitcoinError() {
//   const { state } = useLocation();
//   const analytics = useAnalytics();
//   const msg = get(state, 'error.message', 'Unknown error response');

//   useOnMount(() => void analytics.track('bitcoin_broadcast_tx_error', { msg }));

//   return (
//     <BroadcastErrorLayout
//       my="loose"
//       textAlign="center"
//       errorPayload={msg}
//       title="There was an error broadcasting your transaction"
//       body="Unable to broadcast transaction"
//     />
//   );
// }
