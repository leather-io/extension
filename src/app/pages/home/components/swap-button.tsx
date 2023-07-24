import { useNavigate } from 'react-router-dom';

import { ButtonProps } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { PrimaryButton } from '@app/components/primary-button';

import { HomeActionButton } from './tx-button';
import { FiRefreshCw } from 'react-icons/fi';

export function SwapButton(props: ButtonProps) {
  const navigate = useNavigate();

  return (
    <HomeActionButton
      label="Swap"
      icon={FiRefreshCw}
      buttonComponent={PrimaryButton}
      data-testid={HomePageSelectors.SwapBtn}
      onClick={() => navigate(RouteUrls.Swap)}
      {...props}
    />
  );
}
