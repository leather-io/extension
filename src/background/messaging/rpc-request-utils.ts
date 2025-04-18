import type { To } from 'react-router-dom';

import { type PostConditionWire, serializePostConditionWire } from '@stacks/transactions';
import type { Json } from 'jsontokens';
import * as z from 'zod';

import {
  RpcErrorCode,
  type RpcMethodNames,
  type RpcRequests,
  type baseStacksTransactionConfigSchema,
  createRpcErrorResponse,
} from '@leather.io/rpc';
import { getPrincipalFromAssetString } from '@leather.io/stacks';
import { isDefined, isUndefined } from '@leather.io/utils';

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

export function getTabIdFromPort(port: chrome.runtime.Port) {
  return port.sender?.tab?.id ?? 0;
}

function getOriginFromPort(port: chrome.runtime.Port) {
  if (port.sender?.url) return new URL(port.sender.url).origin;
  return port.sender?.origin;
}

export function getHostnameFromPort(port: chrome.runtime.Port) {
  const origin = getOriginFromPort(port);
  if (!origin) throw new Error('No URL found in port sender');
  return getHostnameFromUrl(origin);
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

export async function makeSearchParamsWithDefaults(
  port: chrome.runtime.Port,
  otherParams: RequestParams = []
) {
  const urlParams = new URLSearchParams();
  // All actions must have a corresponding `origin` and `tabId`
  const hostname = getHostnameFromPort(port);
  const tabId = getTabIdFromPort(port);
  urlParams.set('origin', hostname ?? '');
  urlParams.set('tabId', tabId.toString());
  if (hostname) {
    const appPermissions = await getPermissionsByOrigin(hostname);
    if (appPermissions) {
      urlParams.set('accountIndex', appPermissions.accountIndex.toString());
    }
  }
  otherParams.forEach(([key, value]) => urlParams.append(key, value));
  return { urlParams, origin: hostname, tabId };
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

export function encodePostConditions(postConditions: PostConditionWire[]) {
  return postConditions.map(pc => serializePostConditionWire(pc));
}

type ValidationResult = 'success' | 'failure';

interface ValidateRequestParamsArgs {
  id: string;
  method: RpcMethodNames;
  params: unknown;
  port: chrome.runtime.Port;
  schema: z.Schema;
}
export function validateRequestParams({
  id,
  method,
  params,
  port,
  schema,
}: ValidateRequestParamsArgs): { status: ValidationResult } {
  if (isUndefined(params)) {
    void trackRpcRequestError({ endpoint: method, error: RpcErrorMessage.UndefinedParams });
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      createRpcErrorResponse(method, {
        id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: RpcErrorMessage.UndefinedParams },
      })
    );
    return { status: 'failure' };
  }

  if (!validateRpcParams(params, schema)) {
    void trackRpcRequestError({ endpoint: method, error: RpcErrorMessage.InvalidParams });

    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
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

type BaseStacksTransactionRpcParams = z.infer<typeof baseStacksTransactionConfigSchema>;

export function getStxDefaultMessageParamsToTransactionRequest(
  params: BaseStacksTransactionRpcParams
) {
  const txRequest: Json = {};

  if ('address' in params && isDefined(params.address)) {
    txRequest.stxAddress = params.address;
  }
  if ('fee' in params && isDefined(params.fee)) {
    txRequest.fee = params.fee;
  }
  if ('nonce' in params && isDefined(params.nonce)) {
    txRequest.nonce = params.nonce;
  }
  if ('postConditions' in params && isDefined(params.postConditions)) {
    txRequest.postConditions = params.postConditions;
  }
  if ('postConditionMode' in params && isDefined(params.postConditionMode)) {
    txRequest.postConditionMode = params.postConditionMode;
  }
  if ('sponsored' in params && isDefined(params.sponsored)) {
    txRequest.sponsored = params.sponsored;
  }

  return txRequest;
}

// TODO: Relocate to mono repo, we have this in services but not stacks pkg
// See in services, getAddressFromAssetIdentifier
export function getAddressFromAssetString(assetString: string) {
  const principal = getPrincipalFromAssetString(assetString);
  return principal.split('.')[0];
}
