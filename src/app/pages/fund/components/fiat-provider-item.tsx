import { FundPageSelectors } from '@tests/page-objects/fund.selectors';

import { FastCheckoutBadge } from './fast-checkout-badge';
import { ZeroPercentFeesBadge } from './zero-percent-fees-badge';
import { FundAccountTile } from './fund-account-tile';

const description = 'Available in the US, South Korea, Europe and +33 countries';

interface FiatProviderProps {
  icon: string;
  onGoToProvider(): void;
  hasFastCheckoutProcess: boolean;
  hasTradingFees: boolean;
  title: string;
}
export const FiatProviderItem = (props: FiatProviderProps) => {
  const { icon, onGoToProvider, hasFastCheckoutProcess, hasTradingFees, title } = props;

  const Attributes = (
    <>
      {hasFastCheckoutProcess && <FastCheckoutBadge />}
      {!hasTradingFees && <ZeroPercentFeesBadge />}
    </>
  );

  return (
    <FundAccountTile
      attributes={Attributes}
      description={description}
      icon={icon}
      onClickTile={onGoToProvider}
      testId={FundPageSelectors.FiatProviderItem}
      title={title}
    />
  );
};
