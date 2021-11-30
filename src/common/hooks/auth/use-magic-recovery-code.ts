import { useLoading } from '@common/hooks/use-loading';
import { useWallet } from '@common/hooks/use-wallet';
import React, { useCallback, useEffect, useState } from 'react';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { RouteUrls } from '@routes/route-urls';
import { decrypt } from '@stacks/wallet-sdk';
import {
  useMagicRecoveryCodePasswordState,
  useMagicRecoveryCodeState,
} from '@store/onboarding/onboarding.hooks';

export function useMagicRecoveryCode() {
  const [magicRecoveryCode, setMagicRecoveryCode] = useMagicRecoveryCodeState();
  const [magicRecoveryCodePassword, setMagicRecoveryCodePassword] =
    useMagicRecoveryCodePasswordState();
  const { isLoading, setIsLoading, setIsIdle } = useLoading('useMagicRecoveryCode');
  const { storeSeed, setPassword, finishSignIn } = useWallet();
  const [error, setPasswordError] = useState('');
  const { decodedAuthRequest } = useOnboardingState();
  const changeScreen = useChangeScreen();

  const handleNavigate = useCallback(() => {
    if (decodedAuthRequest) {
      setTimeout(() => {
        void finishSignIn(0);
      }, 1000);
    } else {
      changeScreen(RouteUrls.Home);
    }
  }, [changeScreen, decodedAuthRequest, finishSignIn]);

  const handleSubmit = useCallback(async () => {
    if (!magicRecoveryCode) throw Error('No magic recovery seed');
    setIsLoading();
    try {
      const codeBuffer = Buffer.from(magicRecoveryCode, 'base64');
      const secretKey = await decrypt(codeBuffer, magicRecoveryCodePassword);
      await storeSeed({ secretKey });
      await setPassword(magicRecoveryCodePassword);
      handleNavigate();
    } catch (error) {
      setPasswordError(`Incorrect password, try again.`);
      setIsIdle();
    }
  }, [
    setPassword,
    setIsIdle,
    setIsLoading,
    magicRecoveryCode,
    magicRecoveryCodePassword,
    storeSeed,
    handleNavigate,
  ]);

  const onChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      event.preventDefault();
      setMagicRecoveryCodePassword(event.currentTarget.value);
    },
    [setMagicRecoveryCodePassword]
  );

  const handleBack = () => changeScreen(RouteUrls.SignIn);

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      await handleSubmit();
    },
    [handleSubmit]
  );

  useEffect(() => {
    return () => {
      setMagicRecoveryCode('');
      setMagicRecoveryCodePassword('');
    };
  }, [setMagicRecoveryCode, setMagicRecoveryCodePassword]);

  return {
    error,
    isLoading,
    magicRecoveryCodePassword,
    onBack: handleBack,
    onSubmit,
    onChange,
  };
}
