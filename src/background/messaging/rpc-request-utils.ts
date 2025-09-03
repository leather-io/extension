import type { To } from 'react-router';

import { z } from 'zod';

import {
  RpcErrorCode,
  type RpcMethodNames,
  type RpcRequests,
  createRpcErrorResponse,
} from '@leather.io/rpc';
import { isUndefined } from '@leather.io/utils';

import { InternalMethods } from '@shared/message-types';
import { sendMessage } from '@shared/messages';
import { getPermissionsByOrigin } from '@shared/permissions/permission.helpers';
import { RouteUrls } from '@shared/route-urls';
import {
  RpcErrorMessage,
  getRpcParamErrorsFormatted,
  validateRpcParams,
} from '@shared/rpc/methods/validation.utils';
import { getHostnameFromUrl } from '@shared/utils/urls';

import { popup } from '@background/popup';

import { trackRpcRequestError } from './rpc-helpers';

function getTabIdFromSender(sender: chrome.runtime.MessageSender) {
  return sender?.tab?.id ?? 0;
}

function getOriginFromSender(sender: chrome.runtime.MessageSender) {
  if (sender?.url) return new URL(sender.url).origin;
  return sender?.origin;
}

export function getHostnameFromSender(sender: chrome.runtime.MessageSender) {
  const origin = getOriginFromSender(sender);
  if (!origin) throw new Error('No URL found in sender');
  return getHostnameFromUrl(origin);
}

export function sendRpcResponse(
  sender: chrome.runtime.MessageSender,
  response: any,
  sendResponse?: (response: any) => void
) {
  if (sendResponse) {
    // Internal extension call - use sendResponse callback
    sendResponse(response);
  } else {
    // External call - use chrome.tabs.sendMessage
    const tabId = getTabIdFromSender(sender);
    chrome.tabs.sendMessage(tabId, response);
  }
}

//
// Playwright does not currently support Chrome extension popup testing:
// https://github.com/microsoft/playwright/issues/5593
async function openRequestInFullPage(path: string | To, urlParams: URLSearchParams) {
  return chrome.tabs.create({
    url: chrome.runtime.getURL(`index.html#${path}?${urlParams.toString()}`),
  });
}

interface ListenForPopupCloseArgs {
  // ID that comes from newly created window
  id?: number;
  // TabID from requesting tab, to which request should be returned
  tabId?: number;
  response: any;
}
export function listenForPopupClose({ id, tabId, response }: ListenForPopupCloseArgs) {
  chrome.windows.onRemoved.addListener(winId => {
    if (winId !== id || !tabId) return;
    const responseMessage = response;
    chrome.tabs.sendMessage(tabId, responseMessage);
  });
}

interface SendErrorResponseOnUserPopupCloseArgs {
  tabId?: number;
  id: number;
  request: RpcRequests;
  message?: string;
}
export function sendErrorResponseOnUserPopupClose({
  tabId,
  id,
  message,
  request,
}: SendErrorResponseOnUserPopupCloseArgs) {
  listenForPopupClose({
    tabId,
    id,
    response: createRpcErrorResponse(request.method, {
      id: request.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: message ?? RpcErrorMessage.UserRejectedOperation,
      },
    }),
  });
}

interface ListenForOriginTabCloseArgs {
  tabId?: number;
}
export function listenForOriginTabClose({ tabId }: ListenForOriginTabCloseArgs) {
  chrome.tabs.onRemoved.addListener(closedTabId => {
    if (tabId !== closedTabId) return;
    sendMessage({ method: InternalMethods.OriginatingTabClosed, payload: { tabId } });
  });
}

export type RequestParams = [string, string][];

export function createConnectingAppMetadataSearchParams(
  sender: chrome.runtime.MessageSender,
  otherParams: RequestParams = []
) {
  const urlParams = new URLSearchParams();
  const origin = getOriginFromSender(sender);
  const tabId = getTabIdFromSender(sender);
  urlParams.set('origin', origin ?? '');
  urlParams.set('tabId', tabId.toString());
  otherParams.forEach(([key, value]) => urlParams.append(key, value));
  return { urlParams, origin, tabId };
}

export async function createConnectingAppSearchParamsWithLastKnownAccount(
  sender: chrome.runtime.MessageSender,
  otherParams: RequestParams = []
) {
  const { urlParams, origin, tabId } = createConnectingAppMetadataSearchParams(sender, otherParams);
  if (origin) {
    const appPermissions = await getPermissionsByOrigin(getHostnameFromSender(sender));
    if (appPermissions) {
      urlParams.set('accountIndex', appPermissions.accountIndex.toString());
    }
  }
  return { urlParams, origin, tabId };
}

const IS_TEST_ENV = process.env.TEST_ENV === 'true';

export async function triggerRequestPopupWindowOpen(path: RouteUrls, urlParams: URLSearchParams) {
  if (IS_TEST_ENV) return openRequestInFullPage(path, urlParams);
  return popup({ url: `/popup.html#${path}?${urlParams.toString()}` });
}

export async function triggerSwapWindowOpen(path: To, urlParams: URLSearchParams) {
  if (IS_TEST_ENV) return openRequestInFullPage(path, urlParams);
  return popup({ url: `/popup.html#${path}?${urlParams.toString()}` });
}

type ValidationResult = 'success' | 'failure';

interface ValidateRequestParamsArgs {
  id: string;
  method: RpcMethodNames;
  params: unknown;
  sender: chrome.runtime.MessageSender;
  sendResponse(response: any): void;
  schema: z.Schema;
}
export function validateRequestParams({
  id,
  method,
  params,
  // sender,
  sendResponse,
  schema,
}: ValidateRequestParamsArgs): { status: ValidationResult } {
  if (isUndefined(params)) {
    void trackRpcRequestError({ endpoint: method, error: RpcErrorMessage.UndefinedParams });
    sendResponse(
      createRpcErrorResponse(method, {
        id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: RpcErrorMessage.UndefinedParams },
      })
    );
    return { status: 'failure' };
  }

  if (!validateRpcParams(params, schema)) {
    void trackRpcRequestError({ endpoint: method, error: RpcErrorMessage.InvalidParams });

    sendResponse(
      createRpcErrorResponse(method, {
        id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: getRpcParamErrorsFormatted(params, schema),
        },
      })
    );
    return { status: 'failure' };
  }
  return { status: 'success' };
}
