import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';

import { SignOutDialog } from './sign-out';

interface SignOutProps {
  onClose(): void;
}

export function SignOut({ onClose }: SignOutProps) {
  const analytics = useAnalytics();

  useEffect(() => void analytics.track('sign-out'), [analytics]);
  const { signOut } = useKeyActions();
  const navigate = useNavigate();

  return (
    <SignOutDialog
      isShowing
      onUserDeleteWallet={() => {
        void signOut().finally(() => {
          navigate(RouteUrls.Onboarding);
        });
      }}
      onClose={onClose}
    />
  );
}
