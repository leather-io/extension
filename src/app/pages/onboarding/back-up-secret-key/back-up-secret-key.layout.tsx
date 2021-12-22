import { Button, Stack } from '@stacks/ui';

import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { getViewMode } from '@app/common/utils';

interface BackUpSecretKeyLayoutProps {}
export function BackUpSecretKeyLayout(props: BackUpSecretKeyLayoutProps): JSX.Element {
  const mode = getViewMode();

  return (
    <>Placeholder</>
    // <Stack className="welcome-page" isInline={mode === 'full'} width="100%">
    //   <Stack className="content-image" flexGrow={1}>
    //     <img src={ExploreStacksLarge} className="image-large" />
    //     <img src={ExploreStacksSmall} className="image-small" />
    //   </Stack>
    //   <Stack className="content-text" flexGrow={1} justifyContent="center">
    //     <Stack width="100%" textAlign="left" alignItems="start">
    //       <Title className="title" fontWeight={500}>
    //         Explore the world of Stacks
    //       </Title>
    //       <Text className="text">
    //         Hiro Wallet connects you to Stacks apps while keeping your account, data, and crypto
    //         secure. Create your Stacks account to get started.
    //       </Text>
    //     </Stack>
    //     <Stack spacing="loose" textAlign="left" {...props}>
    //       <Button
    //         borderRadius="10px"
    //         data-testid={InitialPageSelectors.SignUp}
    //         height="48px"
    //         isLoading={isGeneratingWallet}
    //         onClick={onStartOnboarding}
    //         width="198px"
    //       >
    //         Create Stacks Account
    //       </Button>
    //       <Link data-testid={InitialPageSelectors.SignIn} fontSize="14px" onClick={onRestoreWallet}>
    //         I already have an account
    //       </Link>
    //     </Stack>
    //   </Stack>
    // </Stack>
  );
}
