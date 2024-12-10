import { useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { bytesToHex } from '@stacks/common';
import { type ContractCallPayload, TransactionTypes } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
  serializeCV,
  serializePostCondition,
} from '@stacks/transactions';

import { isError, isUndefined, satToBtc } from '@leather.io/utils';

import { logger } from '@shared/logger';
import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';
import { bitflow } from '@shared/utils/bitflow-sdk';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { Content, Page } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useGenerateStacksContractCallUnsignedTx } from '@app/store/transactions/contract-call.hooks';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

import { getCrossChainSwapSubmissionData, getStacksSwapSubmissionData } from './bitflow-swap.utils';
import { SwapForm } from './components/swap-form';
import { generateSwapRoutes } from './generate-swap-routes';
import { useBitflowSwap } from './hooks/use-bitflow-swap';
import { useSbtcDepositTransaction } from './hooks/use-sbtc-deposit-transaction';
import { useStacksBroadcastSwap } from './hooks/use-stacks-broadcast-swap';
import { useSwapNavigate } from './hooks/use-swap-navigate';
import { SwapContext, SwapProvider } from './swap.context';

export const bitflowSwapRoutes = generateSwapRoutes(<BitflowSwapContainer />);

function BitflowSwapContainer() {
  const [isSendingMax, setIsSendingMax] = useState(false);
  const [isPreparingSwapReview, setIsPreparingSwapReview] = useState(false);
  const navigate = useNavigate();
  const swapNavigate = useSwapNavigate();
  const { setIsLoading, setIsIdle, isLoading } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);
  const currentAccount = useCurrentStacksAccount();
  const generateUnsignedTx = useGenerateStacksContractCallUnsignedTx();
  const signTx = useSignStacksTransaction();
  const broadcastStacksSwap = useStacksBroadcastSwap();
  const { onDepositSbtc, onReviewDepositSbtc } = useSbtcDepositTransaction();

  const {
    fetchRouteQuote,
    fetchQuoteAmount,
    isCrossChainSwap,
    isFetchingExchangeRate,
    onSetIsCrossChainSwap,
    onSetIsFetchingExchangeRate,
    onSetSwapSubmissionData,
    slippage,
    bitflowSwapAssets,
    swappableAssetsBase,
    swappableAssetsQuote,
    swapSubmissionData,
  } = useBitflowSwap();

  const onSubmitSwapForReview = useCallback(
    async (values: SwapFormValues) => {
      try {
        setIsPreparingSwapReview(true);
        if (isUndefined(values.swapAssetBase) || isUndefined(values.swapAssetQuote)) {
          logger.error('Error submitting swap for review');
          return;
        }

        if (isCrossChainSwap) {
          const swapData = getCrossChainSwapSubmissionData(values);
          const sBtcDepositData = await onReviewDepositSbtc(swapData);
          onSetSwapSubmissionData({
            ...swapData,
            fee: satToBtc(sBtcDepositData?.fee ?? 0).toNumber(),
            txData: sBtcDepositData?.deposit,
          });
          swapNavigate(RouteUrls.SwapReview);
          return;
        }

        const routeQuote = await fetchRouteQuote(
          values.swapAssetBase,
          values.swapAssetQuote,
          values.swapAmountBase
        );

        if (!routeQuote) return;

        onSetSwapSubmissionData(
          getStacksSwapSubmissionData({ bitflowSwapAssets, routeQuote, slippage, values })
        );
        swapNavigate(RouteUrls.SwapReview);
      } finally {
        setIsPreparingSwapReview(false);
      }
    },
    [
      bitflowSwapAssets,
      fetchRouteQuote,
      isCrossChainSwap,
      onReviewDepositSbtc,
      onSetSwapSubmissionData,
      slippage,
      swapNavigate,
    ]
  );

  const onSubmitSwap = useCallback(async () => {
    if (isLoading) return;

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

    if (isCrossChainSwap) {
      return await onDepositSbtc(swapSubmissionData);
    }

    try {
      const routeQuote = await fetchRouteQuote(
        swapSubmissionData.swapAssetBase,
        swapSubmissionData.swapAssetQuote,
        swapSubmissionData.swapAmountBase
      );

      if (!routeQuote) return;

      const swapExecutionData = {
        route: routeQuote.route,
        amount: Number(swapSubmissionData.swapAmountBase),
        tokenXDecimals: routeQuote.tokenXDecimals,
        tokenYDecimals: routeQuote.tokenYDecimals,
      };

      const swapParams = await bitflow.getSwapParams(
        swapExecutionData,
        currentAccount.address,
        swapSubmissionData.slippage
      );

      const tempFormValues = {
        fee: swapSubmissionData.fee,
        feeCurrency: swapSubmissionData.feeCurrency,
        feeType: swapSubmissionData.feeType,
        nonce: swapSubmissionData.nonce,
      };

      const payload: ContractCallPayload = {
        anchorMode: AnchorMode.Any,
        contractAddress: swapParams.contractAddress,
        contractName: swapParams.contractName,
        functionName: swapParams.functionName,
        functionArgs: swapParams.functionArgs.map(x => bytesToHex(serializeCV(x))),
        postConditionMode: PostConditionMode.Deny,
        postConditions: swapParams.postConditions.map(pc => bytesToHex(serializePostCondition(pc))),
        publicKey: currentAccount?.stxPublicKey,
        sponsored: swapSubmissionData.sponsored,
        txType: TransactionTypes.ContractCall,
      };

      const unsignedTx = await generateUnsignedTx(payload, tempFormValues);
      if (!unsignedTx)
        return logger.error('Attempted to generate unsigned tx, but tx is undefined');

      const signedTx = await signTx(unsignedTx);
      if (!signedTx)
        return logger.error('Attempted to generate raw tx, but signed tx is undefined');
      return await broadcastStacksSwap(signedTx);
    } catch (e) {
      navigate(RouteUrls.SwapError, {
        state: {
          message: isError(e) ? e.message : '',
          title: 'Swap Error',
        },
      });
    } finally {
      setIsIdle();
    }
  }, [
    broadcastStacksSwap,
    currentAccount,
    fetchRouteQuote,
    generateUnsignedTx,
    isCrossChainSwap,
    isLoading,
    navigate,
    onDepositSbtc,
    setIsIdle,
    setIsLoading,
    signTx,
    swapSubmissionData,
  ]);

  const swapContextValue: SwapContext = {
    fetchQuoteAmount,
    isCrossChainSwap,
    isFetchingExchangeRate,
    isSendingMax,
    isPreparingSwapReview,
    onSetIsCrossChainSwap,
    onSetIsFetchingExchangeRate,
    onSetIsSendingMax: value => setIsSendingMax(value),
    onSubmitSwapForReview,
    onSubmitSwap,
    swappableAssetsBase,
    swappableAssetsQuote,
    swapSubmissionData,
  };

  return (
    <SwapProvider value={swapContextValue}>
      {/* Swap uses routed dialogs to choose assets so needs onBackLocation to go Home */}
      <PageHeader title="Swap" onBackLocation={RouteUrls.Home} />
      <Content>
        <Page>
          <SwapForm>
            <Outlet />
          </SwapForm>
        </Page>
      </Content>
    </SwapProvider>
  );
}
