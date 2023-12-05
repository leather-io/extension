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

  //  TODO 4370 check if this is enough to track views of previous sign-out route
  useEffect(() => void analytics.track('sign-out'), [analytics]);
  const { signOut } = useKeyActions();
  const navigate = useNavigate();
  // FIXME same bug as SwitchAcccount dialog where we call hooks from useWalletType when no wallet yet set
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
