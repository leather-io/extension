import { truncateMiddle } from '@stacks/ui-utils';

import { createMoney } from '@shared/models/money.model';
import { BitcoinTransactionVectorOutput } from '@shared/models/transactions/bitcoin-transaction.model';

import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { PsbtDecodedNodeLayout } from '../../psbt-decoded-request-node/psbt-decoded-node.layout';

interface PsbtUnsignedInputItemProps {
  addressNativeSegwit: string;
  addressTaproot: string;
  utxo: BitcoinTransactionVectorOutput;
}
export function PsbtUnsignedInputItem({
  addressNativeSegwit,
  addressTaproot,
  utxo,
}: PsbtUnsignedInputItemProps) {
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  const isInputCurrentAddress =
    utxo.scriptpubkey_address === addressNativeSegwit ||
    utxo.scriptpubkey_address === addressTaproot;
  const inputValueAsMoney = createMoney(utxo.value, 'BTC');

  return (
    <PsbtDecodedNodeLayout
      hoverLabel={utxo.scriptpubkey_address}
      subtitle={truncateMiddle(utxo.scriptpubkey_address)}
      subValue={i18nFormatCurrency(calculateBitcoinFiatValue(inputValueAsMoney))}
      value={`${isInputCurrentAddress ? '-' : '+'}${inputValueAsMoney.amount.toString()}`}
    />
  );
}
