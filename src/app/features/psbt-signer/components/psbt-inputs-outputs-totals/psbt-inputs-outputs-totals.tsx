import { Box } from '@stacks/ui';
import { color } from '@stacks/ui-utils';

import { Hr } from '@app/components/hr';
import { usePsbtSignerContext } from '@app/features/psbt-signer/psbt-signer.context';

import { PsbtRequestDetailsSectionHeader } from '../psbt-request-details-section-header';
import { PsbtRequestDetailsSectionLayout } from '../psbt-request-details-section.layout';
import { PsbtAddressTotals } from './components/psbt-address-totals';

export function PsbtInputsOutputsTotals() {
  const { addressNativeSegwitTotal, addressTaprootTotal } = usePsbtSignerContext();
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
            showNativeSegwitTotal={isNativeSegwitTotalLessThanZero}
            showTaprootTotal={isTaprootTotalLessThanZero}
          />
        </Box>
      ) : null}
    </PsbtRequestDetailsSectionLayout>
  );
}
