import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

// TODO replace transistion with Easings token
//  https://panda-css.com/docs/theming/tokens
// transistion taken from stacksui
const transition = 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)';

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
      _hover={{ background: '#F9F9FA' }}
      border={isSelected ? '4px solid' : '1px solid'}
      borderColor={token('colors.accent.action-primary-default')}
      borderRadius="16px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04)"
      data-testid={SharedComponentsSelectors.FeesListItem}
      px="space.04"
      py="space.06"
      transition={transition}
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
