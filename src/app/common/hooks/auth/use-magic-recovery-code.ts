import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decrypt } from '@stacks/wallet-sdk';

import { useLoading } from '@app/common/hooks/use-loading';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { RouteUrls } from '@shared/route-urls';
import {
  useMagicRecoveryCodePasswordState,
  useMagicRecoveryCodeState,
} from '@app/store/onboarding/onboarding.hooks';

export function useMagicRecoveryCode() {
  const [magicRecoveryCode, setMagicRecoveryCode] = useMagicRecoveryCodeState();
  const [magicRecoveryCodePassword, setMagicRecoveryCodePassword] =
    useMagicRecoveryCodePasswordState();
  const { isLoading, setIsLoading, setIsIdle } = useLoading('useMagicRecoveryCode');
  const { storeSeed, setPassword, finishSignIn } = useWallet();
  const [error, setPasswordError] = useState('');
  const { decodedAuthRequest } = useOnboardingState();
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    if (decodedAuthRequest) {
      setTimeout(() => {
        void finishSignIn(0);
      }, 1000);
    } else {
      navigate(RouteUrls.Home);
    }
  }, [navigate, decodedAuthRequest, finishSignIn]);

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
    (event: FormEvent<HTMLInputElement>) => {
      event.preventDefault();
      setMagicRecoveryCodePassword(event.currentTarget.value);
    },
    [setMagicRecoveryCodePassword]
  );

  const onBack = () => navigate(RouteUrls.SignIn);

  const onSubmit = useCallback(
    async (event: FormEvent) => {
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
    onBack,
    onSubmit,
    onChange,
  };
}
