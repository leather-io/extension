import React, { cloneElement, FC, isValidElement } from 'react';
import { Box, BoxProps, color, Flex, FlexProps, Stack, StackProps, Text } from '@stacks/ui';

export const TxInfoList: FC<FlexProps> = props => <Flex flexDirection="column" {...props} />;

export const TxInfoListGroup: FC<BoxProps> = ({ children, ...props }) => {
  const parsedChildren = Array.isArray(children) ? children : [children];
  const infoGroup = parsedChildren.flatMap((child, index) => {
    if (!isValidElement(child)) return null;
    return [
      cloneElement(child, {
        key: index,
        mb: index === parsedChildren.length ? '280px' : null,
      }),
      index !== parsedChildren.length - 1 && <Box my="loose" key={index.toString() + '-hr'} />,
    ];
  });
  return <Box {...props}>{infoGroup}</Box>;
};

export const TxInfoListSection: FC<StackProps> = ({ children, ...props }) => (
  <Stack {...props} spacing="base-tight">
    {children}
  </Stack>
);

export const TxInfoListRow: FC<FlexProps> = props => (
  <Flex justifyContent="space-between" {...props} />
);

export const TxInfoListLabel: FC<FlexProps> = ({ children, ...props }) => (
  <Flex color={color('text-caption')} alignItems="center" {...props}>
    <Box>{children}</Box>
  </Flex>
);

export const TxInfoListValue: FC<FlexProps> = props => (
  <Text textStyle="body.large.medium" textAlign="right" {...props} />
);
