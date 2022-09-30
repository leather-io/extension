import { useCallback, useState } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { ProfileUpdaterPayload } from '@app/common/profiles/requests';
import { delay } from '@app/common/utils';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { useProfileUpdaterRequestSearchParams } from '@app/store/profiles/requests.hooks';
import { useWalletState } from '@app/store/wallet/wallet.hooks';
import { finalizeProfileUpdate } from '@shared/actions/finalize-profile-update';
import { gaiaUrl } from '@shared/constants';
import { PublicProfile } from '@shared/profiles/types';
import { createFetchFn } from '@stacks/network';
import {
  DEFAULT_PROFILE,
  fetchAccountProfileUrl,
  fetchProfileFromUrl,
  signAndUploadProfile,
} from '@stacks/wallet-sdk';
import { UpdateActionLayout } from './update-action.layout';

function useUpdateProfileSoftwareWallet() {
  const account = useCurrentAccount();
  const wallet = useWalletState();

  return useCallback(
    async (publicProfile: PublicProfile) => {
      const fetchFn = createFetchFn();

      if (!account || account.type === 'ledger' || !wallet) return null;

      const response = await fetchFn(`${gaiaUrl}/hub_info`);
      const { read_url_prefix }: { read_url_prefix: string } = await response.json();
      const profileUrl = await fetchAccountProfileUrl({
        account,
        gaiaHubUrl: read_url_prefix,
      });
      console.log({ profileUrl, accountAddress: account.address });
      const profile = (await fetchProfileFromUrl(profileUrl, fetchFn)) || DEFAULT_PROFILE;
      console.log({ profile });
      await signAndUploadProfile({
        profile: {
          ...profile,
          ...publicProfile,
        },
        account,
        gaiaHubUrl: gaiaUrl,
      });
      return true;
    },
    [account, wallet]
  );
}

export function UpdateAction(props: {
  profileUpdaterPayload: ProfileUpdaterPayload;
}): JSX.Element | null {
  const { profileUpdaterPayload } = props;
  const { profile: publicProfile } = profileUpdaterPayload;

  const { tabId, requestToken } = useProfileUpdaterRequestSearchParams();
  const updateProfileSofwareWallet = useUpdateProfileSoftwareWallet();
  const [isLoading, setIsLoading] = useState(false);
  const analytics = useAnalytics();

  if (!requestToken || !tabId) return null;

  const onUpdateProfile = async () => {
    setIsLoading(true);
    void analytics.track('request_update_profile_submit');
    updateProfileSofwareWallet(publicProfile);
    // Since the signature is really fast, we add a delay to improve the UX
    await delay(1000);
    setIsLoading(false);
    finalizeProfileUpdate({ requestPayload: requestToken, tabId, data: publicProfile });
  };

  const onCancel = async () => {
    void analytics.track('request_update_profile_cancel');
    finalizeProfileUpdate({ requestPayload: requestToken, tabId, data: 'cancel' });
  };

  return (
    <UpdateActionLayout
      onUpdateProfile={onUpdateProfile}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
}
