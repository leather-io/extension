import { Box, Flex, Text, color, transition } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

interface FeesCardProps {
  feeType: string;
  feeAmount: string;
  feeFiatValue: string;
  arrivesIn: string;
  onClick: () => void;
}
export function FeesCard({ feeType, feeAmount, feeFiatValue, arrivesIn, ...props }: FeesCardProps) {
  return (
    <Box
      as="button"
      border="1px solid"
      borderColor={color('border')}
      borderRadius="16px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04)"
      transition={transition}
      padding="extra-loose"
      width="100%"
      _hover={{ background: '#F9F9FA' }}
      data-testid={SharedComponentsSelectors.FeeCard}
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
