import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { HStack, Stack, styled } from 'leather-styles/jsx';

import { Eye1ClosedIcon, KeyIcon, LockIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { Content, TwoColumnLayout } from '@app/components/layout';
import { OnboardingHeader } from '@app/features/container/headers/onboarding.header';
import { SecretKey } from '@app/features/secret-key-displayer/secret-key-displayer';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

export const BackUpSecretKeyPage = memo(() => {
  const secretKey = useDefaultWalletSecretKey();
  const navigate = useNavigate();

  useEffect(() => {
    if (!secretKey) navigate(RouteUrls.Onboarding);
  }, [navigate, secretKey]);

  if (!secretKey) return null;

  return (
    <>
      <OnboardingHeader />
      <Content>
        <TwoColumnLayout
          title="Back up your Secret Key"
          content={
            <>
              You'll need it to access your wallet on a new device, or this one if you lose your
              password — so back it up somewhere safe!
            </>
          }
          action={
            <Stack gap="space.05" mt="space.04">
              <HStack alignItems="center">
                <KeyIcon />
                <styled.span textStyle="caption.01">
                  Your Secret Key gives <br /> access to your wallet
                </styled.span>
              </HStack>
              <HStack alignItems="center">
                <Eye1ClosedIcon />
                <styled.span textStyle="caption.01">
                  Never share your <br /> Secret Key with anyone
                </styled.span>
              </HStack>
              <HStack alignItems="center">
                <LockIcon />
                <styled.span textStyle="caption.01">
                  Store it somewhere <br /> 100% private and secure
                </styled.span>
              </HStack>
            </Stack>
          }
        >
          <SecretKey secretKey={secretKey} />
        </TwoColumnLayout>
      </Content>
    </>
  );
});
