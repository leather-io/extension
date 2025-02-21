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
import { type RpcParams, type RpcRequest, stxTransferSip10Ft } from '@leather.io/rpc';
import { TransactionTypes, getStacksAssetStringParts } from '@leather.io/stacks';

import { RouteUrls } from '@shared/route-urls';
import { makeFtPostCondition } from '@shared/utils/post-conditions';

import { getRootState } from '@background/get-root-state';

import { handleRpcMessage } from '../handle-rpc-message';
import {
  type RequestParams,
  getStxDefaultMessageParamsToTransactionRequest,
  validateRequestParams,
} from '../messaging-utils';

async function getMessageParamsToTransactionRequest(params: RpcParams<typeof stxTransferSip10Ft>) {
  const { contractAddress, contractAssetName, contractName } = getStacksAssetStringParts(
    params.asset
  );
  const state = await getRootState();
  const descriptor = state.chains.stx.default.currentAccountStacksDescriptor;
  const publicKey = createStacksPublicKey(extractKeyFromDescriptor(descriptor)).data;
  const currentStacksAddress = publicKeyToAddressSingleSig(
    publicKey,
    state.networks.currentNetworkId
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
    contractAddress: params.asset.split('.')[0],
    contractName,
    functionArgs: fnArgs.map(arg => serializeCV(arg)),
    functionName: 'transfer',
    postConditions: [
      serializePostConditionWire(postConditionToWire(makeFtPostCondition(postConditionOptions))),
    ],
  };
}

export async function rpcStxTransferSip10Ft(
  message: RpcRequest<typeof stxTransferSip10Ft>,
  port: chrome.runtime.Port
) {
  const { id: requestId, method, params } = message;
  validateRequestParams({
    id: requestId,
    method,
    params,
    port,
    schema: stxTransferSip10Ft.params,
  });
  const txRequest = await getMessageParamsToTransactionRequest(params);
  const requestParams: RequestParams = [
    ['requestId', requestId],
    ['request', createUnsecuredToken(txRequest)],
  ];
  return handleRpcMessage({
    method: message.method,
    path: RouteUrls.RpcStxTransferSip10Ft,
    port,
    requestParams,
    requestId: message.id,
  });
}
