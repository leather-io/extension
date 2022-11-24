import { Button } from '@stacks/ui';
import { FundPageSelectors } from '@tests-legacy/page-objects/fund.selectors';

interface SkipFundAccountButton {
  onSkipFundAccount(): void;
}
export function SkipFundAccountButton({ onSkipFundAccount }: SkipFundAccountButton) {
  return (
    <Button
      _focus={{ boxShadow: 'none' }}
      _hover={{ boxShadow: 'none' }}
      borderColor="#DCDDE2"
      borderRadius="10px"
      boxShadow="none"
      data-testid={FundPageSelectors.BtnSkipFundAccount}
      height="32px"
      onClick={onSkipFundAccount}
      mode="tertiary"
      type="button"
    >
      Skip
    </Button>
  );
}
