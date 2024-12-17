import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Formik } from 'formik';
import { Flex, Stack } from 'leather-styles/jsx';

import type { BitcoinTx } from '@leather.io/models';
import { Caption, Sheet, SheetHeader, Spinner } from '@leather.io/ui';
import { btcToSat, createMoney, formatMoney } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { getBitcoinTxValue } from '@app/common/transactions/bitcoin/utils';
import { BitcoinCustomFeeInput } from '@app/components/bitcoin-custom-fee/bitcoin-custom-fee-input';
import { BitcoinTransactionItem } from '@app/components/bitcoin-transaction-item/bitcoin-transaction-item';
import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { TransactionActions } from './components/transaction-actions';
import { useBtcIncreaseFee } from './hooks/use-btc-increase-fee';

export function IncreaseBtcFeeSheet() {
  const tx = useLocationStateWithCache('btcTx') as BitcoinTx;
  const navigate = useNavigate();
  const location = useLocation();

  const btcTx = tx;
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const currentBitcoinAddress = nativeSegwitSigner.address;
  const { balance } = useBtcCryptoAssetBalanceNativeSegwit(currentBitcoinAddress);
  const { isBroadcasting, sizeInfo, onSubmit, validationSchema, recipient } =
    useBtcIncreaseFee(btcTx);

  const btcBalance = formatMoney(balance.availableBalance);

  const recipients = [
    {
      address: recipient,
      amount: createMoney(btcToSat(getBitcoinTxValue(currentBitcoinAddress, btcTx)), 'BTC'),
    },
  ];

  const onClose = () => {
    navigate(RouteUrls.Home);
  };

  if (!tx) return null;

  const initialFeeRate = `${(tx.fee / sizeInfo.txVBytes).toFixed(0)}`;

  return (
    <>
      <Formik
        initialValues={{ feeRate: initialFeeRate }}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        validationSchema={validationSchema}
      >
        {({ submitForm }) => (
          <>
            <Sheet
              isShowing={location.pathname === RouteUrls.IncreaseBtcFee}
              onClose={onClose}
              header={<SheetHeader title="Increase fee" />}
              footer={
                <TransactionActions
                  isDisabled={isBroadcasting}
                  isBroadcasting={isBroadcasting}
                  onSubmit={submitForm}
                  onCancel={() => navigate(RouteUrls.Home)}
                />
              }
            >
              <Stack gap="space.05" px="space.05" pb="space.05">
                <Suspense
                  fallback={
                    <Flex alignItems="center" justifyContent="center" p="space.06">
                      <Spinner />
                    </Flex>
                  }
                >
                  <Caption>
                    If your transaction is pending for a long time, its fee might not be high enough
                    to be included in a block. Update the fee for a higher value and try again.
                  </Caption>
                  <Stack gap="space.06">
                    {btcTx && <BitcoinTransactionItem transaction={btcTx} />}
                    <Stack gap="space.04">
                      <Stack gap="space.01">
                        <BitcoinCustomFeeInput
                          isSendingMax={false}
                          recipients={recipients}
                          hasInsufficientBalanceError={false}
                          customFeeInitialValue={initialFeeRate}
                        />
                      </Stack>

                      {balance && <Caption>Balance: {btcBalance}</Caption>}
                    </Stack>
                  </Stack>
                </Suspense>
              </Stack>
            </Sheet>
            <Outlet />
          </>
        )}
      </Formik>
    </>
  );
}
