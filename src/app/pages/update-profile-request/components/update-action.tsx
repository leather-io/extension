import { useCallback, useState } from 'react';
import { Button, Stack } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { delay } from '@app/common/utils';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { useUpdateProfileRequestSearchParams } from '@app/store/profiles/requests.hooks';
import { UpdateProfilePayload } from '@app/common/profiles/requests';
import { finalizeUpdateProfile } from '@shared/actions/finalize-profile-update';
import { PublicProfile } from '@shared/profiles/types';
import { createWalletGaiaConfig } from '@stacks/wallet-sdk';
import { getHubInfo } from '../wallet-sdk-clone/utils';
import { DEFAULT_PROFILE, fetchAccountProfileUrl, fetchProfileFromUrl, signAndUploadProfile } from '../wallet-sdk-clone/profiles';
import { createFetchFn } from '@stacks/network';
import { gaiaUrl } from '@shared/constants';
import { useWalletState } from '@app/store/wallet/wallet.hooks';



function useUpdateProfileSoftwareWallet() {
  const account = useCurrentAccount();
  const wallet = useWalletState();

  return useCallback(
    async (publicProfile: PublicProfile) => {
      const fetchFn = createFetchFn();

      if (!account || account.type === 'ledger' || !wallet) return null;

      const hubInfo = await getHubInfo(gaiaUrl, fetchFn);
      const profileUrl = await fetchAccountProfileUrl({ account, gaiaHubUrl: hubInfo.read_url_prefix });
      console.log({ profileUrl, accountAddress: account.address })
      const profile = (await fetchProfileFromUrl(profileUrl, fetchFn)) || DEFAULT_PROFILE;
      console.log({ profile })
      await signAndUploadProfile({
        profile: {
          ...profile, ...publicProfile,
        }, account, gaiaHubUrl: gaiaUrl
      })
      return true;

    },
    [account, wallet]
  );
}

export function UpdateAction(props: { updateProfilePayload: UpdateProfilePayload }): JSX.Element | null {
  const { updateProfilePayload } = props;
  const { profile: publicProfile } = updateProfilePayload

  const { tabId, requestToken } = useUpdateProfileRequestSearchParams();
  const updateProfileSofwareWallet = useUpdateProfileSoftwareWallet();
  const [isLoading, setIsLoading] = useState(false);
  const analytics = useAnalytics();

  if (!requestToken || !tabId) return null;

  const update = async () => {
    setIsLoading(true);
    void analytics.track('request_update_profile_submit');
    updateProfileSofwareWallet(publicProfile)
    // Since the signature is really fast, we add a delay to improve the UX
    await delay(1000);
    setIsLoading(false);
    //finalizeUpdateProfile({ requestPayload: requestToken, tabId, data: publicProfile });
  };

  const cancel = () => {
    void analytics.track('request_update_profile_cancel');
    finalizeUpdateProfile({ requestPayload: requestToken, tabId, data: 'cancel' });
  };

  return (
    <Stack isInline>
      <Button onClick={cancel} flexGrow={1} borderRadius="10px" mode="tertiary">
        Cancel
      </Button>
      <Button type="submit" flexGrow={1} borderRadius="10px" onClick={update} isLoading={isLoading}>
        Update
      </Button>
    </Stack>
  );
}
