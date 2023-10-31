import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, styled } from 'leather-styles/jsx';

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
    <styled.button
      _hover={{ background: 'accent.component-background-hover' }}
      border={isSelected ? '4px solid' : '1px solid'}
      borderColor="accent.action-primary-default"
      borderRadius="lg"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04)"
      data-testid={SharedComponentsSelectors.FeesListItem}
      px="base"
      py="extra-loose"
      transition="transition"
      width="100%"
      {...props}
    >
      <Flex justifyContent="center" mb="base-tight">
        <styled.span textStyle="label.01" mr="tight">
          {feeType}
        </styled.span>
        <styled.span textStyle="label.01">{arrivesIn}</styled.span>
      </Flex>
      <Flex justifyContent="center">
        <styled.span
          textStyle="caption.02"
          data-testid={SharedComponentsSelectors.FeesListItemFeeValue}
        >
          {`${feeFiatValue} | ${feeRate} sats/vB | ${feeAmount}`}
        </styled.span>
      </Flex>
    </styled.button>
  );
}
