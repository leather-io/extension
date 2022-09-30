import { memo } from 'react';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { isUndefined } from '@shared/utils';

import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import {
  useIsProfileUpdaterRequestValid,
  useProfileUpdaterRequestSearchParams,
} from '@app/store/profiles/requests.hooks';
import { ProfileDataContent } from './components/profile-data-content';
import { ErrorMessage } from './components/update-profile-error-msg';
import { ProfileUpdaterRequestLayout } from './components/update-profile-request.layout';

function ProfileUpdaterRequestBase() {
  const validProfileUpdaterRequest = useIsProfileUpdaterRequestValid();
  let { requestToken } = useProfileUpdaterRequestSearchParams();

  useRouteHeader(<PopupHeader />);

  useOnOriginTabClose(() => window.close());

  if (isUndefined(validProfileUpdaterRequest) || !requestToken)
    return (
      <ProfileUpdaterRequestLayout>
        <ErrorMessage errorMessage="Invalid profile update request" />
      </ProfileUpdaterRequestLayout>
    );

  return (
    <ProfileUpdaterRequestLayout>
      <ProfileDataContent requestToken={requestToken} />
    </ProfileUpdaterRequestLayout>
  );
}

export const ProfileUpdaterRequest = memo(ProfileUpdaterRequestBase);
