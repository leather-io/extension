import { Button, Stack } from '@stacks/ui';

import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import ExploreStacksLarge from '@assets/images/explore-stacks-lg.svg';
import ExploreStacksSmall from '@assets/images/explore-stacks-sm.svg';
import { InitialPageSelectors } from '@tests/integration/initial-page.selectors';
import { getViewMode } from '@app/common/utils';

interface WelcomeLayoutProps {
  isGeneratingWallet: boolean;
  onStartOnboarding(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout(props: WelcomeLayoutProps): JSX.Element {
  const { isGeneratingWallet, onStartOnboarding, onRestoreWallet } = props;
  const mode = getViewMode();

  return (
    <Stack className="welcome-page" isInline={mode === 'full'} width="100%">
      <Stack className="content-image" flexGrow={1}>
        <img src={ExploreStacksLarge} className="image-large" />
        <img src={ExploreStacksSmall} className="image-small" />
      </Stack>
      <Stack className="content-text" flexGrow={1} justifyContent="center">
        <Stack width="100%" textAlign="left" alignItems="start">
          <Title className="title" fontWeight={500}>
            Explore the world of Stacks
          </Title>
          <Text className="text">
            Hiro Wallet connects you to Stacks apps while keeping your account, data, and crypto
            secure. Create your Stacks account to get started.
          </Text>
        </Stack>
        <Stack spacing="loose" textAlign="left" {...props}>
          <Button
            borderRadius="10px"
            data-testid={InitialPageSelectors.SignUp}
            height="48px"
            isLoading={isGeneratingWallet}
            onClick={onStartOnboarding}
            width="198px"
          >
            Create Stacks Account
          </Button>
          <Link data-testid={InitialPageSelectors.SignIn} fontSize="14px" onClick={onRestoreWallet}>
            I already have an account
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
}
