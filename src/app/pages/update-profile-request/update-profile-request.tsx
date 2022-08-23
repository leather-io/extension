import { memo } from 'react';

import { isUndefined } from '@shared/utils';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';

import { ErrorMessage } from './components/update-profile-error-msg';
import { ProfileDataContent } from './components/profile-data-content';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useIsUpdateProfileRequestValid, useSetAtomUpdateProfileRequestToken, useUpdateProfileRequestSearchParams } from '@app/store/profiles/requests.hooks';
import { UpdateProfileRequestLayout } from './components/update-profile-request.layout';

function UpdateProfileRequestBase() {
  const validUpdateProfileRequest = useIsUpdateProfileRequestValid();
  let { requestToken } = useUpdateProfileRequestSearchParams();

  useRouteHeader(<PopupHeader />);

  useOnOriginTabClose(() => window.close());

  // Temporary workaround to avoid pattern of pulling search params directly
  // into an atom, rather than using the tooling provided by our router library
  useSetAtomUpdateProfileRequestToken(requestToken);

  if (isUndefined(validUpdateProfileRequest) || !requestToken)
    return (
      <UpdateProfileRequestLayout>
        <ErrorMessage errorMessage="Invalid profile update request" />
      </UpdateProfileRequestLayout>
    );

  return (
    <UpdateProfileRequestLayout>
      <ProfileDataContent
        requestToken={requestToken}
      />
    </UpdateProfileRequestLayout>
  );
}

export const UpdateProfileRequest = memo(UpdateProfileRequestBase);
