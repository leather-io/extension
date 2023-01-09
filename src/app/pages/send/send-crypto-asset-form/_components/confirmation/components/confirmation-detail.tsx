import { ReactNode } from 'react';

import { Text } from '@stacks/ui';

import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';

interface ConfirmationDetailProps {
  detail: string;
  value: ReactNode;
}
export function ConfirmationDetail({ detail, value }: ConfirmationDetailProps) {
  return (
    <SpaceBetween>
      <Caption>{detail}</Caption>
      <Text>{value}</Text>
    </SpaceBetween>
  );
}
