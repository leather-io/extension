import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { bytesToHex } from '@stacks/common';
import { ContractCallPayload, TransactionTypes } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
  serializeCV,
  serializePostCondition,
} from '@stacks/transactions';
import { SponsoredTxError } from 'alex-sdk';
import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { isDefined, isUndefined } from '@shared/utils';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { stxToMicroStx } from '@app/common/money/unit-conversion';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useGenerateStacksContractCallUnsignedTx } from '@app/store/transactions/contract-call.hooks';
import { useSignTransactionSoftwareWallet } from '@app/store/transactions/transaction.hooks';

import { SwapContainerLayout } from './components/swap-container.layout';
import { SwapForm } from './components/swap-form';
import { oneHundredMillion, useAlexSwap } from './hooks/use-alex-swap';
import { SwapAsset, SwapFormValues } from './hooks/use-swap';
import { SwapContext, SwapProvider } from './swap.context';

export function SwapContainer() {
  const navigate = useNavigate();
  const { setIsLoading, setIsIdle } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);
  const currentAccount = useCurrentStacksAccount();
  const generateUnsignedTx = useGenerateStacksContractCallUnsignedTx();
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();

  const {
    alexSDK,
    fetchToAmount,
    getAssetFromAlexCurrency,
    onSetSwapSubmissionData,
    slippage,
    supportedCurrencies,
    swapSubmissionData,
  } = useAlexSwap();

  const swappableAssets: SwapAsset[] = useMemo(
    () => supportedCurrencies.map(getAssetFromAlexCurrency).filter(isDefined),
    [getAssetFromAlexCurrency, supportedCurrencies]
  );

  async function onSubmitSwapForReview(values: SwapFormValues) {
    if (isUndefined(values.swapAssetFrom) || isUndefined(values.swapAssetTo)) {
      logger.error('Error submitting swap for review');
      return;
    }

    const [router, lpFee] = await Promise.all([
      alexSDK.getRouter(values.swapAssetFrom.currency, values.swapAssetTo.currency),
      alexSDK.getFeeRate(values.swapAssetFrom.currency, values.swapAssetTo.currency),
    ]);

    onSetSwapSubmissionData({
      // Default to low fee for now
      fee: stxToMicroStx('0.0025').toString(),
      feeCurrency: values.feeCurrency,
      feeType: values.feeType,
      liquidityFee: new BigNumber(Number(lpFee)).dividedBy(oneHundredMillion).toNumber(),
      protocol: 'ALEX',
      router: router
        .map(x => getAssetFromAlexCurrency(supportedCurrencies.find(y => y.id === x)))
        .filter(isDefined),
      slippage,
      swapAmountFrom: values.swapAmountFrom,
      swapAmountTo: values.swapAmountTo,
      swapAssetFrom: values.swapAssetFrom,
      swapAssetTo: values.swapAssetTo,
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
      isUndefined(swapSubmissionData.swapAssetFrom) ||
      isUndefined(swapSubmissionData.swapAssetTo)
    ) {
      logger.error('No assets selected to perform swap');
      return;
    }

    setIsLoading();

    const fromAmount = BigInt(
      new BigNumber(swapSubmissionData.swapAmountFrom)
        .multipliedBy(oneHundredMillion)
        .dp(0)
        .toString()
    );

    const minToAmount = BigInt(
      new BigNumber(swapSubmissionData.swapAmountTo)
        .multipliedBy(oneHundredMillion)
        .multipliedBy(1 - slippage)
        .dp(0)
        .toString()
    );

    const tx = alexSDK.runSwap(
      currentAccount?.address,
      swapSubmissionData.swapAssetFrom.currency,
      swapSubmissionData.swapAssetTo.currency,
      fromAmount,
      minToAmount,
      swapSubmissionData.router.map(x => x.currency)
    );

    // TODO: Add choose fee step for swaps
    const tempFormValues = {
      fee: swapSubmissionData.fee,
      feeCurrency: swapSubmissionData.feeCurrency,
      feeType: swapSubmissionData.feeType,
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
      sponsored: true,
      txType: TransactionTypes.ContractCall,
    };

    const unsignedTx = await generateUnsignedTx(payload, tempFormValues);
    if (!unsignedTx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

    const signedTx = signSoftwareWalletTx(unsignedTx);
    if (!signedTx) return logger.error('Attempted to generate raw tx, but signed tx is undefined');
    const txRaw = bytesToHex(signedTx.serialize());

    try {
      const txId = await alexSDK.broadcastSponsoredTx(txRaw);
      setIsIdle();
      navigate(RouteUrls.SwapSummary, { state: { txId } });
    } catch (e) {
      setIsIdle();
      navigate(RouteUrls.SwapError, {
        state: {
          message: e instanceof (Error || SponsoredTxError) ? e.message : 'Unknown error',
          title: 'Failed to broadcast',
        },
      });
    }
  }

  const swapContextValue: SwapContext = {
    swapSubmissionData,
    fetchToAmount,
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
