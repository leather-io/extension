// https://gist.github.com/Azayzel/6438e3c5b2d16381ced14fe0da78c123
// investigaste moving to an object config to clean this up. Also possibly using lazy load (maybe not now)
// https://www.youtube.com/watch?v=YF9L6PUAMWk
// https://www.ryanjyost.com/react-routing/
import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ReceiveBtcModal } from '@app/pages/receive-tokens/receive-btc';
import { ReceiveModal } from '@app/pages/receive-tokens/receive-modal';
import { ReceiveStxModal } from '@app/pages/receive-tokens/receive-stx';
import { ReceiveCollectibleModal } from '@app/pages/receive/receive-collectible/receive-collectible-modal';
import { ReceiveCollectibleOrdinal } from '@app/pages/receive/receive-collectible/receive-collectible-ordinal';

export function ReceiveRoutes() {
  return (
    <Route>
      <Route path={RouteUrls.Receive} element={<ReceiveModal />}>
        <Route path={RouteUrls.ReceiveStx} element={<ReceiveStxModal />} />
        <Route path={RouteUrls.ReceiveBtc} element={<ReceiveBtcModal />} />
        {/* Needed to show receive ordinal in Receive flow */}
        <Route path={RouteUrls.ReceiveCollectibleOrdinal} element={<ReceiveCollectibleOrdinal />} />
      </Route>

      {/* Needed to show receive ordinal in Add flow */}
      <Route
        path={`${RouteUrls.Receive}/${RouteUrls.ReceiveCollectible}`}
        element={<ReceiveCollectibleModal />}
      />
      <Route path={RouteUrls.ReceiveCollectibleOrdinal} element={<ReceiveCollectibleOrdinal />} />
    </Route>
  );
}

export const receiveRoutesArray = [
  {
    path: RouteUrls.Receive,
    element: <ReceiveModal />,
    routes: [
      {
        path: RouteUrls.ReceiveStx,
        element: <ReceiveStxModal />,
      },
      {
        path: RouteUrls.ReceiveCollectibleOrdinal,
        element: <ReceiveCollectibleOrdinal />,
      },
      {
        path: RouteUrls.ReceiveBtc,
        element: <ReceiveBtcModal />,
      },
    ],
  },
  {
    path: `${RouteUrls.Receive}/${RouteUrls.ReceiveCollectible}`,
    element: <ReceiveCollectibleModal />,
  },
  {
    path: RouteUrls.ReceiveCollectibleOrdinal,
    element: <ReceiveCollectibleOrdinal />,
  },
];
