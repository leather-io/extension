import { hexToBytes } from '@stacks/common';
import { BytesReader, addressToString, deserializeAddress } from '@stacks/transactions';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useConfigSbtc } from '../common/remote-config/remote-config.query';

enum SbtcStatus {
  Pending = 'pending',
  Reprocessing = 'reprocessing',
  Accepted = 'accepted',
  Confirmed = 'confirmed',
  Failed = 'failed',
}

export interface SbtcDepositInfo {
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

  return {
    isLoading: isLoadingStatusPending || isLoadingStatusReprocessing || isLoadingStatusAccepted,
    pendingSbtcDeposits: [...pendingDeposits, ...reprocessingDeposits, ...acceptedDeposits],
  };
}
