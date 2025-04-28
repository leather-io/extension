import {
  type ClarityValue,
  createAddress,
  createStacksPublicKey,
  noneCV,
  postConditionToWire,
  publicKeyToAddressSingleSig,
  serializeCV,
  serializePostConditionWire,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';
import { createUnsecuredToken } from 'jsontokens';

import { extractKeyFromDescriptor } from '@leather.io/crypto';
import type { NetworkModes } from '@leather.io/models';
import { type RpcParams, stxTransferSip10Ft } from '@leather.io/rpc';
import { TransactionTypes, getStacksAssetStringParts } from '@leather.io/stacks';

import { RouteUrls } from '@shared/route-urls';
import { getRootState, sendMissingStateErrorToTab } from '@shared/storage/get-root-state';
import { makeFtPostCondition } from '@shared/utils/post-conditions';

import type { RootState } from '@app/store';

import { handleRpcMessage } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';
import {
  type RequestParams,
  getAddressFromAssetString,
  getStxDefaultMessageParamsToTransactionRequest,
  getTabIdFromPort,
  validateRequestParams,
} from '../rpc-request-utils';

async function getMessageParamsToTransactionRequest(
  state: RootState,
  params: RpcParams<typeof stxTransferSip10Ft>
) {
  const { contractAddress, contractAssetName, contractName } = getStacksAssetStringParts(
    params.asset
  );

  const descriptor = state.chains.stx.default.currentAccountStacksDescriptor;
  const publicKey = createStacksPublicKey(extractKeyFromDescriptor(descriptor)).data;
  const currentStacksAddress = publicKeyToAddressSingleSig(
    publicKey,
    state.networks.currentNetworkId as NetworkModes
  );

  const fnArgs: ClarityValue[] = [
    uintCV(params.amount),
    standardPrincipalCVFromAddress(createAddress(params.address ?? currentStacksAddress)),
    standardPrincipalCVFromAddress(createAddress(params.recipient)),
    noneCV(), // Add memo to SIP-30?
  ];

  const postConditionOptions = {
    amount: params.amount,
    contractAddress,
    contractAssetName,
    contractName,
    stxAddress: params.address ?? currentStacksAddress,
  };

  const defaultParams = getStxDefaultMessageParamsToTransactionRequest(params);

  return {
    ...defaultParams,
    txType: TransactionTypes.ContractCall,
    contractAddress: getAddressFromAssetString(params.asset),
    contractName,
    functionArgs: fnArgs.map(arg => serializeCV(arg)),
    functionName: 'transfer',
    postConditions: [
      serializePostConditionWire(postConditionToWire(makeFtPostCondition(postConditionOptions))),
    ],
  };
}
export const stxTransferSip10FtHandler = defineRpcRequestHandler(
  stxTransferSip10Ft.method,
  async (request, port) => {
    const { id: requestId, method, params } = request;
    const tabId = getTabIdFromPort(port);

    const { status } = validateRequestParams({
      id: requestId,
      method,
      params,
      port,
      schema: stxTransferSip10Ft.params,
    });

    if (status === 'failure') return;

    const state = await getRootState();

    if (!state) {
      sendMissingStateErrorToTab({ tabId, method: request.method, id: request.id });
      return;
    }

    const txRequest = await getMessageParamsToTransactionRequest(state, params);
    const requestParams: RequestParams = [
      ['requestId', requestId],
      ['request', createUnsecuredToken(txRequest)],
    ];
    return handleRpcMessage({
      request,
      path: RouteUrls.RpcStxTransferSip10Ft,
      port,
      requestParams,
    });
  }
);
