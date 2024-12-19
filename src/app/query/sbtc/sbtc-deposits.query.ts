import { hexToBytes } from '@stacks/common';
import { BytesReader, addressToString, deserializeAddress } from '@stacks/transactions';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { isDefined } from '@leather.io/utils';

import { useConfigSbtc } from '../common/remote-config/remote-config.query';
import { type StacksBlock, useGetStacksBlocks } from './get-stacks-block.query';

export enum SbtcStatus {
  Pending = 'pending',
  Reprocessing = 'reprocessing',
  Accepted = 'accepted',
  Confirmed = 'confirmed',
  Failed = 'failed',
}

interface SbtcDepositInfo {
  amount: number;
  bitcoinTxOutputIndex: number;
  bitcoinTxid: string;
  depositScript: string;
  lastUpdateBlockHash: string;
  lastUpdateHeight: number;
  recipient: string; // Stacks address
  reclaimScript: string;
  status: SbtcStatus;
}

interface GetSbtcDepositsResponse {
  deposits: SbtcDepositInfo[];
  nextToken?: string;
}

async function getSbtcDeposits(apiUrl: string, status: string): Promise<GetSbtcDepositsResponse> {
  const resp = await axios.get(`${apiUrl}/deposit?status=${status}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return resp.data;
}

function useGetSbtcDeposits(stxAddress: string, status: string) {
  const { emilyApiUrl } = useConfigSbtc();
  return useQuery({
    queryKey: ['get-sbtc-deposits', stxAddress, status],
    queryFn: () => getSbtcDeposits(emilyApiUrl, status),
    select: resp =>
      resp.deposits.filter(deposit => {
        const recipient = addressToString(
          deserializeAddress(new BytesReader(hexToBytes(deposit.recipient.slice(2))))
        );
        return recipient === stxAddress;
      }),
  });
}

export interface SbtcDeposit extends SbtcDepositInfo {
  block?: StacksBlock;
}

function useSbtcDeposits(deposits: SbtcDepositInfo[]) {
  const blockResults = useGetStacksBlocks(deposits.map(deposit => deposit.lastUpdateHeight));
  const isLoadingBlocks = blockResults.some(query => query.isLoading);

  return {
    isLoadingBlocks,
    deposits: deposits.map(deposit => {
      const block = blockResults
        .map(query => query.data)
        .filter(isDefined)
        .find(block => block.height === deposit.lastUpdateHeight);
      return {
        ...deposit,
        block,
      };
    }),
  };
}

export function useSbtcPendingDeposits(stxAddress: string) {
  const { data: pendingDeposits = [], isLoading: isLoadingStatusPending } = useGetSbtcDeposits(
    stxAddress,
    'pending'
  );
  const { data: reprocessingDeposits = [], isLoading: isLoadingStatusReprocessing } =
    useGetSbtcDeposits(stxAddress, 'reprocessing');
  const { data: acceptedDeposits = [], isLoading: isLoadingStatusAccepted } = useGetSbtcDeposits(
    stxAddress,
    'accepted'
  );

  const { isLoadingBlocks, deposits } = useSbtcDeposits([
    ...pendingDeposits,
    ...reprocessingDeposits,
    ...acceptedDeposits,
  ]);

  return {
    isLoading:
      isLoadingStatusPending ||
      isLoadingStatusReprocessing ||
      isLoadingStatusAccepted ||
      isLoadingBlocks,
    pendingSbtcDeposits: deposits,
  };
}

export function useSbtcConfirmedDeposits(stxAddress: string) {
  const { data: confirmedSbtcDeposits = [], isLoading: isLoadingStatusConfirmed } =
    useGetSbtcDeposits(stxAddress, 'confirmed');
  const { isLoadingBlocks, deposits } = useSbtcDeposits(confirmedSbtcDeposits);

  return {
    isLoading: isLoadingStatusConfirmed || isLoadingBlocks,
    confirmedSbtcDeposits: deposits,
  };
}

export function useSbtcFailedDeposits(stxAddress: string) {
  const { data: failedSbtcDeposits = [], isLoading: isLoadingStatusFailed } = useGetSbtcDeposits(
    stxAddress,
    'failed'
  );
  const { isLoadingBlocks, deposits } = useSbtcDeposits(failedSbtcDeposits);

  return {
    isLoading: isLoadingStatusFailed || isLoadingBlocks,
    failedSbtcDeposits: deposits,
  };
}
