import { useNavigate } from 'react-router-dom';

import { ButtonProps } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { PrimaryButton } from '@app/components/primary-button';
import { QrCodeIcon } from '@app/components/qr-code-icon';
import { useConfigBitcoinEnabled } from '@app/query/common/hiro-config/hiro-config.query';

import { HomeActionButton } from './tx-button';

export function ReceiveButton(props: ButtonProps) {
  const navigate = useNavigate();
  const isBitcoinEnabled = useConfigBitcoinEnabled();

  return (
    <HomeActionButton
      buttonComponent={PrimaryButton}
      data-testid={HomePageSelectors.ReceiveCryptoAssetBtn}
      icon={QrCodeIcon}
      label="Receive"
      onClick={() => navigate(isBitcoinEnabled ? RouteUrls.Receive : RouteUrls.ReceiveStx)}
      {...props}
    />
  );
}
