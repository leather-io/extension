import { memo } from 'react';

import { Box, CircleProps } from 'leather-styles/jsx';

import { DynamicColorCircle } from '@app/ui/components/dynamic-color-circle';

const getAccountNumber = (index: number) => {
  // Always return account number in the Account Circle
  return String(index + 1);
};

interface AccountAvatarProps extends CircleProps {
  name: string;
  publicKey: string;
  index: number;
}
export const AccountAvatar = memo(({ name, publicKey, index, ...props }: AccountAvatarProps) => {
  const gradient = publicKey + index.toString();
  const text = getAccountNumber(index);

  return (
    <DynamicColorCircle sizeParam="48" value={gradient} {...props}>
      <Box position="absolute">{text}</Box>
    </DynamicColorCircle>
  );
});
