import {
  type ClarityValue,
  createAddress,
  createStacksPublicKey,
  deserializeCV,
  postConditionToWire,
  publicKeyToAddressSingleSig,
  serializeCV,
  serializePostConditionWire,
  standardPrincipalCVFromAddress,
} from '@stacks/transactions';
import { createUnsecuredToken } from 'jsontokens';

import { extractKeyFromDescriptor } from '@leather.io/crypto';
import type { NetworkModes } from '@leather.io/models';
import { type RpcParams, stxTransferSip9Nft } from '@leather.io/rpc';
import { TransactionTypes, getStacksAssetStringParts } from '@leather.io/stacks';

import { RouteUrls } from '@shared/route-urls';
import { makeNftPostCondition } from '@shared/utils/post-conditions';

import type { RootState } from '@app/store';
import { getRootState, sendMissingStateErrorToTab } from '@background/get-root-state';

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
  params: RpcParams<typeof stxTransferSip9Nft>
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
    deserializeCV(params.assetId),
    standardPrincipalCVFromAddress(createAddress(params.address ?? currentStacksAddress)),
    standardPrincipalCVFromAddress(createAddress(params.recipient)),
  ];

  const postConditionOptions = {
    assetId: params.assetId,
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
      serializePostConditionWire(postConditionToWire(makeNftPostCondition(postConditionOptions))),
    ],
  };
}
export const stxTransferSip9NftHandler = defineRpcRequestHandler(
  stxTransferSip9Nft.method,
  async (request, port) => {
    const { id: requestId, method, params } = request;
    const tabId = getTabIdFromPort(port);
    const { status } = validateRequestParams({
      id: requestId,
      method,
      params,
      port,
      schema: stxTransferSip9Nft.params,
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
    if (params.network) requestParams.push(['network', params.network]);
    return handleRpcMessage({
      request,
      path: RouteUrls.RpcStxTransferSip9Nft,
      port,
      requestParams,
    });
  }
);
