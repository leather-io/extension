/* eslint-disable no-console */
import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { Header } from '@app/components/header';
import { RouteUrls } from '@shared/route-urls';
import { WelcomeLayout } from './welcome.layout';
import { useHasAllowedDiagnostics } from '@app/store/onboarding/onboarding.hooks';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

import {
  connectLedger,
  pullKeysFromLedgerDevice,
  useTriggerLedgerDeviceOnboarding,
} from '@app/features/ledger/ledger-utils';

export const WelcomePage = memo(() => {
  const [hasAllowedDiagnostics] = useHasAllowedDiagnostics();
  const navigate = useNavigate();
  const { decodedAuthRequest } = useOnboardingState();
  const analytics = useAnalytics();
  const keyActions = useKeyActions();
  const currentInMemoryKey = useDefaultWalletSecretKey();

  const { completeLedgerDeviceOnboarding, fireErrorMessageToast } =
    useTriggerLedgerDeviceOnboarding();

  useRouteHeader(<Header hideActions />);

  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);

  const startOnboarding = useCallback(async () => {
    setIsGeneratingWallet(true);
    keyActions.generateWalletKey();
    void analytics.track('generate_new_secret_key');
    if (decodedAuthRequest) {
      navigate(RouteUrls.SetPassword);
    }
    navigate(RouteUrls.BackUpSecretKey);
  }, [keyActions, analytics, decodedAuthRequest, navigate]);

  useEffect(() => {
    if (hasAllowedDiagnostics === undefined) navigate(RouteUrls.RequestDiagnostics);
    if (currentInMemoryKey) navigate(RouteUrls.BackUpSecretKey);

    return () => setIsGeneratingWallet(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WelcomeLayout
      isGeneratingWallet={isGeneratingWallet}
      onSelectConnectLedger={() => navigate(RouteUrls.ConnectLedger)}
      onStartOnboarding={() => startOnboarding()}
      onRestoreWallet={() => navigate(RouteUrls.SignIn)}
      onSelectConnectLedger={async () => {
        console.log('lskdjfslkd');
        const stacks = await connectLedger();
        const resp = await pullKeysFromLedgerDevice(stacks);
        if (resp.status === 'failure') {
          console.log(resp);
          return fireErrorMessageToast(resp.errorMessage);
        }
        completeLedgerDeviceOnboarding(resp.publicKeys);
      }}
    />
  );
});
