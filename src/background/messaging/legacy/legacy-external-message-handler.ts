import { isObject } from '@leather.io/utils';

import { formatAuthResponse } from '@shared/actions/finalize-auth-reaponse-format';
import { formatMessageSigningResponse } from '@shared/actions/finalize-message-signature-format';
import { formatProfileUpdateResponse } from '@shared/actions/finalize-profile-update';
import { formatPsbtResponse } from '@shared/actions/finalize-psbt';
import { formatTxSignatureResponse } from '@shared/actions/finalize-tx-signature-format';
import { ExternalMethods, LegacyMessageFromContentScript } from '@shared/message-types';
import { RouteUrls } from '@shared/route-urls';
import { getLegacyTransactionPayloadFromToken } from '@shared/utils/legacy-requests';

import { queueAnalyticsRequest } from '@background/background-analytics';
import {
  createConnectingAppSearchParamsWithLastKnownAccount,
  listenForOriginTabClose,
  listenForPopupClose,
  triggerRequestPopupWindowOpen,
} from '@background/messaging/rpc-request-utils';

export function isLegacyMessage(message: any): message is LegacyMessageFromContentScript {
  // Now that we use a RPC communication style, we can infer
  // legacy message types by presence of an id
  const hasIdProp = 'id' in message;
  return !hasIdProp;
}

// We need this function because the latest changes
// to `@stacks/network` had some undesired consequence.
// As `StacksNetwork` is a class instance, this is auto
// serialized when being passed across `postMessage`,
// from the developer's app, to Leather.
// `coreApiUrl` now uses a getter, rather than a prop,
// and `_coreApiUrl` is a private value.
// To support both `@stacks/network` versions a dev may be using
// we look for both possible networks defined
function getLegacyStacksNetworkCoreApiUrl(network: any): string {
  if ('coreApiUrl' in network) return network.coreApiUrl;
  if (network._coreApiUrl) return network._coreApiUrl;
  return '';
}

function getNetworkParamsFromPayload(payload: string): [string, string][] {
  const { network } = getLegacyTransactionPayloadFromToken(payload);
  if (!network || !isObject(network)) return [];
  const developerDefinedApiUrl = getLegacyStacksNetworkCoreApiUrl(network);
  return [
    ['coreApiUrl', 'coreApiUrl' in network ? developerDefinedApiUrl : ''],
    ['networkChainId', 'chainId' in network ? network.chainId.toString() : ''],
  ];
}

interface TrackLegacyRequestInitiatedArgs {
  method: ExternalMethods;
}
async function trackLegacyRequestInitiated(args: TrackLegacyRequestInitiatedArgs) {
  return queueAnalyticsRequest('legacy_request_initiated', { ...args });
}

export async function handleLegacyExternalMethodFormat(
  message: LegacyMessageFromContentScript,
  port: chrome.runtime.Port
) {
  const { payload } = message;

  switch (message.method) {
    case ExternalMethods.authenticationRequest: {
      void trackLegacyRequestInitiated({ method: ExternalMethods.authenticationRequest });

      const { urlParams, tabId } = await createConnectingAppSearchParamsWithLastKnownAccount(port, [
        ['authRequest', payload],
        ['flow', ExternalMethods.authenticationRequest],
      ]);

      const { id } = await triggerRequestPopupWindowOpen(RouteUrls.ChooseAccount, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatAuthResponse({ request: payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }

    case ExternalMethods.transactionRequest: {
      void trackLegacyRequestInitiated({ method: ExternalMethods.transactionRequest });

      const { urlParams, tabId } = await createConnectingAppSearchParamsWithLastKnownAccount(port, [
        ['request', payload],
        ['flow', ExternalMethods.transactionRequest],
        ...getNetworkParamsFromPayload(payload),
      ]);

      const { id } = await triggerRequestPopupWindowOpen(RouteUrls.TransactionRequest, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatTxSignatureResponse({ payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }

    case ExternalMethods.signatureRequest: {
      void trackLegacyRequestInitiated({ method: ExternalMethods.signatureRequest });

      const { urlParams, tabId } = await createConnectingAppSearchParamsWithLastKnownAccount(port, [
        ['request', payload],
        ['messageType', 'utf8'],
        ['flow', ExternalMethods.signatureRequest],
        ...getNetworkParamsFromPayload(payload),
      ]);

      const { id } = await triggerRequestPopupWindowOpen(RouteUrls.SignatureRequest, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatMessageSigningResponse({ request: payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }

    case ExternalMethods.structuredDataSignatureRequest: {
      void trackLegacyRequestInitiated({ method: ExternalMethods.structuredDataSignatureRequest });

      const { urlParams, tabId } = await createConnectingAppSearchParamsWithLastKnownAccount(port, [
        ['request', payload],
        ['messageType', 'structured'],
        ['flow', ExternalMethods.structuredDataSignatureRequest],
        ...getNetworkParamsFromPayload(payload),
      ]);

      const { id } = await triggerRequestPopupWindowOpen(RouteUrls.SignatureRequest, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatMessageSigningResponse({ request: payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }

    case ExternalMethods.profileUpdateRequest: {
      void trackLegacyRequestInitiated({ method: ExternalMethods.profileUpdateRequest });

      const { urlParams, tabId } = await createConnectingAppSearchParamsWithLastKnownAccount(port, [
        ['request', payload],
      ]);

      const { id } = await triggerRequestPopupWindowOpen(RouteUrls.ProfileUpdateRequest, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatProfileUpdateResponse({ request: payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }

    case ExternalMethods.psbtRequest: {
      void trackLegacyRequestInitiated({ method: ExternalMethods.psbtRequest });

      const { urlParams, tabId } = await createConnectingAppSearchParamsWithLastKnownAccount(port, [
        ['request', payload],
      ]);

      const { id } = await triggerRequestPopupWindowOpen(RouteUrls.PsbtRequest, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatPsbtResponse({ request: payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }
  }
}
