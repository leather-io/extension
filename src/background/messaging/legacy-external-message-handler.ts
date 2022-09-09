import { formatAuthResponse } from '@shared/actions/finalize-auth-reaponse-format';
import { formatMessageSigningResponse } from '@shared/actions/finalize-message-signature-format';
import { formatProfileUpdateResponse } from '@shared/actions/finalize-profile-update';
import { formatPsbtResponse } from '@shared/actions/finalize-psbt';
import { formatTxSignatureResponse } from '@shared/actions/finalize-tx-signature-format';
import { ExternalMethods, LegacyMessageFromContentScript } from '@shared/message-types';
import { RouteUrls } from '@shared/route-urls';
import { getCoreApiUrl, getPayloadFromToken } from '@shared/utils/requests';

import {
  listenForOriginTabClose,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '@background/messaging/messaging-utils';

export function isLegacyMessage(message: any): message is LegacyMessageFromContentScript {
  // Now that we use a RPC communication style, we can infer
  // legacy message types by presence of an id
  const hasIdProp = 'id' in message;
  return !hasIdProp;
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
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [
        ['authRequest', payload],
        ['flow', ExternalMethods.authenticationRequest],
      ]);

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
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [
        ['request', payload],
        ['flow', ExternalMethods.transactionRequest],
        ...getNetworkParamsFromPayload(payload),
      ]);

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
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [
        ['request', payload],
        ['messageType', 'utf8'],
        ['flow', ExternalMethods.signatureRequest],
        ...getNetworkParamsFromPayload(payload),
      ]);

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
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [
        ['request', payload],
        ['messageType', 'structured'],
        ['flow', ExternalMethods.structuredDataSignatureRequest],
        ...getNetworkParamsFromPayload(payload),
      ]);

      const { id } = await triggerRequestWindowOpen(RouteUrls.SignatureRequest, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatMessageSigningResponse({ request: payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }

    case ExternalMethods.profileUpdateRequest: {
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['request', payload]]);

      const { id } = await triggerRequestWindowOpen(RouteUrls.ProfileUpdateRequest, urlParams);
      listenForPopupClose({
        id,
        tabId,
        response: formatProfileUpdateResponse({ request: payload, response: 'cancel' }),
      });
      listenForOriginTabClose({ tabId });
      break;
    }

    case ExternalMethods.psbtRequest: {
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['request', payload]]);

      const { id } = await triggerRequestWindowOpen(RouteUrls.PsbtRequest, urlParams);
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
