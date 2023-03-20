import { ReactNode } from 'react';

import { StackProps, Text } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { SpaceBetween } from '@app/components/layout/space-between';
import { Caption } from '@app/components/typography';

interface ConfirmationDetailProps extends StackProps {
  detail: string;
  value: ReactNode;
}
export function ConfirmationDetail({ detail, value, ...props }: ConfirmationDetailProps) {
  return (
    <SpaceBetween {...props}>
      <Caption>{detail}</Caption>
      <Text data-testid={SendCryptoAssetSelectors.ConfirmationDetailText}>{value}</Text>
    </SpaceBetween>
  );
}
