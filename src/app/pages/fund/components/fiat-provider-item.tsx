import { FundPageSelectors } from '@tests/page-objects/fund.selectors';

import { FastCheckoutBadge } from './fast-checkout-badge';
import { ZeroPercentFeesBadge } from './zero-percent-fees-badge';
import { FundAccountTile } from './fund-account-tile';

const availableInsideUnitedStatesDescription = 'Available both inside and outside of the US';
const availableOutsideUnitedStatesDescription = 'Available only outside of the US';

interface FiatProviderProps {
  icon: string;
  onGoToProvider(): void;
  hasFastCheckoutProcess: boolean;
  hasTradingFees: boolean;
  hasUnitedStatesAvailability: boolean;
  title: string;
}
export const FiatProviderItem = (props: FiatProviderProps) => {
  const {
    icon,
    onGoToProvider,
    hasFastCheckoutProcess,
    hasTradingFees,
    hasUnitedStatesAvailability,
    title,
  } = props;

  const Attributes = (
    <>
      {hasFastCheckoutProcess && <FastCheckoutBadge />}
      {!hasTradingFees && <ZeroPercentFeesBadge />}
    </>
  );

  return (
    <FundAccountTile
      attributes={Attributes}
      description={
        hasUnitedStatesAvailability
          ? availableInsideUnitedStatesDescription
          : availableOutsideUnitedStatesDescription
      }
      icon={icon}
      onClickTile={onGoToProvider}
      testId={FundPageSelectors.FiatProviderItem}
      title={title}
    />
  );
};
