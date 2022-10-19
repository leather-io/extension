import { useNavigate } from 'react-router-dom';
import { ButtonProps } from '@stacks/ui';

import { QrCodeIcon } from '@app/components/qr-code-icon';
import { RouteUrls } from '@shared/route-urls';
import { PrimaryButton } from '@app/components/primary-button';

import { HomeActionButton } from './tx-button';

export const ReceiveButton = (props: ButtonProps) => {
  const navigate = useNavigate();

  return (
    <HomeActionButton
      icon={QrCodeIcon}
      onClick={() => navigate(RouteUrls.Receive)}
      label="Receive"
      buttonComponent={PrimaryButton}
      {...props}
    />
  );
};
