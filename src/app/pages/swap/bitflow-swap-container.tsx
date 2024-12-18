import { useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import type { P2Ret } from '@scure/btc-signer/payment';
import { bytesToHex } from '@stacks/common';
import { type ContractCallPayload, TransactionTypes } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
  serializeCV,
  serializePostCondition,
} from '@stacks/transactions';

import { isError, isUndefined } from '@leather.io/utils';

import { logger } from '@shared/logger';
import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';
import { bitflow } from '@shared/utils/bitflow-sdk';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { Content, Page } from '@app/components/layout';
import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';
import { PageHeader } from '@app/features/container/headers/page.header';
import type {
  SbtcSponsorshipEligibility,
  TransactionBase,
} from '@app/query/sbtc/sponsored-transactions.query';
import type { Signer } from '@app/store/accounts/blockchain/bitcoin/bitcoin-signer';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useGenerateStacksContractCallUnsignedTx } from '@app/store/transactions/contract-call.hooks';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

import { getCrossChainSwapSubmissionData, getStacksSwapSubmissionData } from './bitflow-swap.utils';
import { SwapForm } from './components/swap-form';
import { generateSwapRoutes } from './generate-swap-routes';
import { useBitflowSwap } from './hooks/use-bitflow-swap';
import { useSbtcDepositTransaction } from './hooks/use-sbtc-deposit-transaction';
import { useSponsorTransactionFees } from './hooks/use-sponsor-tx-fees';
import { useStacksBroadcastSwap } from './hooks/use-stacks-broadcast-swap';
import { useSwapNavigate } from './hooks/use-swap-navigate';
import { SwapContext, SwapProvider } from './swap.context';

// TODO: Refactor coupled Bitflow and Bitcoin swap containers, they should be separate
export const bitflowSwapRoutes = generateSwapRoutes(
  <BitcoinNativeSegwitAccountLoader current fallback={<BitflowSwapContainer />}>
    {signer => <BitflowSwapContainer btcSigner={signer} />}
  </BitcoinNativeSegwitAccountLoader>
);

interface BitflowSwapContainerProps {
  btcSigner?: Signer<P2Ret>;
}
function BitflowSwapContainer({ btcSigner }: BitflowSwapContainerProps) {
  const [unsignedTx, setUnsignedTx] = useState<TransactionBase | undefined>();
  const [isSendingMax, setIsSendingMax] = useState(false);
  const [isPreparingSwapReview, setIsPreparingSwapReview] = useState(false);
  const navigate = useNavigate();
  const swapNavigate = useSwapNavigate();
  const { setIsLoading, setIsIdle, isLoading } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);
  const currentAccount = useCurrentStacksAccount();
  const generateUnsignedTx = useGenerateStacksContractCallUnsignedTx();
  const signTx = useSignStacksTransaction();
  const broadcastStacksSwap = useStacksBroadcastSwap();
  const { onDepositSbtc, onReviewDepositSbtc } = useSbtcDepositTransaction(btcSigner);

  const [sponsorshipEligibility, setSponsorshipEligibility] = useState<
    SbtcSponsorshipEligibility | undefined
  >();

  const { checkEligibilityForSponsor, submitSponsoredTx } = useSponsorTransactionFees();

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
  } = useBitflowSwap(btcSigner);

  const onSubmitSwapForReview = useCallback(
    async (values: SwapFormValues) => {
      try {
        setIsPreparingSwapReview(true);
        if (
          isUndefined(currentAccount) ||
          isUndefined(values.swapAssetBase) ||
          isUndefined(values.swapAssetQuote)
        ) {
          logger.error('Error submitting swap for review');
          return;
        }

        if (isCrossChainSwap) {
          const swapData = getCrossChainSwapSubmissionData(values);
          const sBtcDepositData = await onReviewDepositSbtc(swapData, isSendingMax);
          onSetSwapSubmissionData({
            ...swapData,
            fee: sBtcDepositData?.fee ?? 0,
            maxSignerFee: sBtcDepositData?.maxSignerFee,
            txData: { deposit: sBtcDepositData?.deposit },
          });
          return swapNavigate(RouteUrls.SwapReview);
        }

        const routeQuote = await fetchRouteQuote(
          values.swapAssetBase,
          values.swapAssetQuote,
          values.swapAmountBase
        );

        if (!routeQuote) return;

        const stacksSwapData = getStacksSwapSubmissionData({
          bitflowSwapAssets,
          routeQuote,
          slippage,
          values,
        });

        const swapExecutionData = {
          route: routeQuote.route,
          amount: Number(stacksSwapData.swapAmountBase),
          tokenXDecimals: routeQuote.tokenXDecimals,
          tokenYDecimals: routeQuote.tokenYDecimals,
        };

        const swapParams = await bitflow.getSwapParams(
          swapExecutionData,
          currentAccount.address,
          slippage
        );

        if (!routeQuote) return;

        const formValues = {
          fee: stacksSwapData.fee,
          feeCurrency: stacksSwapData.feeCurrency,
          feeType: stacksSwapData.feeType,
          nonce: stacksSwapData.nonce,
        };

        const payload: ContractCallPayload = {
          anchorMode: AnchorMode.Any,
          contractAddress: swapParams.contractAddress,
          contractName: swapParams.contractName,
          functionName: swapParams.functionName,
          functionArgs: swapParams.functionArgs.map(x => bytesToHex(serializeCV(x))),
          postConditionMode: PostConditionMode.Deny,
          postConditions: swapParams.postConditions.map(pc =>
            bytesToHex(serializePostCondition(pc))
          ),
          publicKey: currentAccount?.stxPublicKey,
          sponsored: false,
          txType: TransactionTypes.ContractCall,
        };

        const unsignedTx = await generateUnsignedTx(payload, formValues);
        if (!unsignedTx)
          return logger.error('Attempted to generate unsigned tx, but tx is undefined');

        const sponsorshipEligibility = await checkEligibilityForSponsor(values, unsignedTx);
        stacksSwapData.sponsored = sponsorshipEligibility.isEligible;

        setUnsignedTx(unsignedTx);
        setSponsorshipEligibility(sponsorshipEligibility);
        onSetSwapSubmissionData(stacksSwapData);

        swapNavigate(RouteUrls.SwapReview);
      } finally {
        setIsPreparingSwapReview(false);
      }
    },
    [
      currentAccount,
      isCrossChainSwap,
      fetchRouteQuote,
      bitflowSwapAssets,
      slippage,
      generateUnsignedTx,
      checkEligibilityForSponsor,
      onSetSwapSubmissionData,
      swapNavigate,
      onReviewDepositSbtc,
      isSendingMax,
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
      if (sponsorshipEligibility?.isEligible)
        return await submitSponsoredTx(sponsorshipEligibility.unsignedSponsoredTx!);

      if (!unsignedTx?.transaction) return logger.error('No unsigned tx to sign');

      const signedTx = await signTx(unsignedTx.transaction);
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
    isCrossChainSwap,
    isLoading,
    navigate,
    onDepositSbtc,
    setIsIdle,
    setIsLoading,
    signTx,
    sponsorshipEligibility,
    submitSponsoredTx,
    swapSubmissionData,
    unsignedTx,
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
