import React from 'react';
import { Flex, Text, Box, BoxProps, DynamicColorCircle } from '@stacks/ui';

interface AssetRowProps extends BoxProps {
  name: string;
  friendlyName: string;
  value: string;
  subtitle: string;
}
export const AssetRow: React.FC<AssetRowProps> = ({
  name,
  friendlyName,
  value,
  subtitle,
  ...props
}) => {
  return (
    <Box width="100%" mb="base" {...props}>
      <Flex flexWrap="wrap" flexDirection="row" cursor="pointer">
        <Box width="32px" py="tight" mr="base">
          <DynamicColorCircle mr="tight" size="32px" string={name}>
            {friendlyName[0]}
          </DynamicColorCircle>
        </Box>
        <Box flexGrow={1}>
          <Text display="block" fontWeight="500">
            {friendlyName}
          </Text>
          <Text fontSize={1}>{subtitle}</Text>
        </Box>
        <Box textAlign="right" pt="tight">
          <Text fontWeight="500">{value}</Text>
        </Box>
      </Flex>
    </Box>
  );
};
