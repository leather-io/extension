import React, { memo, Suspense, useState } from 'react';
import { Formik } from 'formik';

import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useDrawers } from '@common/hooks/use-drawers';
import { ScreenPaths } from '@common/types';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { HighFeeDrawer } from '@features/high-fee-drawer/high-fee-drawer';
import { useSendFormValidation } from '@pages/send-tokens/hooks/use-send-form-validation';
import { useLocalTransactionInputsState } from '@store/transactions/transaction.hooks';

import { SendTokensConfirmDrawer } from './components/send-tokens-confirm-drawer/send-tokens-confirm-drawer';
import { SendFormInner } from './components/send-form-inner';
import { ShowDelay } from './components/show-delay';
import { useResetNonceCallback } from './hooks/use-reset-nonce-callback';

function SendTokensFormBase() {
  const doChangeScreen = useChangeScreen();
  const { setIsIdle, setIsLoading } = useLoading(LoadingKeys.SEND_TOKENS_FORM);
  const { showEditNonce, showHighFeeConfirmation } = useDrawers();
  const [isShowing, setShowing] = useState(false);
  const [assetError, setAssetError] = useState<string | undefined>(undefined);
  const { selectedAsset } = useSelectedAsset();
  const sendFormSchema = useSendFormValidation({ setAssetError });
  const [, setTxData] = useLocalTransactionInputsState();
  const [beginShow, setBeginShow] = useState(false);
  const resetNonceCallback = useResetNonceCallback();

  const handleConfirmDrawerOnClose = (setSubmitting: (value: boolean) => void) => {
    setShowing(false);
    setSubmitting(false);
    setTxData(null);
    setIsIdle();
    resetNonceCallback();
  };

  return (
    <PopupContainer
      header={<Header title="Send" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)} />}
    >
      <Formik
        initialValues={{
          amount: '',
          recipient: '',
          fee: '',
          memo: '',
        }}
        initialErrors={{}}
        onSubmit={values => {
          if (
            selectedAsset &&
            values.amount &&
            values.recipient &&
            values.recipient !== '' &&
            values.fee
          ) {
            if (!assetError) {
              setTxData({
                amount: values.amount,
                fee: values.fee,
                memo: values.memo,
                recipient: values.recipient,
              });
              setIsLoading();
              setBeginShow(true);
            }
          }
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        validationSchema={sendFormSchema}
      >
        {formik => (
          <>
            {!showHighFeeConfirmation && beginShow && (
              <Suspense fallback={<></>}>
                <ShowDelay setShowing={setShowing} beginShow={beginShow} isShowing={isShowing} />
              </Suspense>
            )}
            <Suspense fallback={<></>}>
              <SendFormInner assetError={assetError} />
            </Suspense>
            <Suspense fallback={<></>}>
              <SendTokensConfirmDrawer
                isShowing={isShowing && !showEditNonce}
                onClose={() => handleConfirmDrawerOnClose(formik.setSubmitting)}
              />
            </Suspense>
            <HighFeeDrawer />
          </>
        )}
      </Formik>
    </PopupContainer>
  );
}

export const SendTokensForm = memo(SendTokensFormBase);
