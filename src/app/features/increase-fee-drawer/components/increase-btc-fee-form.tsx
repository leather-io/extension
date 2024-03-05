import { useNavigate } from 'react-router-dom';

import { Formik } from 'formik';
import { Stack } from 'leather-styles/jsx';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';
import { RouteUrls } from '@shared/route-urls';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { formatMoney } from '@app/common/money/format-money';
import { btcToSat } from '@app/common/money/unit-conversion';
import { getBitcoinTxValue } from '@app/common/transactions/bitcoin/utils';
import { BitcoinCustomFeeInput } from '@app/components/bitcoin-custom-fee/bitcoin-custom-fee-input';
import { BitcoinTransactionItem } from '@app/components/bitcoin-transaction-item/bitcoin-transaction-item';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { Caption } from '@app/ui/components/typography/caption';

import { useBtcIncreaseFee } from '../hooks/use-btc-increase-fee';
import { IncreaseFeeActions } from './increase-fee-actions';

interface IncreaseBtcFeeFormProps {
  btcTx: BitcoinTx;
}

export function IncreaseBtcFeeForm({ btcTx }: IncreaseBtcFeeFormProps) {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const navigate = useNavigate();
  const currentBitcoinAddress = nativeSegwitSigner.address;
  const { btcAvailableAssetBalance } = useBtcAssetBalance(currentBitcoinAddress);
  const { isBroadcasting, sizeInfo, onSubmit, validationSchema, recipient } =
    useBtcIncreaseFee(btcTx);

  const balance = formatMoney(btcAvailableAssetBalance.balance);

  if (isBroadcasting) {
    return <LoadingSpinner />;
  }

  const initialFeeRate = `${(btcTx.fee / sizeInfo.txVBytes).toFixed(0)}`;
  return (
    <Formik
      initialValues={{ feeRate: initialFeeRate }}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
      <Stack gap="space.06">
        {btcTx && <BitcoinTransactionItem transaction={btcTx} />}
        <Stack gap="space.04">
          <Stack gap="space.01">
            <BitcoinCustomFeeInput
              amount={Math.abs(
                btcToSat(getBitcoinTxValue(currentBitcoinAddress, btcTx)).toNumber()
              )}
              isSendingMax={false}
              recipient={recipient}
              hasInsufficientBalanceError={false}
              customFeeInitialValue={initialFeeRate}
            />
          </Stack>

          {btcAvailableAssetBalance && <Caption>Balance: {balance}</Caption>}
        </Stack>
        <IncreaseFeeActions isDisabled={false} onCancel={() => navigate(RouteUrls.Home)} />
      </Stack>
    </Formik>
  );
}
