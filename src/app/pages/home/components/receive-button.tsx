import { useNavigate } from 'react-router-dom';

import { ButtonProps } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { PrimaryButton } from '@app/components/primary-button';
import { QrCodeIcon } from '@app/components/qr-code-icon';
import { useBitcoinFeature } from '@app/store/feature-flags/feature-flags.slice';

import { HomeActionButton } from './tx-button';

export function ReceiveButton(props: ButtonProps) {
  const navigate = useNavigate();
  const bitcoinFeature = useBitcoinFeature();

  return (
    <HomeActionButton
      buttonComponent={PrimaryButton}
      data-testid={HomePageSelectors.ReceiveCryptoAssetBtn}
      icon={QrCodeIcon}
      label="Receive"
      onClick={() => navigate(bitcoinFeature ? RouteUrls.Receive : RouteUrls.ReceiveStx)}
      {...props}
    />
  );
}
