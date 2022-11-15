import { AnalyticsBrowser } from '@segment/analytics-next';

import { IS_TEST_ENV, SEGMENT_WRITE_KEY } from '@shared/environment';

function initAnalytics() {
  if (IS_TEST_ENV || !SEGMENT_WRITE_KEY) return null;

  return AnalyticsBrowser.load(
    { writeKey: SEGMENT_WRITE_KEY },
    {
      integrations: {
        'Segment.io': {
          deliveryStrategy: {
            strategy: 'batching',
            config: {
              size: 10,
              timeout: 5000,
            },
          },
        },
      },
    }
  );
}
export const analytics: null | AnalyticsBrowser = initAnalytics();

export function initSentry() {
  // TODO
  // https://github.com/hirosystems/stacks-wallet-web/issues/2822
}
