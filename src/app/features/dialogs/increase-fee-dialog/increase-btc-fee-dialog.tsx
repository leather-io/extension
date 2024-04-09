import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Formik } from 'formik';
import { Flex, Stack } from 'leather-styles/jsx';

import { createMoney } from '@shared/models/money.model';
import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';
import { RouteUrls } from '@shared/route-urls';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { formatMoney } from '@app/common/money/format-money';
import { btcToSat } from '@app/common/money/unit-conversion';
import { getBitcoinTxValue } from '@app/common/transactions/bitcoin/utils';
import { BitcoinCustomFeeInput } from '@app/components/bitcoin-custom-fee/bitcoin-custom-fee-input';
import { BitcoinTransactionItem } from '@app/components/bitcoin-transaction-item/bitcoin-transaction-item';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';
import { Spinner } from '@app/ui/components/spinner';
import { Caption } from '@app/ui/components/typography/caption';

import { IncreaseFeeActions } from './components/increase-fee-actions';
import { useBtcIncreaseFee } from './hooks/use-btc-increase-fee';

export function IncreaseBtcFeeDialog() {
  const tx = useLocationStateWithCache('btcTx') as BitcoinTx;
  const navigate = useNavigate();
  const location = useLocation();

  const btcTx = tx;
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const currentBitcoinAddress = nativeSegwitSigner.address;
  const { btcCryptoAssetBalance } = useBtcCryptoAssetBalanceNativeSegwit(currentBitcoinAddress);
  const { isBroadcasting, sizeInfo, onSubmit, validationSchema, recipient } =
    useBtcIncreaseFee(btcTx);

  const balance = formatMoney(btcCryptoAssetBalance.availableBalance);

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
        <>
          <Dialog
            isShowing={location.pathname === RouteUrls.IncreaseBtcFee}
            onClose={onClose}
            header={<DialogHeader title="Increase fee" />}
            footer={
              <Footer flexDirection="row">
                <IncreaseFeeActions isDisabled={false} onCancel={() => navigate(RouteUrls.Home)} />
              </Footer>
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
                  {isBroadcasting && <LoadingSpinner />}
                  <Stack gap="space.04">
                    <Stack gap="space.01">
                      <BitcoinCustomFeeInput
                        amount={Math.abs(
                          btcToSat(getBitcoinTxValue(currentBitcoinAddress, btcTx)).toNumber()
                        )}
                        isSendingMax={false}
                        recipients={recipients}
                        hasInsufficientBalanceError={false}
                        customFeeInitialValue={initialFeeRate}
                      />
                    </Stack>

                    {btcCryptoAssetBalance && <Caption>Balance: {balance}</Caption>}
                  </Stack>
                </Stack>
              </Suspense>
            </Stack>
          </Dialog>
          <Outlet />
        </>
      </Formik>
    </>
  );
}
