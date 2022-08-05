// import { isUndefined } from '@shared/utils';
// import type Browser from 'webextension-polyfill';

// function formatInitiator(initiator: string) {
//   const [protocol, host] = initiator.split('://');
//   return [protocol, '://hiro-web-extension.', host].join('');
// }

// function filterOutExtraHeadersArgumentWhenFirefoxExtension(type: string, browserName: string) {
//   if (type === 'extraHeaders') return browserName !== 'Firefox';
//   return true;
// }

// async function getBrowserInfo() {
//   // `runtime.getBrowserInfo` only supported in Firefox
//   // https://github.com/mozilla/webextension-polyfill/issues/116
//   if (!isUndefined(browser.runtime.getBrowserInfo)) {
//     return browser.runtime.getBrowserInfo();
//   }
//   return { name: 'unknown-browser' };
// }

// function doesRequestOriginateFromExtension(requestInitiator: string) {
//   return requestInitiator.includes(browser.runtime.id);
// }

// export async function addRefererHeaderRequestListener() {
//   const handler = (details: Browser.WebRequest.OnBeforeSendHeadersDetailsType) => {
//     if (!details.requestHeaders) return;
//     const headers = [...details.requestHeaders];
//     const initiatorText = details.documentUrl || details.initiator || '';

//     if (initiatorText && doesRequestOriginateFromExtension(initiatorText)) {
//       headers.push({ name: 'Referer', value: formatInitiator(initiatorText) });
//     }
//     return { requestHeaders: headers };
//   };

//   const { name: browserName } = await getBrowserInfo();

//   const headerTypes = ['requestHeaders', 'blocking', 'extraHeaders'].filter(type =>
//     filterOutExtraHeadersArgumentWhenFirefoxExtension(type, browserName)
//   ) as Browser.WebRequest.OnBeforeSendHeadersOptions[];

//   browser.webRequest.onBeforeSendHeaders.addListener(
//     handler,
//     {
//       urls: ['https://*.stacks.co/*'],
//     },
//     headerTypes
//   );
//   return () => browser.webRequest.onBeforeSendHeaders.removeListener(handler);
// }
