import { truncateMiddle } from '@stacks/ui-utils';

import { Money } from '@shared/models/money.model';

import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { PsbtAddressTotalItem } from './psbt-address-total-item';
import { PsbtInscription } from './psbt-inscription';

interface PsbtAddressTotalsProps {
  accountInscriptionsBeingTransferred?: string[];
  accountInscriptionsBeingReceived?: string[];
  addressNativeSegwit: string;
  addressTaproot: string;
  addressNativeSegwitTotal: Money;
  addressTaprootTotal: Money;
  showNativeSegwitTotal: boolean;
  showTaprootTotal: boolean;
}
export function PsbtAddressTotals({
  accountInscriptionsBeingTransferred,
  accountInscriptionsBeingReceived,
  addressNativeSegwit,
  addressTaproot,
  addressNativeSegwitTotal,
  addressTaprootTotal,
  showNativeSegwitTotal,
  showTaprootTotal,
}: PsbtAddressTotalsProps) {
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  const isTransferringInscriptions = accountInscriptionsBeingTransferred?.length;
  const isReceivingInscriptions = accountInscriptionsBeingReceived?.length;

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
      {!isReceivingInscriptions && showTaprootTotal ? (
        <PsbtAddressTotalItem
          hoverLabel={addressTaproot}
          subtitle={truncateMiddle(addressTaproot)}
          subValue={i18nFormatCurrency(calculateBitcoinFiatValue(addressTaprootTotal))}
          value={formatMoney(addressTaprootTotal)}
        />
      ) : null}
      {isReceivingInscriptions
        ? accountInscriptionsBeingReceived.map(path => <PsbtInscription key={path} path={path} />)
        : null}
    </>
  );
}
