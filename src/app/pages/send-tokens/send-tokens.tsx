import { memo, Suspense, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Formik } from 'formik';

import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useSelectedAsset } from '@app/common/hooks/use-selected-asset';
import { LoadingKeys } from '@app/common/hooks/use-loading';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useHandleSubmitTransaction } from '@app/common/hooks/use-submit-stx-transaction';
import { logger } from '@shared/logger';
import { Header } from '@app/components/header';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useSendFormValidation } from '@app/pages/send-tokens/hooks/use-send-form-validation';
import { RouteUrls } from '@shared/route-urls';
import { useFeeEstimationsState } from '@app/store/transactions/fees.hooks';
import {
  useLocalTransactionInputsState,
  useSendFormUnsignedTxState,
  useSignTransactionSoftwareWallet,
} from '@app/store/transactions/transaction.hooks';

import { SendTokensSoftwareConfirmDrawer } from './components/send-tokens-confirm-drawer/send-tokens-confirm-drawer';
import { SendFormInner } from './components/send-form-inner';
import { useResetNonceCallback } from './hooks/use-reset-nonce-callback';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Estimations } from '@shared/models/fees-types';
import { useWalletType } from '@app/common/use-wallet-type';
import { safeAwait } from '@stacks/ui';
import { connectLedger, signLedgerTransaction } from '@app/features/ledger/ledger-utils';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { delay } from '@app/common/utils';
import {
  createMessageSignature,
  deserializeTransaction,
  SingleSigSpendingCondition,
} from '@stacks/transactions';

function SendTokensFormBase() {
  const navigate = useNavigate();
  const { showEditNonce } = useDrawers();
  const [isShowing, setShowing] = useState(false);
  const [assetError, setAssetError] = useState<string | undefined>(undefined);
  const { setActiveTabActivity } = useHomeTabs();
  const { selectedAsset } = useSelectedAsset();
  const sendFormSchema = useSendFormValidation({ setAssetError });
  const [_txData, setTxData] = useLocalTransactionInputsState();
  const resetNonceCallback = useResetNonceCallback();
  const [_, setFeeEstimations] = useFeeEstimationsState();
  const transaction = useSendFormUnsignedTxState();
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();
  const analytics = useAnalytics();
  const { whenWallet } = useWalletType();
  useRouteHeader(<Header title="Send" onClose={() => navigate(RouteUrls.Home)} />);
  const account = useCurrentAccount();

  const handleConfirmDrawerOnClose = useCallback(() => {
    setShowing(false);
    setTxData(null);
    resetNonceCallback();
    void setActiveTabActivity();
  }, [resetNonceCallback, setActiveTabActivity, setTxData]);

  const broadcastTransactionFn = useHandleSubmitTransaction({
    loadingKey: LoadingKeys.CONFIRM_DRAWER,
  });

  const broadcastTransactionAction = useCallback(async () => {
    if (!transaction) {
      logger.error('Cannot broadcast transaction, no tx in state');
      toast.error('Unable to broadcast transaction');
      return;
    }

    if (!whenWallet) return;

    const signedTxGenerator = whenWallet({
      software() {
        console.log('creating software fn');
        return async () => {
          console.log('signing software fn');
          return signSoftwareWalletTx(transaction) ?? undefined;
        };
      },
      ledger() {
        console.log('create ledger fn');
        return async () => {
          console.log('signing ledger tx', account);
          if (!account) return toast.error('Must have an active account');
          try {
            const stacks = await connectLedger();
            const rawTx = transaction.serialize();
            console.log('rawtx', rawTx);
            const ledgerResponse = await signLedgerTransaction(stacks)(rawTx, account.index);
            console.log({ ledgerResponse });
            const sig = ledgerResponse.signatureVRS.toString('hex');
            const spendingCondition = createMessageSignature(sig);
            // console.log(spendingCondition);
            const newTx = deserializeTransaction(rawTx);
            (newTx.auth.spendingCondition as SingleSigSpendingCondition).signature =
              spendingCondition;
            return newTx;
          } catch (e) {
            console.log(e);
            toast.error('SOmething went wr0nG');
            return;
          }
        };
      },
    })();

    console.log('xxxxxxxxxx', await signedTxGenerator());

    // console.log('signing ledger tx', account);
    // if (!account) return toast.error('Must have an active account');
    // try {
    //   const stacks = await connectLedger();
    //   const rawTx = transaction.serialize();
    //   console.log('rawtx', rawTx);
    //   const ledgerResponse = await signLedgerTransaction(stacks)(rawTx, account.index);
    //   const sig = ledgerResponse.signatureVRS.toString('hex');
    //   const spendingCondition = createMessageSignature(sig);
    //   console.log(spendingCondition);
    //   const signedTx = deserializeTransaction(rawTx);
    //   (signedTx.auth.spendingCondition as SingleSigSpendingCondition).signature = spendingCondition;

    //   if (!signedTx) {
    //     logger.error('Cannot sign transaction, no account in state');
    //     toast.error('Unable to broadcast transaction');
    //     return;
    //   }

    //   await broadcastTransactionFn({
    //     transaction: signedTx,
    //     onClose() {
    //       handleConfirmDrawerOnClose();
    //       navigate(RouteUrls.Home);
    //     },
    //   });
    //   setFeeEstimations([]);
    // } catch (e) {
    //   console.log(e);
    //   toast.error('SOmething went wr0nG');
    //   return;
    // }
  }, [account, signSoftwareWalletTx, transaction, whenWallet]);

  const initialValues = {
    amount: '',
    recipient: '',
    fee: '',
    memo: '',
    feeType: Estimations[Estimations.Middle],
  };

  return (
    <Formik
      initialValues={initialValues}
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
          setShowing(true);
        }
      }}
    >
      {props => (
        <>
          <Suspense fallback={<></>}>
            <SendFormInner assetError={assetError} />
          </Suspense>
          {whenWallet({
            software: (
              <SendTokensSoftwareConfirmDrawer
                isShowing={isShowing && !showEditNonce}
                onClose={() => handleConfirmDrawerOnClose()}
                onUserSelectBroadcastTransaction={async () => {
                  await broadcastTransactionAction();
                  void analytics.track('submit_fee_for_transaction', {
                    type: props.values.feeType,
                    fee: props.values.fee,
                  });
                }}
              />
            ),
          })}
          <HighFeeDrawer />
        </>
      )}
    </Formik>
  );
}

export const SendTokensForm = memo(SendTokensFormBase);
