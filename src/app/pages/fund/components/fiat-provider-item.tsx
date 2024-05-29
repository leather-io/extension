import { StarIcon, Tag, ZapIcon } from '@leather-wallet/ui';
import { FundPageSelectors } from '@tests/selectors/fund.selectors';

import { AvailableRegions } from '@app/query/common/remote-config/remote-config.query';

import { FundAccountTile } from './fund-account-tile';

const availableInsideUnitedStatesDescription = 'Available only inside of the US';
const availableOutsideUnitedStatesDescription = 'Available only outside of the US';
const availableGloballyDescription = 'Available both inside and outside of the US';

function getProviderAvailability(availableRegions: AvailableRegions) {
  switch (availableRegions) {
    case AvailableRegions.InsideUsa:
      return availableInsideUnitedStatesDescription;
    case AvailableRegions.OutsideUsa:
      return availableOutsideUnitedStatesDescription;
    case AvailableRegions.Global:
      return availableGloballyDescription;
    default:
      return '';
  }
}

interface FiatProviderProps {
  availableRegions: AvailableRegions;
  hasFastCheckoutProcess: boolean;
  hasTradingFees: boolean;
  icon: string;
  onGoToProvider(): void;
  title: string;
}
export function FiatProviderItem(props: FiatProviderProps) {
  const { availableRegions, hasFastCheckoutProcess, hasTradingFees, icon, onGoToProvider, title } =
    props;

  const Attributes = (
    <>
      {hasFastCheckoutProcess && (
        <Tag icon={<ZapIcon variant="small" />} label="Fast checkout" variant="success" />
      )}
      {!hasTradingFees && (
        <Tag icon={<StarIcon variant="small" />} label="0 % Fees" variant="warning" />
      )}
    </>
  );

  return (
    <FundAccountTile
      attributes={Attributes}
      description={getProviderAvailability(availableRegions)}
      icon={icon}
      onClickTile={onGoToProvider}
      testId={FundPageSelectors.FiatProviderItem}
      title={title}
    />
  );
}
