import React from 'react';
import { Flex, Box, color, Text } from '@stacks/ui';
import { FiInfo } from 'react-icons/fi';
import { microStxToStx } from '@stacks/ui-utils';
import { useTransactionRequestCustomFee } from '@store/transactions/requests.hooks';
import { useFeeRateUseCustom } from '@store/transactions/fees.hooks';

export const AppSetFeeWarning = () => {
  const uStxFee = useTransactionRequestCustomFee();
  const [useCustom] = useFeeRateUseCustom();
  if (!uStxFee || useCustom) return null;

  return (
    <Box background={color('bg-alt')} py="base" px="base-loose" borderRadius="10px">
      <Flex>
        <Box mr="base-tight" mt="2px">
          <FiInfo color={color('accent')} />
        </Box>
        <Box>
          <Text textStyle="body.small.medium">
            App has set fee of {microStxToStx(uStxFee.toNumber())} STX
          </Text>
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
