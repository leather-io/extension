import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

import { useStacksClient } from '@leather.io/query';
import { getStacksAssetStringParts } from '@leather.io/stacks';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useConfigSbtc } from '../common/remote-config/remote-config.query';

export const defaultSbtcLimits = {
  pegCap: 1000000000000,
  perDepositCap: 100000000,
  perDepositMinimum: 100000,
  perWithdrawalCap: 100000000,
  accountCaps: {},
};

const sbtcLimitsResponseSchema = z.object({
  pegCap: z.number().nullable(),
  perDepositCap: z.number().nullable(),
  perDepositMinimum: z.number().nullable(),
  perWithdrawalCap: z.number().nullable(),
  accountCaps: z.record(z.any()),
});

type GetSbtcLimitsResponse = z.infer<typeof sbtcLimitsResponseSchema>;

async function getSbtcLimits(apiUrl: string): Promise<GetSbtcLimitsResponse> {
  const resp = await axios.get(`${apiUrl}/limits`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return sbtcLimitsResponseSchema.parse(resp.data);
}

export function useGetSbtcLimits() {
  const { emilyApiUrl } = useConfigSbtc();
  return useQuery({
    queryKey: ['get-sbtc-limits'],
    queryFn: () => getSbtcLimits(emilyApiUrl),
  });
}

export function useGetCurrentSbtcSupply() {
  const client = useStacksClient();
  const { contractId } = useConfigSbtc();
  const { contractAddress } = getStacksAssetStringParts(contractId);
  const stxAddress = useCurrentStacksAccountAddress();

  return useQuery({
    queryKey: ['get-current-sbtc-supply'],
    queryFn: () =>
      client.callReadOnlyFunction({
        contractAddress,
        contractName: 'sbtc-token',
        functionName: 'get-total-supply',
        readOnlyFunctionArgs: { sender: stxAddress, arguments: [] },
      }),
  });
}
