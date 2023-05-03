import { sumMoney } from '@app/common/money/calculate-money';
import { useCurrentAccountMempoolTransactionsBalance } from '@app/query/stacks/mempool/mempool.hooks';
import { useCurrentAccountMicroblockBalanceQuery } from '@app/query/stacks/microblock/microblock.query';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function useStxOutboundValue() {
  const stxAddress = useCurrentAccountStxAddressState();
  const pendingTxsBalance = useCurrentAccountMempoolTransactionsBalance();
  const microblockBalanceQuery = useCurrentAccountMicroblockBalanceQuery(stxAddress);

  if (!microblockBalanceQuery.data) {
    return { ...microblockBalanceQuery, data: pendingTxsBalance };
  }

  return {
    ...microblockBalanceQuery,
    data: sumMoney([pendingTxsBalance, microblockBalanceQuery.data]),
  };
}
