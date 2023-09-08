// #4164 FIXME migrate useMediaQuery
import { useMediaQuery } from '@stacks/ui';
import { Box, Flex, Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { BackUpSecretKeyActions } from './components/back-up-secret-key-actions';

interface BackUpSecretKeyLayoutProps {
  secretKeyDisplay: React.JSX.Element;
  onBackedUpSecretKey(): void;
}
export function BackUpSecretKeyLayout(props: BackUpSecretKeyLayoutProps): React.JSX.Element {
  const { secretKeyDisplay, onBackedUpSecretKey } = props;

  const [desktopViewport] = useMediaQuery(`(min-width: ${token('sizes.desktopViewportMinWidth')})`);

  return (
    <Flex
      flexDirection={['column', 'column', 'column', 'row']}
      mt={['space.05', 'space.06']}
      pb="space.05"
      px={['space.05', 'space.05', 'space.11']}
      width="100%"
      gap={['space.03', 'space.09']}
    >
      <Flex alignItems="start" flexGrow={1} flex="1" justifyContent="center" mt={['base', 'unset']}>
        <Stack maxWidth={token('sizes.centeredPageFullWidth')} gap="space.06">
          <styled.h1 textStyle={['heading.03', 'display.02']}>Back up your Secret Key</styled.h1>
          <styled.p textStyle={['label.02', 'heading.05']}>
            Here's your Secret Key: 24 words that give you access to your new wallet.
          </styled.p>
          <styled.p textStyle={['label.02', 'heading.05']}>
            You'll need it to access your wallet on a new device, or this one if you lose your
            password — so back it up somewhere safe!
          </styled.p>

          {desktopViewport && (
            <Stack gap="space.03">
              <BackUpSecretKeyActions onBackedUpSecretKey={onBackedUpSecretKey} />
            </Stack>
          )}
        </Stack>
      </Flex>
      <Flex
        alignItems="start"
        flexGrow={1}
        flex="1"
        justifyContent="center"
        mt={['space.05', 'space.05', 'unset']}
      >
        <Box minWidth={['344px', '446px']}>{secretKeyDisplay}</Box>
      </Flex>
      {!desktopViewport && (
        <Stack mt="space.05" gap="space.03">
          <BackUpSecretKeyActions onBackedUpSecretKey={onBackedUpSecretKey} />
        </Stack>
      )}
    </Flex>
  );
}
