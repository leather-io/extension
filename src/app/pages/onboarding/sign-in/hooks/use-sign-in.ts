import { useCallback, useEffect, useRef } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { validateMnemonic } from 'bip39';

import {
  extractPhraseFromPasteEvent,
  validateAndCleanRecoveryInput,
  delay,
} from '@app/common/utils';
import { RouteUrls } from '@shared/route-urls';
import { useLoading } from '@app/common/hooks/use-loading';
import {
  useMagicRecoveryCodeState,
  useSeedInputErrorState,
} from '@app/store/onboarding/onboarding.hooks';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useAppDispatch } from '@app/store';
import { keyActions } from '@app/store/keys/key.actions';
import toast from 'react-hot-toast';

async function simulateShortDelayToAvoidImmediateNavigation() {
  await delay(500);
}

export function useSignIn() {
  const [, setMagicRecoveryCode] = useMagicRecoveryCodeState();
  const [error, setError] = useSeedInputErrorState();

  const { isLoading, setIsLoading, setIsIdle } = useLoading('useSignIn');
  const navigate = useNavigate();
  const analytics = useAnalytics();

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const dispatch = useAppDispatch();

  const handleSetError = useCallback(
    (message = "The Secret Key you've entered is invalid") => {
      setError(message);
      setIsIdle();
      void analytics.track('submit_invalid_secret_key');
      return;
    },
    [analytics, setError, setIsIdle]
  );

  const submitMnemonicForm = useCallback(
    async (passedValue: string) => {
      setIsLoading();
      const parsedKeyInput = passedValue ? passedValue.trim() : '';

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

      if (!validateMnemonic(parsedKeyInput)) {
        handleSetError();
        return;
      }

      await simulateShortDelayToAvoidImmediateNavigation();
      toast.success('Secret Key valid');
      dispatch(keyActions.saveUsersSecretKeyToBeRestored(parsedKeyInput));
      void analytics.track('submit_valid_secret_key');
      navigate(RouteUrls.SetPassword);
      setIsIdle();
    },
    [setIsLoading, handleSetError, setMagicRecoveryCode, navigate, dispatch, analytics, setIsIdle]
  );

  const onPaste = useCallback(
    async (event: React.ClipboardEvent) => {
      const value = extractPhraseFromPasteEvent(event);
      await submitMnemonicForm(value);
    },
    [submitMnemonicForm]
  );

  useEffect(() => {
    return () => {
      setError(undefined);
    };
  }, [setError]);

  return { onPaste, submitMnemonicForm, ref: textAreaRef, error, isLoading };
}
