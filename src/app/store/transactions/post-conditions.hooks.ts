import { useMemo } from 'react';

import { ContractCallPayload, ContractDeployPayload, STXTransferPayload } from '@stacks/connect';
import { FungiblePostCondition, addressToString } from '@stacks/transactions';

import { isFtAsset, useGetFungibleTokenMetadataQuery } from '@leather.io/query';

import {
  getPostCondition,
  handlePostConditions,
} from '@app/common/transactions/stacks/post-condition.utils';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useTransactionRequestState } from './requests.hooks';

export function formatPostConditionState(
  payload?: ContractCallPayload | ContractDeployPayload | STXTransferPayload | null,
  address?: string
) {
  if (!payload || !address) return;

  if (payload.postConditions) {
    if (payload.stxAddress)
      return handlePostConditions(payload.postConditions, payload.stxAddress, address);

    return payload.postConditions.map(getPostCondition);
  }
  return [];
}

export function usePostConditionModeState() {
  return useTransactionRequestState()?.postConditionMode;
}

export function usePostConditionState() {
  const payload = useTransactionRequestState();
  const address = useCurrentStacksAccountAddress();
  return useMemo(() => formatPostConditionState(payload, address), [address, payload]);
}

export function useAssetFromFungiblePostCondition(pc: FungiblePostCondition) {
  const contractAddress = addressToString(pc.assetInfo.address);
  const contractName = pc.assetInfo.contractName.content;
  const contractId = `${contractAddress}.${contractName}`;
  const { data: asset } = useGetFungibleTokenMetadataQuery(contractId);

  return !(asset && isFtAsset(asset)) ? undefined : asset;
}
