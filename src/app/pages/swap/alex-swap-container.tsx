import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { bytesToHex } from '@stacks/common';
import { ContractCallPayload, TransactionTypes } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
  serializeCV,
  serializePostCondition,
} from '@stacks/transactions';
import BigNumber from 'bignumber.js';

import { defaultSwapFee } from '@leather-wallet/query';
import { isDefined, isUndefined } from '@leather-wallet/utils';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { alex } from '@shared/utils/alex-sdk';

import { migratePositiveAssetBalancesToTop } from '@app/common/asset-utils';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useWalletType } from '@app/common/use-wallet-type';
import { NonceSetter } from '@app/components/nonce-setter';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useGenerateStacksContractCallUnsignedTx } from '@app/store/transactions/contract-call.hooks';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';
import { Page } from '@app/ui/layout/page/page.layout';

import { SwapForm } from './components/swap-form';
import { generateSwapRoutes } from './generate-swap-routes';
import { useAlexBroadcastSwap } from './hooks/use-alex-broadcast-swap';
import { oneHundredMillion, useAlexSwap } from './hooks/use-alex-swap';
import { useStacksBroadcastSwap } from './hooks/use-stacks-broadcast-swap';
import { SwapFormValues } from './hooks/use-swap-form';
import { useSwapNavigate } from './hooks/use-swap-navigate';
import { SwapContext, SwapProvider } from './swap.context';

export const alexSwapRoutes = generateSwapRoutes(<AlexSwapContainer />);

function AlexSwapContainer() {
  const [isSendingMax, setIsSendingMax] = useState(false);
  const navigate = useSwapNavigate();
  const { setIsLoading } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);
  const currentAccount = useCurrentStacksAccount();
  const generateUnsignedTx = useGenerateStacksContractCallUnsignedTx();
  const signTx = useSignStacksTransaction();
  const { whenWallet } = useWalletType();

  // Setting software to false until we revisit:
  // https://github.com/leather-wallet/extension/issues/4750
  const isSponsoredByAlex = whenWallet({
    ledger: false,
    software: false,
  });

  const {
    fetchQuoteAmount,
    isFetchingExchangeRate,
    onSetIsFetchingExchangeRate,
    onSetSwapSubmissionData,
    slippage,
    swapAssets,
    swapSubmissionData,
  } = useAlexSwap();

  const broadcastAlexSwap = useAlexBroadcastSwap();
  const broadcastStacksSwap = useStacksBroadcastSwap();

  async function onSubmitSwapForReview(values: SwapFormValues) {
    if (isUndefined(values.swapAssetBase) || isUndefined(values.swapAssetQuote)) {
      logger.error('Error submitting swap for review');
      return;
    }

    const [router, lpFee] = await Promise.all([
      alex.getRouter(values.swapAssetBase.currency, values.swapAssetQuote.currency),
      alex.getFeeRate(values.swapAssetBase.currency, values.swapAssetQuote.currency),
    ]);

    onSetSwapSubmissionData({
      fee: isSponsoredByAlex ? '0' : defaultSwapFee.amount.toString(),
      feeCurrency: values.feeCurrency,
      feeType: values.feeType,
      liquidityFee: new BigNumber(Number(lpFee)).dividedBy(oneHundredMillion).toNumber(),
      nonce: values.nonce,
      protocol: 'ALEX',
      router: router.map(x => swapAssets.find(asset => asset.currency === x)).filter(isDefined),
      slippage,
      sponsored: isSponsoredByAlex,
      swapAmountBase: values.swapAmountBase,
      swapAmountQuote: values.swapAmountQuote,
      swapAssetBase: values.swapAssetBase,
      swapAssetQuote: values.swapAssetQuote,
      timestamp: new Date().toISOString(),
    });

    navigate(RouteUrls.SwapReview);
  }

  async function onSubmitSwap() {
    if (isUndefined(currentAccount) || isUndefined(swapSubmissionData)) {
      logger.error('Error submitting swap data to sign');
      return;
    }

    if (
      isUndefined(swapSubmissionData.swapAssetBase) ||
      isUndefined(swapSubmissionData.swapAssetQuote)
    ) {
      logger.error('No assets selected to perform swap');
      return;
    }

    setIsLoading();

    const fromAmount = BigInt(
      new BigNumber(swapSubmissionData.swapAmountBase)
        .multipliedBy(oneHundredMillion)
        .dp(0)
        .toString()
    );

    const minToAmount = BigInt(
      new BigNumber(swapSubmissionData.swapAmountQuote)
        .multipliedBy(oneHundredMillion)
        .multipliedBy(new BigNumber(1).minus(slippage))
        .dp(0)
        .toString()
    );

    const tx = alex.runSwap(
      currentAccount?.address,
      swapSubmissionData.swapAssetBase.currency,
      swapSubmissionData.swapAssetQuote.currency,
      fromAmount,
      minToAmount,
      swapSubmissionData.router.map(x => x.currency)
    );

    // TODO: Add choose fee step
    const tempFormValues = {
      fee: swapSubmissionData.fee,
      feeCurrency: swapSubmissionData.feeCurrency,
      feeType: swapSubmissionData.feeType,
      nonce: swapSubmissionData.nonce,
    };

    const payload: ContractCallPayload = {
      anchorMode: AnchorMode.Any,
      contractAddress: tx.contractAddress,
      contractName: tx.contractName,
      functionName: tx.functionName,
      functionArgs: tx.functionArgs.map(x => bytesToHex(serializeCV(x))),
      postConditionMode: PostConditionMode.Deny,
      postConditions: tx.postConditions.map(pc => bytesToHex(serializePostCondition(pc))),
      publicKey: currentAccount?.stxPublicKey,
      sponsored: swapSubmissionData.sponsored,
      txType: TransactionTypes.ContractCall,
    };

    const unsignedTx = await generateUnsignedTx(payload, tempFormValues);
    if (!unsignedTx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

    try {
      const signedTx = await signTx(unsignedTx);
      if (!signedTx)
        return logger.error('Attempted to generate raw tx, but signed tx is undefined');
      const txRaw = bytesToHex(signedTx.serialize());

      return whenWallet({
        ledger: await broadcastStacksSwap(signedTx),
        software: isSponsoredByAlex
          ? await broadcastAlexSwap(txRaw)
          : await broadcastStacksSwap(signedTx),
      });
    } catch (error) {}
  }

  const swapContextValue: SwapContext = {
    fetchQuoteAmount,
    isFetchingExchangeRate,
    isSendingMax,
    onSetIsFetchingExchangeRate,
    onSetIsSendingMax: value => setIsSendingMax(value),
    onSubmitSwapForReview,
    onSubmitSwap,
    swappableAssetsBase: migratePositiveAssetBalancesToTop(swapAssets),
    swappableAssetsQuote: swapAssets,
    swapSubmissionData,
  };

  return (
    <SwapProvider value={swapContextValue}>
      <Page>
        <SwapForm>
          <NonceSetter />
          <Outlet />
        </SwapForm>
      </Page>
    </SwapProvider>
  );
}
