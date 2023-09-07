import { useGetSwapperIdQuery } from "@app/query/magic";
import { useCurrentStacksAccount } from "@app/store/accounts/blockchain/stacks/stacks-account.hooks";

export interface UseMagicSwapperIdOptions {
  enabled: boolean;
}

export function useMagicSwapper(options: UseMagicSwapperIdOptions = { enabled: true }) {
  const account = useCurrentStacksAccount();

  const { data: magicSwapper, ...swapperIdQuery} = useGetSwapperIdQuery(account?.address || '', {
    enabled: options.enabled && !!account,
    select: (swapperId) => ({
      id: swapperId,
      isAuthorized: !!swapperId,
    })
  });

  return { magicSwapper, ...swapperIdQuery };
}
