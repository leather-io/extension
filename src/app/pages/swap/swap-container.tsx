import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { AlexSDK, Currency, TokenInfo } from 'alex-sdk';
import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useAllTransferableCryptoAssetBalances } from '@app/common/hooks/use-transferable-asset-balances.hooks';

import { SwapContainerLayout } from './components/swap-container.layout';
import { SwapForm } from './components/swap-form';
import { SwapAsset, SwapFormValues } from './hooks/use-swap';
import { SwapContext, SwapProvider } from './swap.context';

export function SwapContainer() {
  const alexSDK = useState(() => new AlexSDK())[0];
  const [supportedCurrencies, setSupportedCurrencies] = useState<TokenInfo[]>([]);

  useEffect(() => {
    alexSDK.fetchTokenList().then(tokenList => {
      setSupportedCurrencies(tokenList.filter(t => t.availableInSwap));
    });
  }, []);

  const navigate = useNavigate();

  const allTransferableCryptoAssetBalances = useAllTransferableCryptoAssetBalances();
  const getAssetFromAlexCurrency = useCallback(
    (tokenInfo: TokenInfo): SwapAsset => {
      const currency = tokenInfo.id as Currency;
      if (currency === Currency.STX) {
        const balance = allTransferableCryptoAssetBalances.find(
          x => x.type === 'crypto-currency' && x.blockchain === 'stacks' && x.asset.symbol === 'STX'
        )!.balance;
        return { currency, icon: tokenInfo.icon, name: tokenInfo.name, balance };
      }
      const balance = allTransferableCryptoAssetBalances.find(
        x => x.type === 'fungible-token' && alexSDK.getAddressFrom(currency) === x.asset.contractId
      )?.balance;
      return {
        currency,
        icon: tokenInfo.icon,
        name: tokenInfo.name,
        balance: balance ?? createMoney(0, tokenInfo.name, tokenInfo.decimals),
      };
    },
    [allTransferableCryptoAssetBalances]
  );

  const swappableAssets: SwapAsset[] = useMemo(
    () => supportedCurrencies.map(getAssetFromAlexCurrency),
    [getAssetFromAlexCurrency, supportedCurrencies]
  );

  function onSubmitSwapForReview(values: SwapFormValues) {
    navigate(RouteUrls.SwapReview, {
      state: { ...values },
    });
  }

  // TODO: Generate/broadcast transaction > pass real tx data
  function onSubmitSwap() {
    navigate(RouteUrls.SwapSummary);
  }

  const swapContextValue: SwapContext = {
    async fetchToAmount(from: SwapAsset, to: SwapAsset, fromAmount: string): Promise<string> {
      const result = await alexSDK.getAmountTo(
        from.currency,
        BigInt(new BigNumber(fromAmount).multipliedBy(1e8).dp(0).toString()),
        to.currency
      );
      return new BigNumber(Number(result)).dividedBy(1e8).toString();
    },
    onSubmitSwapForReview,
    onSubmitSwap,
    swappableAssets: swappableAssets,
  };

  return (
    <SwapProvider value={swapContextValue}>
      <SwapContainerLayout>
        <SwapForm>
          <Outlet />
        </SwapForm>
      </SwapContainerLayout>
    </SwapProvider>
  );
}
