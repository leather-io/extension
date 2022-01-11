import React, { memo, Suspense, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import toast from 'react-hot-toast';

import { useHomeTabs } from '@common/hooks/use-home-tabs';
import { useRouteHeader } from '@common/hooks/use-route-header';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useDrawers } from '@common/hooks/use-drawers';
import { useHandleSubmitTransaction } from '@common/hooks/use-submit-stx-transaction';
import { logger } from '@common/logger';
import { Header } from '@components/header';
import { HighFeeDrawer } from '@features/high-fee-drawer/high-fee-drawer';
import { useSendFormValidation } from '@pages/send-tokens/hooks/use-send-form-validation';
import { RouteUrls } from '@routes/route-urls';
import { useFeeEstimationsState } from '@store/transactions/fees.hooks';
import {
  useLocalTransactionInputsState,
  useSendFormUnsignedTxState,
  useSignTransactionSoftwareWallet,
} from '@store/transactions/transaction.hooks';

import { SendTokensConfirmDrawer } from './components/send-tokens-confirm-drawer/send-tokens-confirm-drawer';
import { SendFormInner } from './components/send-form-inner';
import { ShowDelay } from './components/show-delay';
import { useResetNonceCallback } from './hooks/use-reset-nonce-callback';

function SendTokensFormBase() {
  const navigate = useNavigate();
  const { setIsIdle, setIsLoading } = useLoading(LoadingKeys.SEND_TOKENS_FORM);
  const { showEditNonce, showHighFeeConfirmation } = useDrawers();
  const [isShowing, setShowing] = useState(false);
  const [assetError, setAssetError] = useState<string | undefined>(undefined);
  const { setActiveTabActivity } = useHomeTabs();
  const { selectedAsset } = useSelectedAsset();
  const sendFormSchema = useSendFormValidation({ setAssetError });
  const [_txData, setTxData] = useLocalTransactionInputsState();
  const [beginShow, setBeginShow] = useState(false);
  const resetNonceCallback = useResetNonceCallback();
  const [, setFeeEstimations] = useFeeEstimationsState();
  const transaction = useSendFormUnsignedTxState();
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();

  useRouteHeader(<Header title="Send" onClose={() => navigate(RouteUrls.Home)} />);

  const handleConfirmDrawerOnClose = useCallback(() => {
    setShowing(false);
    setTxData(null);
    setIsIdle();
    resetNonceCallback();
    setActiveTabActivity();
    navigate(RouteUrls.Home);
  }, [navigate, resetNonceCallback, setActiveTabActivity, setIsIdle, setTxData]);

  const broadcastTransactionFn = useHandleSubmitTransaction({
    loadingKey: LoadingKeys.CONFIRM_DRAWER,
  });

  const broadcastTransactionAction = useCallback(async () => {
    if (!transaction) {
      logger.error('Cannot broadcast transaction, no tx in state');
      toast.error('Unable to broadcast transaction');
      return;
    }
    const signedTx = signSoftwareWalletTx(transaction);
    await broadcastTransactionFn({
      transaction: signedTx,
      onClose() {
        handleConfirmDrawerOnClose();
      },
    });
    setFeeEstimations([]);
  }, [
    broadcastTransactionFn,
    handleConfirmDrawerOnClose,
    setFeeEstimations,
    signSoftwareWalletTx,
    transaction,
  ]);

  const initalValues = {
    amount: '',
    recipient: '',
    fee: '',
    memo: '',
  };

  return (
    <Formik
      initialValues={initalValues}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={sendFormSchema}
      onSubmit={values => {
        if (selectedAsset && !assetError) {
          setTxData({
            amount: values.amount,
            fee: values.fee,
            memo: values.memo,
            recipient: values.recipient,
          });
          setIsLoading();
          setBeginShow(true);
        }
      }}
    >
      {() => (
        <>
          {!showHighFeeConfirmation && beginShow && (
            <Suspense fallback={<></>}>
              <ShowDelay setShowing={setShowing} beginShow={beginShow} isShowing={isShowing} />
            </Suspense>
          )}
          <Suspense fallback={<></>}>
            <SendFormInner assetError={assetError} />
          </Suspense>
          <SendTokensConfirmDrawer
            isShowing={isShowing && !showEditNonce}
            onClose={() => handleConfirmDrawerOnClose()}
            onUserSelectBroadcastTransaction={async () => {
              await broadcastTransactionAction();
            }}
          />
          <HighFeeDrawer />
        </>
      )}
    </Formik>
  );
}

export const SendTokensForm = memo(SendTokensFormBase);
