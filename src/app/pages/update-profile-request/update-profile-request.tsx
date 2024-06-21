import { memo } from 'react';

import { isUndefined } from '@leather.io/utils';

import { closeWindow } from '@shared/utils';

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
  const { requestToken } = useProfileUpdateRequestSearchParams();

  useOnOriginTabClose(() => closeWindow());
  if (isUndefined(validProfileUpdateRequest) || !validProfileUpdateRequest || !requestToken)
    return (
      <ProfileUpdateRequestLayout>
        <ErrorMessage
          errorMessage={`Invalid profile update request${
            !validProfileUpdateRequest && ' (Profile must follow Person schema).'
          }`}
        />
      </ProfileUpdateRequestLayout>
    );

  return (
    <ProfileUpdateRequestLayout>
      <ProfileDataContent requestToken={requestToken} />
    </ProfileUpdateRequestLayout>
  );
}

export const ProfileUpdateRequest = memo(ProfileUpdateRequestBase);
