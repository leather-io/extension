import React, { memo, Suspense, useState } from 'react';
import { Formik } from 'formik';

import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useDrawers } from '@common/hooks/use-drawers';
import { stxToMicroStx } from '@common/stacks-utils';
import { TransactionFormValues } from '@common/types';
import { useSendFormValidation } from '@pages/send-tokens/hooks/use-send-form-validation';
import { useLocalTransactionInputsState } from '@store/transactions/transaction.hooks';
import { useFeeState } from '@store/transactions/fees.hooks';

import { SendTokensConfirmDrawer } from './components/send-tokens-confirm-drawer/send-tokens-confirm-drawer';
import { SendFormInner } from './components/send-form-inner';
import { ShowDelay } from './components/show-delay';
import { useResetNonceCallback } from './hooks/use-reset-nonce-callback';

const initialValues: TransactionFormValues = {
  amount: '',
  recipient: '',
  txFee: '',
  memo: '',
};

function SendTokensFormBase() {
  const { setIsIdle, setIsLoading } = useLoading(LoadingKeys.SEND_TOKENS_FORM);
  const [isShowing, setShowing] = useState(false);
  const [assetError, setAssetError] = useState<string | undefined>(undefined);
  const { selectedAsset } = useSelectedAsset();
  const sendFormSchema = useSendFormValidation({ setAssetError });
  const [, setTxData] = useLocalTransactionInputsState();
  const [beginShow, setBeginShow] = useState(false);
  const { showEditNonce } = useDrawers();
  const resetNonceCallback = useResetNonceCallback();
  const [, setFee] = useFeeState();

  const handleConfirmDrawerOnClose = (setSubmitting: (value: boolean) => void) => {
    setShowing(false);
    setSubmitting(false);
    setTxData(null);
    setIsIdle();
    resetNonceCallback();
  };

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={{}}
      onSubmit={values => {
        if (
          values.amount &&
          values.recipient &&
          values.recipient !== '' &&
          values.txFee &&
          selectedAsset
        )
          if (!assetError) {
            setTxData({
              amount: values.amount,
              memo: values.memo,
              recipient: values.recipient,
            });
            setFee(stxToMicroStx(values.txFee).toNumber());
            setIsLoading();
            setBeginShow(true);
          }
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={sendFormSchema}
    >
      {form => (
        <>
          {beginShow && (
            <Suspense fallback={<></>}>
              <ShowDelay setShowing={setShowing} beginShow={beginShow} isShowing={isShowing} />
            </Suspense>
          )}
          <Suspense fallback={<></>}>
            <SendTokensConfirmDrawer
              isShowing={isShowing && !showEditNonce}
              onClose={() => handleConfirmDrawerOnClose(form.setSubmitting)}
            />
          </Suspense>
          <Suspense fallback={<></>}>
            <SendFormInner assetError={assetError} />
          </Suspense>
        </>
      )}
    </Formik>
  );
}

export const SendTokensForm = memo(SendTokensFormBase);
