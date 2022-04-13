import { atom } from 'jotai';
import { requestTokenPayloadState } from '@app/store/transactions/requests';
import { currentAccountStxAddressState } from '@app/store/accounts';
import {
  getPostCondition,
  handlePostConditions,
} from '@app/common/transactions/post-condition-utils';
import { ContractCallPayload, ContractDeployPayload, STXTransferPayload } from '@stacks/connect';

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

export const postConditionsState = atom(get => {
  const payload = get(requestTokenPayloadState);
  const address = get(currentAccountStxAddressState);
  return formatPostConditionState(payload, address);
});

export const postConditionModeState = atom(get => get(requestTokenPayloadState)?.postConditionMode);
