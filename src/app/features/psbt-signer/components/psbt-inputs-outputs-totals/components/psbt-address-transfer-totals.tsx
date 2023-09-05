import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { truncateMiddle } from '@app/common/utils/stacks-ui';
import { usePsbtSignerContext } from '@app/features/psbt-signer/psbt-signer.context';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { PsbtAddressTotalItem } from './psbt-address-total-item';
import { PsbtInscription } from './psbt-inscription';

interface PsbtAddressTotalsProps {
  showNativeSegwitTotal: boolean;
}
export function PsbtAddressTransferTotals({ showNativeSegwitTotal }: PsbtAddressTotalsProps) {
  const {
    accountInscriptionsBeingTransferred,

    addressNativeSegwit,

    addressNativeSegwitTotal,
  } = usePsbtSignerContext();
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  const isTransferringInscriptions = accountInscriptionsBeingTransferred?.length;

  return (
    <>
      {showNativeSegwitTotal ? (
        <PsbtAddressTotalItem
          hoverLabel={addressNativeSegwit}
          subtitle={truncateMiddle(addressNativeSegwit)}
          subValue={i18nFormatCurrency(calculateBitcoinFiatValue(addressNativeSegwitTotal))}
          value={formatMoney(addressNativeSegwitTotal)}
        />
      ) : null}
      {isTransferringInscriptions
        ? accountInscriptionsBeingTransferred.map(path => (
            <PsbtInscription key={path} path={path} />
          ))
        : null}
    </>
  );
}
