import { Box, Flex, Text, color, transition } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { figmaTheme } from '@app/common/utils/figma-theme';

interface FeesListItemProps {
  arrivesIn: string;
  feeAmount: string;
  feeFiatValue: string;
  feeRate: number;
  feeType: string;
  isSelected?: boolean;
  onClick: () => void;
}
export function FeesListItem({
  arrivesIn,
  feeAmount,
  feeFiatValue,
  feeRate,
  feeType,
  isSelected,
  ...props
}: FeesListItemProps) {
  return (
    <Box
      _hover={{ background: '#F9F9FA' }}
      as="button"
      border={isSelected ? '4px solid' : '1px solid'}
      borderColor={isSelected ? figmaTheme.borderFocused : color('border')}
      borderRadius="16px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04)"
      data-testid={SharedComponentsSelectors.FeesListItem}
      px="base"
      py="extra-loose"
      transition={transition}
      width="100%"
      {...props}
    >
      <Flex justifyContent="center" mb="base-tight" fontWeight={500}>
        <Text mr="tight">{feeType}</Text>
        <Text>{arrivesIn}</Text>
      </Flex>
      <Flex justifyContent="center" color={color('text-caption')}>
        <Text
          data-testid={SharedComponentsSelectors.FeesListItemFeeValue}
        >{`${feeFiatValue} | ${feeRate} sats/vB | ${feeAmount}`}</Text>
      </Flex>
    </Box>
  );
}
