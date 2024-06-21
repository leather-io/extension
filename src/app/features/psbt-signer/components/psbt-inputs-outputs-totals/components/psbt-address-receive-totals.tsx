import { useCalculateBitcoinFiatValue } from '@leather.io/query';
import { formatMoney, i18nFormatCurrency, truncateMiddle } from '@leather.io/utils';

import { removeMinusSign } from '@app/common/utils';
import { usePsbtSignerContext } from '@app/features/psbt-signer/psbt-signer.context';

import { PsbtAddressTotalItem } from './psbt-address-total-item';
import { PsbtInscription } from './psbt-inscription';

interface PsbtAddressTotalsProps {
  showNativeSegwitTotal: boolean;
  showTaprootTotal: boolean;
}
export function PsbtAddressReceiveTotals({
  showNativeSegwitTotal,
  showTaprootTotal,
}: PsbtAddressTotalsProps) {
  const {
    accountInscriptionsBeingReceived,
    addressNativeSegwit,
    addressNativeSegwitTotal,
    addressTaproot,
    addressTaprootTotal,
  } = usePsbtSignerContext();
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  const isReceivingInscriptions = accountInscriptionsBeingReceived?.length > 0;

  return (
    <>
      {!isReceivingInscriptions && showNativeSegwitTotal ? (
        <PsbtAddressTotalItem
          hoverLabel={addressNativeSegwit}
          subtitle={truncateMiddle(addressNativeSegwit)}
          subValue={removeMinusSign(
            i18nFormatCurrency(calculateBitcoinFiatValue(addressNativeSegwitTotal))
          )}
          value={removeMinusSign(formatMoney(addressNativeSegwitTotal))}
        />
      ) : null}
      {!isReceivingInscriptions && showTaprootTotal ? (
        <PsbtAddressTotalItem
          hoverLabel={addressTaproot}
          subtitle={truncateMiddle(addressTaproot)}
          subValue={removeMinusSign(
            i18nFormatCurrency(calculateBitcoinFiatValue(addressTaprootTotal))
          )}
          value={removeMinusSign(formatMoney(addressTaprootTotal))}
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
