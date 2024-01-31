import { HStack, Stack, styled } from 'leather-styles/jsx';

import { KeyIcon } from '@app/ui/icons';
import { EyeSlashIcon } from '@app/ui/icons/eye-slash-icon';
import { LockIcon } from '@app/ui/icons/lock-icon';

export function BackUpSecretKeyContent(): React.JSX.Element {
  return (
    <>
      <styled.h1
        textStyle={['heading.03', 'heading.03', 'heading.03', 'display.02']}
        mt="space.00"
        mb="space.06"
      >
        Back up your <br /> Secret Key
      </styled.h1>
      <styled.p textStyle={['label.01', 'heading.05']} mb="space.06">
        Here's your Secret Key: 24 words that give you access to your new wallet.
      </styled.p>
      <styled.p textStyle={['label.01', 'heading.05']} mb="space.06">
        You'll need it to access your wallet on a new device, or this one if you lose your password
        — so back it up somewhere safe!
      </styled.p>

      <Stack gap="space.03">
        <HStack alignItems="center" margin={['auto', 'auto', 'auto', 'unset']}>
          <KeyIcon />
          <styled.span textStyle="body.01">Your Secret Key gives access to your wallet</styled.span>
        </HStack>
        <HStack alignItems="center" margin={['auto', 'auto', 'auto', 'unset']}>
          <EyeSlashIcon />
          <styled.span textStyle="body.01">Never share your Secret Key with anyone</styled.span>
        </HStack>
        <HStack alignItems="center" margin={['auto', 'auto', 'auto', 'unset']} mb="space.05">
          <LockIcon />
          <styled.span textStyle="body.01">Store it somewhere 100% private and secure</styled.span>
        </HStack>
      </Stack>
    </>
  );
}
