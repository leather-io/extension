import { useNavigate } from 'react-router-dom';

import { ButtonProps } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { SecondaryButton } from '@app/components/secondary-button';

import { HomeActionButton } from './home-action-button';

export function SwapButton(props: ButtonProps) {
  const navigate = useNavigate();

  return (
    <HomeActionButton
      buttonComponent={SecondaryButton}
      data-testid={HomePageSelectors.SwapBtn}
      label="Swap"
      onClick={() => navigate(RouteUrls.Swap)}
      {...props}
    />
  );
}
