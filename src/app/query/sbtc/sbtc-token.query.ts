import BigNumber from 'bignumber.js';

import { BTC_DECIMALS } from '@leather.io/constants';
import {
  type Sip10TokenAssetDetails,
  useStacksAccountBalanceFungibleTokens,
  useStacksFungibleTokensMetadata,
} from '@leather.io/query';
import { createBaseCryptoAssetBalance, createMoney, isDefined } from '@leather.io/utils';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useConfigSbtc } from '../common/remote-config/remote-config.query';

function useSbtcTokenCryptoAssetBalance() {
  const { contractId } = useConfigSbtc();
  const stxAddress = useCurrentStacksAccountAddress();
  const { data: tokens = {} } = useStacksAccountBalanceFungibleTokens(stxAddress);
  const sbtToken = Object.entries(tokens).find(([key, _v]) => key === contractId)?.[1];

  return createBaseCryptoAssetBalance(
    createMoney(sbtToken ? Number(sbtToken.balance) : new BigNumber(0), 'sBTC', BTC_DECIMALS)
  );
}

function useSbtcTokenCryptoAssetInfo() {
  const { contractId } = useConfigSbtc();
  const infoResults = useStacksFungibleTokensMetadata([contractId]);
  return infoResults.map(query => query.data).filter(isDefined)[0];
}

// Remove if end up not needing, but we might want to use this in the future
// ts-unused-exports:disable-next-line
export function useSbtcSip10Token(): Sip10TokenAssetDetails {
  const balance = useSbtcTokenCryptoAssetBalance();
  const info = useSbtcTokenCryptoAssetInfo();
  return { balance, info };
}
