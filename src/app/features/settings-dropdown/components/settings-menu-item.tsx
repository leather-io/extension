import { memo } from 'react';

import { BoxProps, Text, color } from '@stacks/ui';

export const SettingsMenuItem = memo((props: BoxProps) => {
  const { onClick, children, ...rest } = props;
  return (
    <Text
      width="100%"
      px="base"
      py="base"
      cursor="pointer"
      color={color('text-title')}
      _hover={{ backgroundColor: color('bg-4') }}
      onClick={e => {
        onClick?.(e);
      }}
      fontSize={1}
      {...rest}
    >
      {children}
    </Text>
  );
});
