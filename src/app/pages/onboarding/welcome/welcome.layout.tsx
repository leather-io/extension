import { css, cx } from '@emotion/css';
import { Button, Stack } from '@stacks/ui';

import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import WelcomeStacksFull from '@assets/images/onboarding/welcome-full.svg';
import WelcomeStacksPopup from '@assets/images/onboarding/welcome-popup.svg';
import { InitialPageSelectors } from '@tests/integration/initial-page.selectors';
import { getViewMode } from '@app/common/utils';

import {
  fullPageContentImage,
  fullPageContentText,
  fullPageTitle,
  popupTitle,
} from './welcome.styles';
interface WelcomeLayoutProps {
  isGeneratingWallet: boolean;
  onStartOnboarding(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout(props: WelcomeLayoutProps): JSX.Element {
  const { isGeneratingWallet, onStartOnboarding, onRestoreWallet } = props;
  const mode = getViewMode();
  const isFullPage = mode === 'full';
  const isPopup = mode === 'popup';

  return (
    <Stack isInline={isFullPage} width="100%">
      <Stack className={cx({ [fullPageContentImage]: isFullPage })} flexGrow={1}>
        {isFullPage ? <img src={WelcomeStacksFull} /> : <img src={WelcomeStacksPopup} />}
      </Stack>
      <Stack
        className={cx({ [fullPageContentText]: isFullPage })}
        flexGrow={1}
        justifyContent="center"
      >
        <Stack width="100%" textAlign="left" alignItems="start">
          <Title
            className={cx({ [fullPageTitle]: isFullPage }, { [popupTitle]: isPopup })}
            fontWeight={500}
          >
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
