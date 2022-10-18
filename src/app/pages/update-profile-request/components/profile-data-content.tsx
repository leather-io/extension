import { getProfileDataContentFromToken } from '@app/common/profiles/requests';
import { DisclaimerLayout } from '@app/components/disclaimer';
import { NetworkRow } from '@app/pages/signature-request/components/network-row';
import { ChainID } from '@stacks/common';

import { ProfileBox } from './profile-box';
import { UpdateAction } from './update-action';

interface ProfileDataContentProps {
  requestToken: string;
}
const DEFAULT_AVATAR_URL = 'https://github.com/stacks-network.png';

export function ProfileDataContent(props: ProfileDataContentProps) {
  const { requestToken } = props;
  const profileUpdateRequest = getProfileDataContentFromToken(requestToken);
  const name = profileUpdateRequest.profile.name();
  const avatarUrl = profileUpdateRequest.profile.avatarUrl();
  const { network } = profileUpdateRequest;
  const appName = profileUpdateRequest.appDetails?.name;
  return (
    <>
      <ProfileBox name={name} imageUrl={avatarUrl ?? DEFAULT_AVATAR_URL} />
      <NetworkRow chainId={network?.chainId ?? ChainID.Testnet} />
      <UpdateAction profileUpdaterPayload={profileUpdateRequest} />
      <hr />
      <DisclaimerLayout
        disclaimerText={`${appName ?? 'The app'} requested to update your public profile.
        The update will be published, however, some other apps might have still cached old values.`}
        learnMoreUrl="https://docs.hiro.so/build-apps/transaction-signing#get-the-users-stacks-address"
      />
    </>
  );
}
