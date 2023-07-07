import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { validateMnemonic } from 'bip39';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useLoading } from '@app/common/hooks/use-loading';
import {
  delay,
  extractPhraseFromPasteEvent,
  validateAndCleanRecoveryInput,
} from '@app/common/utils';
import { useAppDispatch } from '@app/store';
import { inMemoryKeyActions } from '@app/store/in-memory-key/in-memory-key.actions';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';
import { useSeedInputErrorState } from '@app/store/onboarding/onboarding.hooks';

async function simulateShortDelayToAvoidImmediateNavigation() {
  await delay(600);
}

export function useSignIn() {
  const [error, setError] = useSeedInputErrorState();
  const [isKeyMasked, setIsKeyMasked] = useState(true);

  const { isLoading, setIsLoading, setIsIdle } = useLoading('useSignIn');
  const navigate = useNavigate();
  const analytics = useAnalytics();

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const dispatch = useAppDispatch();

  const handleSetError = useCallback(
    (
      message = 'Incorrect Secret Key. Make sure it is 12 or 24 words with spaces between words.'
    ) => {
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
          toast.success('Magic recovery code detected');
          await simulateShortDelayToAvoidImmediateNavigation();
          dispatch(onboardingActions.hideSuggestedFirstSteps(true));
          navigate({
            pathname: RouteUrls.MagicRecoveryCode,
            search: `?magicRecoveryCode=${parsedKeyInput}`,
          });
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

      dispatch(inMemoryKeyActions.saveUsersSecretKeyToBeRestored(parsedKeyInput));
      dispatch(onboardingActions.hideSuggestedFirstSteps(true));
      void analytics.track('submit_valid_secret_key');
      navigate(RouteUrls.SetPassword);
      setIsIdle();
    },
    [setIsLoading, dispatch, analytics, navigate, setIsIdle, handleSetError]
  );

  const onPaste = useCallback(
    async (event: React.ClipboardEvent) => {
      const value = extractPhraseFromPasteEvent(event);
      await submitMnemonicForm(value);
    },
    [submitMnemonicForm]
  );

  const toggleKeyMask = useCallback(() => {
    setIsKeyMasked(prev => !prev);
  }, []);

  useEffect(
    () => () => {
      setError(undefined);
      setIsIdle();
    },
    // setIsIdle update change not desired
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setError]
  );

  return {
    onPaste,
    submitMnemonicForm,
    ref: textAreaRef,
    error,
    isLoading,
    toggleKeyMask,
    isKeyMasked,
  };
}
