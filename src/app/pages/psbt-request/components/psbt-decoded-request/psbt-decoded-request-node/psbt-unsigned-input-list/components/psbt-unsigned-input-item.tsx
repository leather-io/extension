import { truncateMiddle } from '@stacks/ui-utils';

import { i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { OrdApiInscriptionTxOutput } from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';
import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { PsbtDecodedNodeLayout } from '../../psbt-decoded-node.layout';
import { PsbtUnsignedInputWithInscription } from './psbt-unsigned-input-with-inscription';

interface PsbtUnsignedInputItemProps {
  addressNativeSegwit: string;
  addressTaproot: string;
  utxo: TaprootUtxo & OrdApiInscriptionTxOutput;
}
export function PsbtUnsignedInputItem({
  addressNativeSegwit,
  addressTaproot,
  utxo,
}: PsbtUnsignedInputItemProps) {
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  const isInputCurrentAddress =
    utxo.address === addressNativeSegwit || utxo.address === addressTaproot;
  const inputValue = satToBtc(utxo.value).toString();
  const fiatValue = i18nFormatCurrency(calculateBitcoinFiatValue(utxo.value));
  const inscription = utxo.inscriptions;

  if (!utxo.address) return null;

  return inscription ? (
    <PsbtUnsignedInputWithInscription
      address={utxo.address}
      inputValue={inputValue}
      path={inscription}
    />
  ) : (
    <PsbtDecodedNodeLayout
      hoverLabel={utxo.address}
      subtitle={truncateMiddle(utxo.address)}
      subValue={`${fiatValue} USD`}
      value={`${isInputCurrentAddress ? '-' : '+'}${inputValue}`}
    />
  );
}
