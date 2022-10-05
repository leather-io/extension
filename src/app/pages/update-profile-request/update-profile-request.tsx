import { memo } from 'react';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { isUndefined } from '@shared/utils';

import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import {
  useIsProfileUpdateRequestValid,
  useProfileUpdateRequestSearchParams,
} from '@app/store/profiles/requests.hooks';
import { ProfileDataContent } from './components/profile-data-content';
import { ErrorMessage } from './components/update-profile-error-msg';
import { ProfileUpdateRequestLayout } from './components/update-profile-request.layout';

function ProfileUpdateRequestBase() {
  const validProfileUpdateRequest = useIsProfileUpdateRequestValid();
  let { requestToken } = useProfileUpdateRequestSearchParams();

  useRouteHeader(<PopupHeader />);

  useOnOriginTabClose(() => window.close());

  if (isUndefined(validProfileUpdateRequest) || !requestToken)
    return (
      <ProfileUpdateRequestLayout>
        <ErrorMessage errorMessage="Invalid profile update request" />
      </ProfileUpdateRequestLayout>
    );

  return (
    <ProfileUpdateRequestLayout>
      <ProfileDataContent requestToken={requestToken} />
    </ProfileUpdateRequestLayout>
  );
}

export const ProfileUpdateRequest = memo(ProfileUpdateRequestBase);
