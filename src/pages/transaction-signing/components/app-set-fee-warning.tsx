import React, { FC } from 'react';
import { Flex, Box, color, Text } from '@stacks/ui';
import { FiInfo } from 'react-icons/fi';
import { microStxToStx } from '@stacks/ui-utils';

interface AppSetFeeWarningProps {
  uStxFee: number | string;
}
export const AppSetFeeWarning: FC<AppSetFeeWarningProps> = ({ uStxFee }) => {
  return (
    <Box background={color('bg-alt')} py="base" px="base-loose" borderRadius="10px">
      <Flex>
        <Box mr="base-tight" mt="2px">
          <FiInfo color={color('accent')} />
        </Box>
        <Box>
          <Text textStyle="body.small.medium">App has set fee of {microStxToStx(uStxFee)} STX</Text>
          <Text
            textStyle="body.small"
            color={color('text-caption')}
            lineHeight="22px"
            mt="extra-tight"
          >
            Stacks app developers can set a fee to be used when broadcasting this transaction. This
            is sometimes needed when calling a particularly expensive contract.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
