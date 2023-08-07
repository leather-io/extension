import { useNavigate } from 'react-router-dom';

import { ButtonProps } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { PrimaryButton } from '@app/components/primary-button';
import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';

import { HomeActionButton } from './home-action-button';

export function ReceiveButton(props: ButtonProps) {
  const navigate = useNavigate();
  const isBitcoinEnabled = useConfigBitcoinEnabled();

  return (
    <HomeActionButton
      buttonComponent={PrimaryButton}
      data-testid={HomePageSelectors.ReceiveCryptoAssetBtn}
      label="Receive"
      onClick={() => navigate(isBitcoinEnabled ? RouteUrls.Receive : RouteUrls.ReceiveStx)}
      {...props}
    />
  );
}
