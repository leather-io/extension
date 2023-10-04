import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import BtcIcon from '@assets/images/btc-icon.png';
import XBtcIcon from '@assets/images/xbtc-icon.png';
import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { SwapContainerLayout } from './components/swap-container.layout';
import { SwapForm } from './components/swap-form';
import { SwapAsset, SwapFormValues } from './hooks/use-swap';
import { SwapContext, SwapProvider } from './swap.context';

// TODO: Remove and set to initial state to 0 with live data
const tempExchangeRate = 0.5;

export function SwapContainer() {
  const [exchangeRate, setExchangeRate] = useState(tempExchangeRate);
  const [isSendingMax, setIsSendingMax] = useState(false);
  const navigate = useNavigate();
  const { address } = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { balance: btcBalance } = useNativeSegwitBalance(address);
  // TODO: Filter these assets for list to swap, not sure if need?
  // const allTransferableCryptoAssetBalances = useAllTransferableCryptoAssetBalances();

  // TODO: Replace with live asset list
  const tempSwapAssetFrom: SwapAsset = {
    balance: btcBalance,
    icon: BtcIcon,
    name: 'Bitcoin',
  };

  const tempSwapAssetTo: SwapAsset = {
    balance: createMoney(new BigNumber(0), 'xBTC', 0),
    icon: XBtcIcon,
    name: 'Wrapped Bitcoin',
  };

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
    exchangeRate,
    isSendingMax,
    onSetExchangeRate: value => setExchangeRate(value),
    onSetIsSendingMax: value => setIsSendingMax(value),
    onSubmitSwapForReview,
    onSubmitSwap,
    swappableAssets: [tempSwapAssetFrom, tempSwapAssetTo],
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
