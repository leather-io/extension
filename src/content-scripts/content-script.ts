/**
 Extensions that read or write to web pages utilize a content script. The content script
 contains JavaScript that executes in the contexts of a page that has been loaded into
 the browser. Content scripts read and modify the DOM of web pages the browser visits.
 https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#contentScripts
 */
import {
  AuthenticationRequestEvent,
  DomEventName,
  ProfileUpdateRequestEvent,
  PsbtRequestEvent,
  SignatureRequestEvent,
  TransactionRequestEvent,
} from '@shared/inpage-types';
import {
  CONTENT_SCRIPT_PORT,
  ExternalMethods,
  LegacyMessageFromContentScript,
  LegacyMessageToContentScript,
  MESSAGE_SOURCE,
} from '@shared/message-types';
import { RouteUrls } from '@shared/route-urls';

let backgroundPort: any;

// Connection to background script - fires onConnect event in background script
// and establishes two-way communication
function connect() {
  backgroundPort = chrome.runtime.connect({ name: CONTENT_SCRIPT_PORT });
  backgroundPort.onDisconnect.addListener(connect);
}

connect();

// Sends message to background script that an event has fired
function sendMessageToBackground(message: LegacyMessageFromContentScript) {
  backgroundPort.postMessage(message);
}

// Receives message from background script to execute in browser
chrome.runtime.onMessage.addListener((message: LegacyMessageToContentScript) => {
  if (message.source === MESSAGE_SOURCE || (message as any).jsonrpc === '2.0') {
    window.postMessage(message, window.location.origin);
  }
});

interface ForwardDomEventToBackgroundArgs {
  payload: string;
  method: LegacyMessageFromContentScript['method'];
  urlParam: string;
  path: RouteUrls;
}
function forwardDomEventToBackground({ payload, method }: ForwardDomEventToBackgroundArgs) {
  sendMessageToBackground({
    method,
    payload,
    source: MESSAGE_SOURCE,
  });
}

document.addEventListener(DomEventName.request, (event: any) => {
  sendMessageToBackground({ source: MESSAGE_SOURCE, ...event.detail });
});

// Listen for a CustomEvent (auth request) coming from the web app
document.addEventListener(DomEventName.authenticationRequest, ((
  event: AuthenticationRequestEvent
) => {
  forwardDomEventToBackground({
    path: RouteUrls.Onboarding,
    payload: event.detail.authenticationRequest,
    urlParam: 'authRequest',
    method: ExternalMethods.authenticationRequest,
  });
}) as EventListener);

// Listen for a CustomEvent (transaction request) coming from the web app
document.addEventListener(DomEventName.transactionRequest, ((event: TransactionRequestEvent) => {
  forwardDomEventToBackground({
    path: RouteUrls.TransactionRequest,
    payload: event.detail.transactionRequest,
    urlParam: 'request',
    method: ExternalMethods.transactionRequest,
  });
}) as EventListener);

// Listen for a CustomEvent (signature request) coming from the web app
document.addEventListener(DomEventName.signatureRequest, ((event: SignatureRequestEvent) => {
  forwardDomEventToBackground({
    path: RouteUrls.SignatureRequest,
    payload: event.detail.signatureRequest,
    urlParam: 'request',
    method: ExternalMethods.signatureRequest,
  });
}) as EventListener);

// Listen for a CustomEvent (structured data signature request) coming from the web app
document.addEventListener(DomEventName.structuredDataSignatureRequest, ((
  event: SignatureRequestEvent
) => {
  forwardDomEventToBackground({
    path: RouteUrls.SignatureRequest,
    payload: event.detail.signatureRequest,
    urlParam: 'request',
    method: ExternalMethods.structuredDataSignatureRequest,
  });
}) as EventListener);

// Listen for a CustomEvent (profile update request) coming from the web app
document.addEventListener(DomEventName.profileUpdateRequest, ((
  event: ProfileUpdateRequestEvent
) => {
  forwardDomEventToBackground({
    path: RouteUrls.ProfileUpdateRequest,
    payload: event.detail.profileUpdateRequest,
    urlParam: 'request',
    method: ExternalMethods.profileUpdateRequest,
  });
}) as EventListener);

// Listen for a CustomEvent (psbt request) coming from the web app
document.addEventListener(DomEventName.psbtRequest, ((event: PsbtRequestEvent) => {
  forwardDomEventToBackground({
    path: RouteUrls.PsbtRequest,
    payload: event.detail.psbtRequest,
    urlParam: 'request',
    method: ExternalMethods.psbtRequest,
  });
}) as EventListener);

function addHiroWalletToPage() {
  const inpage = document.createElement('script');
  inpage.src = chrome.runtime.getURL('inpage.js');
  inpage.id = 'hiro-wallet-provider';
  document.body.appendChild(inpage);
}

// Don't block thread to add Hiro Wallet to page
requestAnimationFrame(() => addHiroWalletToPage());
