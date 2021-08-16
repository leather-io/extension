import React, { FC } from 'react';
import { Header } from '@components/header';
import { Text, color } from '@stacks/ui';

interface ReceiveTokensHeaderProps {
  onClose(): void;
}
export const ReceiveTokensHeader: FC<ReceiveTokensHeaderProps> = ({ onClose }) => (
  <>
    <Header title="Receive" onClose={onClose} />
    <Text
      textStyle="body.small"
      color={color('text-caption')}
      px="loose"
      textAlign={['left', 'left', 'center']}
    >
      Share your account’s unique address to receive any token or collectible. Including a memo is
      not required.
    </Text>
  </>
);
