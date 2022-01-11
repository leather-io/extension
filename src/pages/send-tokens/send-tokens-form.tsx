import React, { memo, Suspense, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import toast from 'react-hot-toast';

import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useDrawers } from '@common/hooks/use-drawers';
import { RouteUrls } from '@routes/route-urls';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';
import { HighFeeDrawer } from '@features/high-fee-drawer/high-fee-drawer';
import { useSendFormValidation } from '@pages/send-tokens/hooks/use-send-form-validation';
import {
  useLocalTransactionInputsState,
  useSendFormUnsignedTxState,
  useSignTransactionSoftwareWallet,
} from '@store/transactions/transaction.hooks';

import { SendTokensConfirmDrawer } from './components/send-tokens-confirm-drawer/send-tokens-confirm-drawer';
import { SendFormInner } from './components/send-form-inner';
import { ShowDelay } from './components/show-delay';
import { useResetNonceCallback } from './hooks/use-reset-nonce-callback';
import { useHandleSubmitTransaction } from '@common/hooks/use-submit-stx-transaction';
import { useFeeEstimationsState } from '@store/transactions/fees.hooks';
import { logger } from '@common/logger';

function SendTokensFormBase() {
  const navigate = useNavigate();
  const { setIsIdle, setIsLoading } = useLoading(LoadingKeys.SEND_TOKENS_FORM);
  const { showEditNonce, showHighFeeConfirmation } = useDrawers();
  const [isShowing, setShowing] = useState(false);
  const [assetError, setAssetError] = useState<string | undefined>(undefined);
  const { selectedAsset } = useSelectedAsset();
  const sendFormSchema = useSendFormValidation({ setAssetError });
  const [_txData, setTxData] = useLocalTransactionInputsState();
  const [beginShow, setBeginShow] = useState(false);
  const resetNonceCallback = useResetNonceCallback();
  const [, setFeeEstimations] = useFeeEstimationsState();
  const transaction = useSendFormUnsignedTxState();

  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();

  const handleConfirmDrawerOnClose = useCallback(() => {
    setShowing(false);
    setTxData(null);
    setIsIdle();
    resetNonceCallback();
    navigate(RouteUrls.Home);
  }, [navigate, resetNonceCallback, setIsIdle, setTxData]);

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
    <PopupContainer header={<Header title="Send" onClose={() => navigate(RouteUrls.Home)} />}>
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
    </PopupContainer>
  );
}

export const SendTokensForm = memo(SendTokensFormBase);
