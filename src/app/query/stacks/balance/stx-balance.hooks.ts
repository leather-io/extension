import type { StxCryptoAssetBalance } from '@leather-wallet/models';
import BigNumber from 'bignumber.js';

import { AccountBalanceStxKeys, type AddressBalanceResponse } from '@shared/models/account.model';
import { Money, createMoney } from '@shared/models/money.model';

import { subtractMoney, sumMoney } from '@app/common/money/calculate-money';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { accountBalanceStxKeys } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import {
  useMempoolTxsInboundBalance,
  useMempoolTxsOutboundBalance,
} from '../mempool/mempool.hooks';
import { useStacksAccountBalanceQuery } from './stx-balance.query';

function makeStxMoney(resp: AddressBalanceResponse) {
  return Object.fromEntries(
    accountBalanceStxKeys.map(key => [key, { amount: new BigNumber(resp.stx[key]), symbol: 'STX' }])
  ) as Record<AccountBalanceStxKeys, Money>;
}

function makeStxCryptoAssetBalance(
  stxMoney: Record<AccountBalanceStxKeys, Money>,
  inboundBalance: Money,
  outboundBalance: Money
): StxCryptoAssetBalance {
  const totalBalance = createMoney(stxMoney.balance.amount, 'STX');
  const unlockedBalance = subtractMoney(stxMoney.balance, stxMoney.locked);

  return {
    // TODO: Asset refactor: are inbound/outbound necessary?
    // - Make sure to track changes to effectiveBalance, now availableBalance
    // - And, previous availableBalance is now availableUnlockedBalance
    availableBalance: subtractMoney(totalBalance, outboundBalance),
    availableUnlockedBalance: subtractMoney(unlockedBalance, outboundBalance),
    inboundBalance,
    lockedBalance: createMoney(stxMoney.locked.amount, 'STX'),
    outboundBalance,
    pendingBalance: subtractMoney(sumMoney([totalBalance, inboundBalance]), outboundBalance),
    totalBalance,
    unlockedBalance,
  };
}

export function useStxCryptoAssetBalance(address: string) {
  const inboundBalance = useMempoolTxsInboundBalance(address);
  const outboundBalance = useMempoolTxsOutboundBalance(address);
  return useStacksAccountBalanceQuery(address, {
    select: resp => makeStxCryptoAssetBalance(makeStxMoney(resp), inboundBalance, outboundBalance),
  });
}

export function useCurrentStcAvailableUnlockedBalance() {
  const account = useCurrentStacksAccount();
  return (
    useStxCryptoAssetBalance(account?.address ?? '').data?.unlockedBalance ?? createMoney(0, 'STX')
  );
}
