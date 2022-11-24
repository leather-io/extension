import NoFunds from '@assets/images/no-funds.png';
import { Flex, FlexProps } from '@stacks/ui';
import { OnboardingSelectors } from '@tests-legacy/integration/onboarding/onboarding.selectors';

import { SecondaryButton } from '@app/components/secondary-button';
import { Caption } from '@app/components/typography';

interface FundAccountProps extends FlexProps {
  onFundAccount(): void;
}
export function FundAccount({ onFundAccount, ...props }: FundAccountProps) {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      py="extra-loose"
      {...props}
    >
      <img src={NoFunds} width="88px" />
      <Caption maxWidth="248px" mt="extra-loose" textAlign="center">
        This is where you’ll see your balances. Get some STX to get started.
      </Caption>
      <SecondaryButton
        data-testid={OnboardingSelectors.NoAssetsFundAccountLink}
        height="36px"
        mt="base"
        onClick={onFundAccount}
      >
        Fund your account
      </SecondaryButton>
    </Flex>
  );
}
