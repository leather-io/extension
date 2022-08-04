import { ExternalMethods, LegacyMessageFromContentScript } from '@shared/message-types';
import { RouteUrls } from '@shared/route-urls';
import { popupCenter } from './popup-center';

const IS_TEST_ENV = process.env.TEST_ENV === 'true';

//
// Playwright does not currently support Chrome extension popup testing:
// https://github.com/microsoft/playwright/issues/5593
async function openRequestInFullPage(path: string, urlParams: URLSearchParams) {
  await chrome.tabs.create({
    url: chrome.runtime.getURL(`index.html#${path}?${urlParams.toString()}`),
  });
}

export function inferLegacyMessage(message: any): message is LegacyMessageFromContentScript {
  // Now that we use a RPC communication style, we can infer
  // legacy message types by presence of an id
  const hasIdProp = 'id' in message;
  return !hasIdProp;
}

function makeSearchParamsWithDefaults(
  port: chrome.runtime.Port,
  otherParams: [string, string][] = []
) {
  const urlParams = new URLSearchParams();
  //
  // All actions must have a corresponding `origin` and `tabId`
  urlParams.set('origin', port.sender?.origin ?? '');
  urlParams.set('tabId', port.sender?.tab?.id?.toString() ?? '');
  otherParams.forEach(([key, value]) => urlParams.set(key, value));
  return urlParams;
}

async function triggerRequstAction(path: RouteUrls, urlParams: URLSearchParams) {
  if (IS_TEST_ENV) {
    await openRequestInFullPage(path, urlParams);
    return;
  }
  popupCenter({ url: `/popup-center.html#${path}?${urlParams.toString()}` });
}

export async function handleLegacyExternalMethodFormat(
  message: LegacyMessageFromContentScript,
  port: chrome.runtime.Port
) {
  const { payload } = message;

  switch (message.method) {
    case ExternalMethods.authenticationRequest: {
      const urlParams = makeSearchParamsWithDefaults(port, [['authRequest', payload]]);

      await triggerRequstAction(RouteUrls.Onboarding, urlParams);
      break;
    }

    case ExternalMethods.transactionRequest: {
      const urlParams = makeSearchParamsWithDefaults(port, [['request', payload]]);

      await triggerRequstAction(RouteUrls.TransactionRequest, urlParams);
      break;
    }

    case ExternalMethods.signatureRequest: {
      const urlParams = makeSearchParamsWithDefaults(port, [
        ['request', payload],
        ['messageType', 'utf8'],
      ]);

      await triggerRequstAction(RouteUrls.SignatureRequest, urlParams);
      break;
    }

    case ExternalMethods.structuredDataSignatureRequest: {
      const urlParams = makeSearchParamsWithDefaults(port, [
        ['request', payload],
        ['messageType', 'structured'],
      ]);

      await triggerRequstAction(RouteUrls.SignatureRequest, urlParams);
      break;
    }
  }
}
