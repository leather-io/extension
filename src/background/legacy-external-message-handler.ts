import { formatAuthResponse } from '@shared/actions/finalize-auth-response';
import { formatMessageSigningResponse } from '@shared/actions/finalize-message-signature';
import { formatTxSignatureResponse } from '@shared/actions/finalize-tx-signature';
import {
  ExternalMethods,
  InternalMethods,
  LegacyMessageFromContentScript,
  LegacyMessageToContentScript,
} from '@shared/message-types';
import { sendMessage } from '@shared/messages';
import { RouteUrls } from '@shared/route-urls';
import { getCoreApiUrl, getPayloadFromToken } from '@shared/utils/requests';

import { popupCenter } from './popup-center';

const IS_TEST_ENV = process.env.TEST_ENV === 'true';

//
// Playwright does not currently support Chrome extension popup testing:
// https://github.com/microsoft/playwright/issues/5593
async function openRequestInFullPage(path: string, urlParams: URLSearchParams) {
  return chrome.tabs.create({
    url: chrome.runtime.getURL(`index.html#${path}?${urlParams.toString()}`),
  });
}

export function isLegacyMessage(message: any): message is LegacyMessageFromContentScript {
  // Now that we use a RPC communication style, we can infer
  // legacy message types by presence of an id
  const hasIdProp = 'id' in message;
  return !hasIdProp;
}

function getTabIdFromPort(port: chrome.runtime.Port) {
  return port.sender?.tab?.id;
}

function getOriginFromPort(port: chrome.runtime.Port) {
  if (port.sender?.url) return new URL(port.sender.url).origin;
  return port.sender?.origin;
}

type OtherParams = [string, string][];

function makeSearchParamsWithDefaults(port: chrome.runtime.Port, otherParams: OtherParams = []) {
  const urlParams = new URLSearchParams();
  // All actions must have a corresponding `origin` and `tabId`
  const origin = getOriginFromPort(port);
  const tabId = getTabIdFromPort(port);
  urlParams.set('origin', origin ?? '');
  urlParams.set('tabId', tabId?.toString() ?? '');
  otherParams.forEach(([key, value]) => urlParams.set(key, value));
  return { urlParams, origin, tabId };
}

interface ListenForPopupCloseArgs {
  // ID that comes from newly created window
  id?: number;
  // TabID from requesting tab, to which request should be returned
  tabId?: number;
  response: LegacyMessageToContentScript;
}
function listenForPopupClose({ id, tabId, response }: ListenForPopupCloseArgs) {
  chrome.windows.onRemoved.addListener(winId => {
    if (winId !== id || !tabId) return;
    const responseMessage = response;
    chrome.tabs.sendMessage(tabId, responseMessage);
  });
}

interface ListenForOriginTabCloseArgs {
  tabId?: number;
}
function listenForOriginTabClose({ tabId }: ListenForOriginTabCloseArgs) {
  chrome.tabs.onRemoved.addListener(closedTabId => {
    if (tabId !== closedTabId) return;
    sendMessage({ method: InternalMethods.OriginatingTabClosed, payload: { tabId } });
  });
}

async function triggerRequestWindowOpen(path: RouteUrls, urlParams: URLSearchParams) {
  if (IS_TEST_ENV) return openRequestInFullPage(path, urlParams);
  return popupCenter({ url: `/popup-center.html#${path}?${urlParams.toString()}` });
}

function getNetworkParamsFromPayload(payload: string): [string, string][] {
  const { network } = getPayloadFromToken(payload);
  if (!network) return [];
  const developerDefinedApiUrl = getCoreApiUrl(network);
  return [
    ['coreApiUrl', developerDefinedApiUrl],
    ['networkChainId', network.chainId.toString()],
  ];
}

export async function handleLegacyExternalMethodFormat(
  message: LegacyMessageFromContentScript,
  port: chrome.runtime.Port
) {
  const { payload } = message;

  switch (message.method) {
    case ExternalMethods.authenticationRequest: {
      const otherParams: OtherParams = [
        ['authRequest', payload],
        ['flow', ExternalMethods.authenticationRequest],
      ];
      if (port.sender?.origin) otherParams.push(['referringAppDomain', port.sender.origin]);
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, otherParams);

      const { id } = await triggerRequestWindowOpen(RouteUrls.ChooseAccount, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatAuthResponse({ request: payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }

    case ExternalMethods.transactionRequest: {
      const otherParams: OtherParams = [
        ['request', payload],
        ...getNetworkParamsFromPayload(payload),
        ['flow', ExternalMethods.transactionRequest],
      ];
      if (port.sender?.origin) otherParams.push(['referringAppDomain', port.sender.origin]);
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, otherParams);

      const { id } = await triggerRequestWindowOpen(RouteUrls.TransactionRequest, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatTxSignatureResponse({ payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }

    case ExternalMethods.signatureRequest: {
      const otherParams: OtherParams = [
        ['request', payload],
        ['messageType', 'utf8'],
        ...getNetworkParamsFromPayload(payload),
        ['flow', ExternalMethods.signatureRequest],
      ];
      if (port.sender?.origin) otherParams.push(['referringAppDomain', port.sender.origin]);
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, otherParams);

      const { id } = await triggerRequestWindowOpen(RouteUrls.SignatureRequest, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatMessageSigningResponse({ request: payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }

    case ExternalMethods.structuredDataSignatureRequest: {
      const otherParams: OtherParams = [
        ['request', payload],
        ['messageType', 'structured'],
        ['flow', ExternalMethods.structuredDataSignatureRequest],
      ];
      if (port.sender?.origin) otherParams.push(['referringAppDomain', port.sender.origin]);
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, otherParams);

      const { id } = await triggerRequestWindowOpen(RouteUrls.SignatureRequest, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatMessageSigningResponse({ request: payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }
  }
}
