import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, styled } from 'leather-styles/jsx';

interface FeesListItemProps {
  arrivesIn: string;
  feeAmount: string;
  feeFiatValue: string;
  feeRate: number;
  feeType: string;
  isSelected?: boolean;
  onClick(): void;
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
    <styled.button
      _hover={{ background: 'ink.component-background-hover' }}
      border={isSelected ? 'focus' : 'default'}
      borderRadius="xs"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04)"
      data-testid={SharedComponentsSelectors.FeesListItem}
      px="space.04"
      py="space.06"
      transition="transition"
      type="button"
      width="100%"
      {...props}
    >
      <Flex justifyContent="center" mb="space.03">
        <styled.span textStyle="label.01" mr="space.02">
          {feeType}
        </styled.span>
        <styled.span textStyle="label.01">{arrivesIn}</styled.span>
      </Flex>
      <Flex justifyContent="center">
        <styled.span
          textStyle="caption.01"
          data-testid={SharedComponentsSelectors.FeesListItemFeeValue}
        >
          {`${feeFiatValue} | ${feeRate} sats/vB | ${feeAmount}`}
        </styled.span>
      </Flex>
    </styled.button>
  );
}
