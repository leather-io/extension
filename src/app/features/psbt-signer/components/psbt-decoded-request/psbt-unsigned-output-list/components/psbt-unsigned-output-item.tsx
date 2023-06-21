import * as btc from '@scure/btc-signer';
import { truncateMiddle } from '@stacks/ui-utils';

import { getAddressFromOutScript } from '@shared/crypto/bitcoin/bitcoin.utils';

import { i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { PsbtDecodedNodeLayout } from '../../psbt-decoded-request-node/psbt-decoded-node.layout';

interface PsbtUnsignedOutputItemProps {
  addressNativeSegwit: string;
  addressTaproot: string;
  output: btc.TransactionOutputRequired;
}
export function PsbtUnsignedOutputItem({
  addressNativeSegwit,
  addressTaproot,
  output,
}: PsbtUnsignedOutputItemProps) {
  const network = useCurrentNetwork();
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  const addressFromScript = getAddressFromOutScript(output.script, network.chain.bitcoin.network);

  const isOutputCurrentAddress =
    addressFromScript === addressNativeSegwit || addressFromScript === addressTaproot;
  const outputValue = satToBtc(Number(output.amount)).toString();

  return (
    <PsbtDecodedNodeLayout
      hoverLabel={addressFromScript}
      subtitle={truncateMiddle(addressFromScript)}
      subValue={i18nFormatCurrency(calculateBitcoinFiatValue(outputValue))}
      value={`${isOutputCurrentAddress ? '+' : ' '}${outputValue}`}
    />
  );
}
