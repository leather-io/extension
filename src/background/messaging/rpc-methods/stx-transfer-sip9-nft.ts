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
import { type RpcParams, stxTransferSip9Nft } from '@leather.io/rpc';
import { TransactionTypes, getStacksAssetStringParts } from '@leather.io/stacks';

import { RouteUrls } from '@shared/route-urls';
import { makeNftPostCondition } from '@shared/utils/post-conditions';

import { getRootState } from '@background/get-root-state';

import {
  type RequestParams,
  getAddressFromAssetString,
  getStxDefaultMessageParamsToTransactionRequest,
  validateRequestParams,
} from '../messaging-utils';
import { handleRpcMessage } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';

async function getMessageParamsToTransactionRequest(params: RpcParams<typeof stxTransferSip9Nft>) {
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
  async (message, port) => {
    const { id: requestId, method, params } = message;
    const { status } = validateRequestParams({
      id: requestId,
      method,
      params,
      port,
      schema: stxTransferSip9Nft.params,
    });
    if (status === 'failure') return;
    const txRequest = await getMessageParamsToTransactionRequest(params);
    const requestParams: RequestParams = [
      ['requestId', requestId],
      ['request', createUnsecuredToken(txRequest)],
    ];
    if (params.network) requestParams.push(['network', params.network]);
    return handleRpcMessage({
      method: message.method,
      path: RouteUrls.RpcStxTransferSip9Nft,
      port,
      requestParams,
      requestId: message.id,
    });
  }
);
