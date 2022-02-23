import { Flex } from '@stacks/ui';

import { Caption } from '@app/components/typography';
import NoFunds from '@assets/images/no-funds.png';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';
import { SecondaryButton } from '@app/components/secondary-button';

interface NoAssetProps {
  onFundAccount(): void;
}
export function NoAssets({ onFundAccount }: NoAssetProps) {
  return (
    <Flex alignItems="center" flexDirection="column" justifyContent="center" py="extra-loose">
      <img src={NoFunds} />
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
