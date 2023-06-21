import { truncateMiddle } from '@stacks/ui-utils';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';

import { formatMoneyWithoutSymbol, i18nFormatCurrency } from '@app/common/money/format-money';
import { OrdApiInscriptionTxOutput } from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';
import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { PsbtDecodedNodeLayout } from '../../psbt-decoded-request-node/psbt-decoded-node.layout';
import { PsbtUnsignedInputWithInscription } from './psbt-unsigned-input-with-inscription';

interface PsbtUnsignedInputItemWithPossibleInscriptionProps {
  addressNativeSegwit: string;
  addressTaproot: string;
  utxo: TaprootUtxo & OrdApiInscriptionTxOutput;
}
export function PsbtUnsignedInputItemWithPossibleInscription({
  addressNativeSegwit,
  addressTaproot,
  utxo,
}: PsbtUnsignedInputItemWithPossibleInscriptionProps) {
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  const isInputCurrentAddress =
    utxo.address === addressNativeSegwit || utxo.address === addressTaproot;
  const inputValueAsMoney = createMoney(utxo.value, 'BTC');

  if (!utxo.address) {
    logger.error('UTXO does not have an address');
    return null;
  }

  return utxo.inscriptions ? (
    <PsbtUnsignedInputWithInscription
      address={utxo.address}
      path={utxo.inscriptions}
      value={inputValueAsMoney}
    />
  ) : (
    <PsbtDecodedNodeLayout
      hoverLabel={utxo.address}
      subtitle={truncateMiddle(utxo.address)}
      subValue={i18nFormatCurrency(calculateBitcoinFiatValue(inputValueAsMoney))}
      value={`${isInputCurrentAddress ? '-' : '+'}${formatMoneyWithoutSymbol(inputValueAsMoney)}`}
    />
  );
}
