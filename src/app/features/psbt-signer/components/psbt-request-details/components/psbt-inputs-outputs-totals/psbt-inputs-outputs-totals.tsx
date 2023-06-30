import { Box } from '@stacks/ui';
import { color } from '@stacks/ui-utils';

import { Money } from '@shared/models/money.model';

import { Hr } from '@app/components/hr';

import { PsbtRequestDetailsSectionHeader } from '../psbt-request-details-section-header';
import { PsbtRequestDetailsSectionLayout } from '../psbt-request-details-section.layout';
import { PsbtAddressTotals } from './components/psbt-address-totals';

interface PsbtInputsOutputsTotalsProps {
  accountInscriptionsBeingTransferred: string[];
  accountInscriptionsBeingReceived: string[];
  addressNativeSegwit: string;
  addressTaproot: string;
  addressNativeSegwitTotal: Money;
  addressTaprootTotal: Money;
}
export function PsbtInputsOutputsTotals({
  accountInscriptionsBeingTransferred,
  accountInscriptionsBeingReceived,
  addressNativeSegwit,
  addressTaproot,
  addressNativeSegwitTotal,
  addressTaprootTotal,
}: PsbtInputsOutputsTotalsProps) {
  // Transferring (+)
  const isNativeSegwitTotalGreaterThanZero = addressNativeSegwitTotal.amount.isGreaterThan(0);
  const isTaprootTotalGreaterThanZero = addressTaprootTotal.amount.isGreaterThan(0);
  // Receiving (-)
  const isNativeSegwitTotalLessThanZero = addressNativeSegwitTotal.amount.isLessThan(0);
  const isTaprootTotalLessThanZero = addressTaprootTotal.amount.isLessThan(0);
  const isTotalZero =
    addressNativeSegwitTotal.amount.isEqualTo(0) && addressTaprootTotal.amount.isEqualTo(0);

  const isTransferring = isNativeSegwitTotalGreaterThanZero || isTaprootTotalGreaterThanZero;
  const isReceiving = isNativeSegwitTotalLessThanZero || isTaprootTotalLessThanZero;
  const showDivider = isTransferring && isReceiving;

  if (isTotalZero) return null;

  return (
    <PsbtRequestDetailsSectionLayout p="unset">
      {isTransferring ? (
        <Box p="loose">
          <PsbtRequestDetailsSectionHeader title="You'll transfer" />
          <PsbtAddressTotals
            accountInscriptionsBeingTransferred={accountInscriptionsBeingTransferred}
            addressNativeSegwit={addressNativeSegwit}
            addressTaproot={addressTaproot}
            addressNativeSegwitTotal={addressNativeSegwitTotal}
            addressTaprootTotal={addressTaprootTotal}
            showNativeSegwitTotal={isNativeSegwitTotalGreaterThanZero}
            showTaprootTotal={isTaprootTotalGreaterThanZero}
          />
        </Box>
      ) : null}
      {showDivider ? <Hr backgroundColor={color('border')} height="3px" /> : null}
      {isReceiving ? (
        <Box p="loose">
          <PsbtRequestDetailsSectionHeader title="You'll receive" />
          <PsbtAddressTotals
            accountInscriptionsBeingReceived={accountInscriptionsBeingReceived}
            addressNativeSegwit={addressNativeSegwit}
            addressTaproot={addressTaproot}
            addressNativeSegwitTotal={addressNativeSegwitTotal}
            addressTaprootTotal={addressTaprootTotal}
            showNativeSegwitTotal={isNativeSegwitTotalLessThanZero}
            showTaprootTotal={isTaprootTotalLessThanZero}
          />
        </Box>
      ) : null}
    </PsbtRequestDetailsSectionLayout>
  );
}
