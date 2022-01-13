import { ButtonProps } from '@stacks/ui';

import { QrCodeIcon } from '@app/components/qr-code-icon';
import { RouteUrls } from '@shared/route-urls';

import { TxButton } from './tx-button';

export const ReceiveButton = (props: ButtonProps) => (
  <TxButton icon={QrCodeIcon} route={RouteUrls.Receive} type="Receive" {...props} />
);
