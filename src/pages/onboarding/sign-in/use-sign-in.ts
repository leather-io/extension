import { useCallback, useEffect, useRef } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { useWallet } from '@common/hooks/use-wallet';
import {
  extractPhraseFromPasteEvent,
  validateAndCleanRecoveryInput,
  hasLineReturn,
} from '@common/utils';
import { RouteUrls } from '@routes/route-urls';
import { useLoading } from '@common/hooks/use-loading';
import {
  useMagicRecoveryCodeState,
  useSeedInputErrorState,
  useSeedInputState,
} from '@store/onboarding/onboarding.hooks';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';

export function useSignIn() {
  const [, setMagicRecoveryCode] = useMagicRecoveryCodeState();
  const [seed, setSeed] = useSeedInputState();
  const [error, setError] = useSeedInputErrorState();

  const { isLoading, setIsLoading, setIsIdle } = useLoading('useSignIn');
  const navigate = useNavigate();
  const { storeSeed } = useWallet();
  const analytics = useAnalytics();

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSetError = useCallback(
    (message = "The Secret Key you've entered is invalid") => {
      setError(message);
      setIsIdle();
      textAreaRef.current?.focus();
      void analytics.track('submit_invalid_secret_key');
      return;
    },
    [analytics, setError, setIsIdle]
  );

  const handleSubmit = useCallback(
    async (passedValue?: string) => {
      textAreaRef.current?.blur();
      setIsLoading();
      const parsedKeyInput = passedValue || seed.trim();

      // empty?
      if (parsedKeyInput.length === 0) {
        handleSetError('Entering your Secret Key is required.');
      }

      // recovery key?
      if (parsedKeyInput.split(' ').length <= 1) {
        const result = validateAndCleanRecoveryInput(parsedKeyInput);
        if (result.isValid) {
          setMagicRecoveryCode(parsedKeyInput);
          navigate(RouteUrls.RecoveryCode);
          return;
        } else {
          // single word and not a valid recovery key
          handleSetError();
        }
      }

      try {
        await storeSeed({ secretKey: parsedKeyInput });
        void analytics.track('submit_valid_secret_key');
        navigate(RouteUrls.SetPassword);
        setIsIdle();
      } catch (error) {
        handleSetError();
      }
    },
    [
      setIsLoading,
      seed,
      handleSetError,
      setMagicRecoveryCode,
      navigate,
      storeSeed,
      analytics,
      setIsIdle,
    ]
  );
  const handleSetSeed = useCallback(
    async (value: string, trim?: boolean) => {
      const trimmed = trim ? value.trim() : value;
      const isEmpty = JSON.stringify(trimmed) === '' || trimmed === '' || !trimmed;
      if (trimmed === seed) return;
      if (isEmpty) {
        setSeed('');
        error && setError(undefined);
        return;
      }
      error && setError(undefined);
      setSeed(trimmed || '');
      if (hasLineReturn(trimmed)) {
        textAreaRef.current?.blur();
        await handleSubmit(trimmed);
      }
    },
    [error, seed, textAreaRef, handleSubmit, setSeed, setError]
  );

  const onChange = useCallback(
    async (event: React.FormEvent<HTMLInputElement>) => {
      await handleSetSeed(event.currentTarget.value);
    },
    [handleSetSeed]
  );

  const onPaste = useCallback(
    async (event: React.ClipboardEvent) => {
      const value = extractPhraseFromPasteEvent(event);
      await handleSetSeed(value, true);
      await handleSubmit(value);
    },
    [handleSetSeed, handleSubmit]
  );

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      return handleSubmit();
    },
    [handleSubmit]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        void handleSubmit();
      }
    },
    [handleSubmit]
  );

  useEffect(() => {
    return () => {
      setError(undefined);
      setSeed('');
    };
  }, [setError, setSeed]);

  return {
    onChange,
    onPaste,
    onSubmit,
    onKeyDown,
    ref: textAreaRef,
    value: seed,
    error,
    isLoading,
  };
}
