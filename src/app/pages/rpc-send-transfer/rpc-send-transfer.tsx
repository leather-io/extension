import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import { Box, HStack, styled } from 'leather-styles/jsx';

import { useBitcoinBroadcastTransaction } from '@leather.io/query';
import {
  Approver,
  Button,
  CheckmarkIcon,
  ItemLayout,
  Pressable,
  SkeletonLoader,
} from '@leather.io/ui';
import { createMoney, formatMoneyPadded } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';

import { focusInitatingTab } from '@app/common/focus-tab';
import { useGenerateUnsignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { CryptoAssetItemPlaceholder } from '@app/components/crypto-asset-item/crypto-asset-item-placeholder';
import { FormError } from '@app/components/error/form-error';
import { FeeItemIcon } from '@app/components/fees/fee-item-icon';
import { BackgroundOverlay } from '@app/components/loading-overlay';
import { RpcHeader } from '@app/components/rpc/rpc-header';
import { RpcSwitchAccount } from '@app/components/rpc/rpc-switch-account';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { SendTransferRecipients } from './components/send-transfer-recipients';
import { RpcSendTransferWrapper } from './components/send-transfer-wrapper';
import { useRpcSendTransferState } from './rpc-send-transfer-container';

export function RpcSendTransfer() {
  const {
    selectedFeeData,
    recipients,
    recipientsAddresses,
    totalAmount,
    onChooseTransferFee,
    origin,
    isLoadingFees,
    utxos,
    tabId,
    requestId,
    toggleSwitchAccount,
  } = useRpcSendTransferState();

  const navigate = useNavigate();

  const amountAsMoney = createMoney(new BigNumber(totalAmount), 'BTC');
  const formattedMoney = formatMoneyPadded(amountAsMoney);

  const generateTx = useGenerateUnsignedNativeSegwitTx();
  const signTransaction = useSignBitcoinTx();
  const btcBalance = useCurrentBtcCryptoAssetBalanceNativeSegwit();
  const { broadcastTx } = useBitcoinBroadcastTransaction();

  useBreakOnNonCompliantEntity(recipientsAddresses);

  function onCancel() {
    closeWindow();
  }

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const isInsufficientBalance = btcBalance.balance.availableBalance.amount.isLessThan(
    amountAsMoney.amount
  );

  async function onApprove() {
    setIsBroadcasting(true);

    function onError(e: unknown) {
      setIsBroadcasting(false);
      logger.error('Error broadcasting tx', e);
      navigate(RouteUrls.SendBtcError, {
        state: {
          error: e,
        },
      });
    }

    try {
      const feeRate = selectedFeeData.feeRate;
      const resp = await generateTx({ amount: amountAsMoney, recipients }, feeRate, utxos);

      if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

      const tx = await signTransaction(resp.psbt);

      tx.finalize();

      await broadcastTx({
        tx: tx.hex,
        async onSuccess(txid) {
          setIsBroadcasting(false);

          void analytics.track('broadcast_transaction', {
            symbol: 'btc',
            amount: amountAsMoney.amount.toNumber(),
          });

          chrome.tabs.sendMessage(
            tabId ?? 0,
            makeRpcSuccessResponse('sendTransfer', {
              id: requestId,
              result: { txid },
            })
          );

          setIsSubmitted(true);
        },
        onError,
      });
    } catch (error) {
      onError(error);
    } finally {
      setIsBroadcasting(false);
    }
  }

  const isLoading = btcBalance.isLoadingAllData;

  function getApproverActions() {
    if (isLoading) {
      return [
        <SkeletonLoader key="skeleton" isLoading height="40px" />,
        <SkeletonLoader key="skeleton" isLoading height="40px" />,
      ];
    }
    if (isInsufficientBalance) {
      return [];
    }

    if (isBroadcasting) {
      return [
        <Button key="submitting" fullWidth aria-busy disabled>
          Submitting...
        </Button>,
      ];
    }

    if (isLoading) {
      return [
        <Button key="submitting" fullWidth variant="success" disabled>
          <HStack justifyContent="center" alignItems="center" gap="space.02">
            <CheckmarkIcon variant="small" />
            Submitted
          </HStack>
        </Button>,
      ];
    }

    return [
      <Button key="cancel" onClick={onCancel} fullWidth variant="outline">
        <styled.span textStyle="label.02">Cancel</styled.span>
      </Button>,
      <Button type="submit" key="approve" onClick={onApprove} fullWidth>
        <styled.span textStyle="label.02">Approve</styled.span>
      </Button>,
    ];
  }

  const showOverlay = isBroadcasting || isSubmitted;

  function Error() {
    if (isLoading) return null;
    if (isInsufficientBalance) return <FormError text="Available balance insufficient" />;
    return null;
  }

  return (
    <RpcSendTransferWrapper showOverlay={showOverlay}>
      <Approver requester={origin} width="100%">
        <Box position="relative">
          <BackgroundOverlay show={showOverlay} />

          <RpcHeader
            title="Send BTC"
            href="https://leather.io/guides/connect-dapps"
            onPressRequestedByLink={e => {
              e.preventDefault();
              focusInitatingTab(tabId);
            }}
          />

          <RpcSwitchAccount toggleSwitchAccount={toggleSwitchAccount} />

          <SendTransferRecipients recipients={recipients} />

          <Approver.Section>
            <Approver.Subheader>Fee</Approver.Subheader>
            <Pressable onClick={onChooseTransferFee} mb="space.02">
              {isLoadingFees || !selectedFeeData ? (
                <CryptoAssetItemPlaceholder my="0" />
              ) : (
                <ItemLayout
                  img={<FeeItemIcon feeType={selectedFeeData.feeType} />}
                  titleLeft={selectedFeeData.titleLeft}
                  captionLeft={selectedFeeData.captionLeft}
                  titleRight={selectedFeeData.titleRight}
                  captionRight={selectedFeeData.captionRight}
                />
              )}
            </Pressable>
          </Approver.Section>
        </Box>
        <Approver.Actions actions={getApproverActions()}>
          <HStack justify="space-between" mb="space.03">
            <SkeletonLoader isLoading={isLoading} height="20px" width="96px">
              <styled.span textStyle="label.02">Total spend</styled.span>
            </SkeletonLoader>
            <SkeletonLoader isLoading={isLoading} height="20px" width="78px">
              <styled.span textStyle="label.02">{formattedMoney}</styled.span>
            </SkeletonLoader>
          </HStack>

          <Error />
        </Approver.Actions>
      </Approver>
    </RpcSendTransferWrapper>
  );
}
