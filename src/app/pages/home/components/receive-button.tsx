import { useNavigate } from 'react-router-dom';

import { ButtonProps } from '@stacks/ui';

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
      icon={QrCodeIcon}
      onClick={() => navigate(bitcoinFeature ? RouteUrls.Receive : RouteUrls.ReceiveStx)}
      label="Receive"
      buttonComponent={PrimaryButton}
      {...props}
    />
  );
}
