import type { StxCryptoAssetBalance } from '@leather-wallet/models';
import BigNumber from 'bignumber.js';

import { AccountBalanceStxKeys, type AddressBalanceResponse } from '@shared/models/account.model';
import { Money, createMoney } from '@shared/models/money.model';

import { subtractMoney, sumMoney } from '@app/common/money/calculate-money';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { accountBalanceStxKeys } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import {
  useMempoolTxsInboundBalance,
  useMempoolTxsOutboundBalance,
} from '../mempool/mempool.hooks';
import { useStacksAccountBalanceQuery } from './account-balance.query';

function createStxMoney(resp: AddressBalanceResponse) {
  return Object.fromEntries(
    accountBalanceStxKeys.map(key => [key, { amount: new BigNumber(resp.stx[key]), symbol: 'STX' }])
  ) as Record<AccountBalanceStxKeys, Money>;
}

function createStxCryptoAssetBalance(
  stxMoney: Record<AccountBalanceStxKeys, Money>,
  inboundBalance: Money,
  outboundBalance: Money
): StxCryptoAssetBalance {
  const totalBalance = createMoney(stxMoney.balance.amount, 'STX');
  const unlockedBalance = subtractMoney(stxMoney.balance, stxMoney.locked);

  return {
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
    select: resp =>
      createStxCryptoAssetBalance(createStxMoney(resp), inboundBalance, outboundBalance),
  });
}

export function useCurrentStxAvailableUnlockedBalance() {
  const address = useCurrentStacksAccountAddress();
  return useStxCryptoAssetBalance(address).data?.unlockedBalance ?? createMoney(0, 'STX');
}

export function useStacksAccountBalanceFungibleTokens(address: string) {
  return useStacksAccountBalanceQuery(address, {
    select: resp => resp.fungible_tokens,
  });
}
