import { hexToBytes } from '@stacks/common';
import { BytesReader, addressToString, deserializeAddress } from '@stacks/transactions';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export enum SBtcStatus {
  Pending = 'pending',
  Reprocessing = 'reprocessing',
  Accepted = 'accepted',
  Confirmed = 'confirmed',
  Failed = 'failed',
}

export interface SBtcDepositInfo {
  amount: number;
  bitcoinTxOutputIndex: number;
  bitcoinTxid: string;
  depositScript: string;
  lastUpdateBlockHash: string;
  lastUpdateHeight: number;
  recipient: string; // Stacks address
  reclaimScript: string;
  status: SBtcStatus;
}

interface GetSBtcDepositsResponse {
  deposits: SBtcDepositInfo[];
  nextToken?: string;
}

const emilyUrl = 'https://beta.sbtc-emily.com/deposit';

async function getSBtcDeposits(status: string): Promise<GetSBtcDepositsResponse> {
  const resp = await axios.get(`${emilyUrl}?status=${status}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return resp.data;
}

export function useGetSBtcDeposits(stxAddress: string, status: string) {
  return useQuery({
    queryKey: ['get-sbtc-deposits', stxAddress, status],
    queryFn: () => getSBtcDeposits(status),
    select: resp =>
      resp.deposits.filter(deposit => {
        const recipient = addressToString(
          deserializeAddress(new BytesReader(hexToBytes(deposit.recipient.slice(2))))
        );
        return recipient === stxAddress;
      }),
  });
}

export function useSBtcPendingDeposits(stxAddress: string) {
  const { data: pendingDeposits = [], isLoading: isLoadingStatusPending } = useGetSBtcDeposits(
    stxAddress,
    'pending'
  );
  const { data: reprocessingDeposits = [], isLoading: isLoadingStatusReprocessing } =
    useGetSBtcDeposits(stxAddress, 'reprocessing');

  return {
    isLoading: isLoadingStatusPending || isLoadingStatusReprocessing,
    pendingSBtcDeposits: [...pendingDeposits, ...reprocessingDeposits],
  };
}
