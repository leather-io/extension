import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';

import { SignOutDialog } from './sign-out';

interface SignOutProps {
  isShowing: boolean;
  onClose(): void;
}

export function SignOut({ isShowing = false, onClose }: SignOutProps) {
  const analytics = useAnalytics();

  useEffect(() => void analytics.track('sign-out'), [analytics]);
  const { signOut } = useKeyActions();
  const navigate = useNavigate();
  // #4370 SMELL without this early return the wallet crashes on new install with
  // : Wallet is neither of type `ledger` nor `software`
  if (!isShowing) return null;
  return (
    <SignOutDialog
      isShowing={isShowing}
      onUserDeleteWallet={() => {
        void signOut().finally(() => {
          navigate(RouteUrls.Onboarding);
        });
      }}
      onClose={onClose}
    />
  );
}
