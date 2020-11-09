import React, { createRef, useState, useCallback } from 'react';
import { Box, Flex, Text, Button, Input } from '@blockstack/ui';
import { ConnectHeader } from '@pages/install/header';
import { useDispatch } from '@common/hooks/use-dispatch';
import { doSetMagicRecoveryCode } from '@store/onboarding/actions';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths, DEFAULT_PASSWORD } from '@store/onboarding/types';
import { doStoreSeed } from '@store/wallet';
import { SIGN_IN_CORRECT, SIGN_IN_INCORRECT } from '@common/track';
import { ErrorLabel } from '@components/error-label';

export const InstalledSignIn: React.FC = () => {
  const textAreaRef = createRef<HTMLTextAreaElement>();
  const [isLoading, setLoading] = useState(false);
  const [seed, setSeed] = useState('');
  const [seedError, setSeedError] = useState<null | string>(null);
  const dispatch = useDispatch();
  const { doChangeScreen, doTrack } = useAnalytics();

  const hasLineReturn = (input: string) => input.includes('\n');

  const onSubmit = useCallback(async () => {
    setLoading(true);
    const parsedKeyInput = seed.trim();
    try {
      if (parsedKeyInput.length === 0) {
        setSeedError('Entering your Secret Key is required.');
        setLoading(false);
        return;
      }
      if (parsedKeyInput.split(' ').length <= 1) {
        dispatch(doSetMagicRecoveryCode(parsedKeyInput));
        doChangeScreen(ScreenPaths.RECOVERY_CODE);
        return;
      }
      await doStoreSeed(parsedKeyInput, DEFAULT_PASSWORD)(dispatch, () => ({}), {});
      doTrack(SIGN_IN_CORRECT);
      doChangeScreen(ScreenPaths.INSTALLED);
    } catch (error) {
      setSeedError("The Secret Key you've entered is invalid");
      doTrack(SIGN_IN_INCORRECT);
    }
    setLoading(false);
  }, [seed, seedError]);

  return (
    <Flex wrap="wrap" py={5} px={4} flexDirection="column" minHeight="100vh">
      <ConnectHeader />
      <Flex flex={1} justifyContent={[null, 'center']}>
        <Flex flexDirection="column" pb="120px" align="center" justify="center" flexGrow={1}>
          <Box mt="base">
            <Text fontSize="32px" lineHeight="48px" fontWeight="500">
              Continue with Secret Key
            </Text>
          </Box>
          <Box maxWidth={[null, '396px']} minWidth={[null, '396px']} textAlign="center" mt="base">
            <Text fontSize="base" color="ink.600">
              Enter your Secret Key to sign in to Connect.
            </Text>
            <Input
              autoFocus
              mt="base-loose"
              minHeight="68px"
              placeholder="12-word Secret Key"
              as="textarea"
              value={seed}
              fontSize={'16px'}
              autoCapitalize="off"
              spellCheck={false}
              style={{ resize: 'none' }}
              ref={textAreaRef}
              onChange={async (evt: React.FormEvent<HTMLInputElement>) => {
                setSeedError(null);
                setSeed(evt.currentTarget.value);
                if (hasLineReturn(evt.currentTarget.value)) {
                  textAreaRef.current?.blur();
                  await onSubmit();
                }
              }}
            />
            {seedError && (
              <ErrorLabel lineHeight="16px">
                <Text
                  textAlign="left"
                  textStyle="caption"
                  color="feedback.error"
                  data-test="sign-in-seed-error"
                >
                  {seedError}
                </Text>
              </ErrorLabel>
            )}
          </Box>
          <Box maxWidth={[null, '396px']} minWidth={[null, '396px']} mt="base-loose">
            <Button
              width="100%"
              isLoading={isLoading}
              isDisabled={isLoading}
              data-test="sign-in-key-continue"
              onClick={async event => {
                event.preventDefault();
                return onSubmit();
              }}
            >
              Sign in
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
