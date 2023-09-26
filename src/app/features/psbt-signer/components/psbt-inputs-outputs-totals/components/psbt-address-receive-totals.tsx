import { truncateMiddle } from '@stacks/ui-utils';

import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { usePsbtSignerContext } from '@app/features/psbt-signer/psbt-signer.context';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { PsbtAddressTotalItem } from './psbt-address-total-item';
import { PsbtInscription } from './psbt-inscription';

interface PsbtAddressTotalsProps {
  showTaprootTotal: boolean;
}
export function PsbtAddressReceiveTotals({ showTaprootTotal }: PsbtAddressTotalsProps) {
  const { accountInscriptionsBeingReceived, addressTaproot, addressTaprootTotal } =
    usePsbtSignerContext();
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  const isReceivingInscriptions = accountInscriptionsBeingReceived?.length;

  return (
    <>
      {!isReceivingInscriptions && showTaprootTotal ? (
        <PsbtAddressTotalItem
          hoverLabel={addressTaproot}
          subtitle={truncateMiddle(addressTaproot)}
          subValue={i18nFormatCurrency(calculateBitcoinFiatValue(addressTaprootTotal))}
          value={formatMoney(addressTaprootTotal)}
        />
      ) : null}
      {isReceivingInscriptions
        ? accountInscriptionsBeingReceived.map(inscription => (
            <PsbtInscription key={inscription.id} inscription={inscription} />
          ))
        : null}
    </>
  );
}
