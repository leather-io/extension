// Segment/Mixpanel libraries are not compatible with extension background
// scripts. This function adds analytics requests to chrome.storage.local so
// that, when opened, an extension frame (that does support analyics) can read
// and fire the requests.
const queueStore = 'backgroundAnalyticsRequests';

export async function queueAnalyticsRequest(
  eventName: string,
  properties: Record<string, unknown> = {}
) {
  const currentQueue = await chrome.storage.local.get(queueStore);
  const queue = currentQueue[queueStore] ?? [];
  return chrome.storage.local.set({
    [queueStore]: [
      ...queue,
      { eventName, properties: { ...properties, backgroundQueuedMessage: true } },
    ],
  });
}
