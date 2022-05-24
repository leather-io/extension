function formatInitiator(initiator: string) {
  const [protocol, host] = initiator.split('://');
  return [protocol, '://hiro-web-extension.', host].join('');
}

export function addRefererHeaderRequestListener() {
  const handler = (details: chrome.webRequest.WebRequestHeadersDetails) => {
    if (!details.requestHeaders) return;
    const headers = [...details.requestHeaders];
    if (details.initiator === `chrome-extension://${chrome.runtime.id}`) {
      headers.push({ name: 'Referer', value: formatInitiator(details.initiator) });
    }
    return { requestHeaders: headers };
  };
  chrome.webRequest.onBeforeSendHeaders.addListener(
    handler,
    {
      urls: ['https://*.stacks.co/*'],
    },
    ['requestHeaders', 'blocking', 'extraHeaders']
  );
  return () => chrome.webRequest.onBeforeSendHeaders.removeListener(handler);
}
