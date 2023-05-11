import { Box, Flex, Text, color, transition } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { figmaTheme } from '@app/common/utils/figma-theme';

interface FeesCardProps {
  arrivesIn: string;
  feeAmount: string;
  feeFiatValue: string;
  feeType: string;
  isSelected?: boolean;
  onClick: () => void;
}
export function FeesCard({
  arrivesIn,
  feeAmount,
  feeFiatValue,
  feeType,
  isSelected,
  ...props
}: FeesCardProps) {
  return (
    <Box
      _hover={{ background: '#F9F9FA' }}
      as="button"
      border={isSelected ? '4px solid' : '1px solid'}
      borderColor={isSelected ? figmaTheme.borderFocused : color('border')}
      borderRadius="16px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04)"
      data-testid={SharedComponentsSelectors.FeeCard}
      padding="extra-loose"
      transition={transition}
      width="100%"
      {...props}
    >
      <Flex justifyContent="space-between" mb="tight" fontWeight={500}>
        <Text>{feeType}</Text>
        <Text data-testid={SharedComponentsSelectors.FeeCardFeeValue}>{feeAmount}</Text>
      </Flex>
      <Flex justifyContent="space-between" color="#74777D">
        <Text>{arrivesIn}</Text>
        <Text>{feeFiatValue}</Text>
      </Flex>
    </Box>
  );
}
