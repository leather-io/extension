import { useLocation, useNavigate } from 'react-router-dom';

import { ButtonProps } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { PrimaryButton } from '@app/components/primary-button';
import { QrCodeIcon } from '@app/components/qr-code-icon';
import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';

import { HomeActionButton } from './tx-button';

export function ReceiveButton(props: ButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isBitcoinEnabled = useConfigBitcoinEnabled();
  const receivePath = isBitcoinEnabled ? RouteUrls.Receive : RouteUrls.ReceiveStx;

  return (
    <HomeActionButton
      buttonComponent={PrimaryButton}
      data-testid={HomePageSelectors.ReceiveCryptoAssetBtn}
      icon={QrCodeIcon}
      label="Receive"
      onClick={() =>
        navigate(receivePath, {
          state: { backgroundLocation: location },
        })
      }
      {...props}
    />
  );
}
