import { type RpcRequests } from '@leather.io/rpc';

import { queueAnalyticsRequest } from '@background/background-analytics';

interface TrackRpcRequestSuccess {
  endpoint: RpcRequests['method'];
}
export async function trackRpcRequestSuccess(args: TrackRpcRequestSuccess) {
  return queueAnalyticsRequest('rpc_request_successful', { ...args });
}

interface TrackRpcRequestError {
  endpoint: RpcRequests['method'];
  error: string;
}
export async function trackRpcRequestError(args: TrackRpcRequestError) {
  return queueAnalyticsRequest('rpc_request_error', { ...args });
}

export function openNewTabWithWallet() {
  return chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
}
