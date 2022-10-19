import { getProfileDataContentFromToken } from '@app/common/profiles/requests';
import { DisclaimerLayout } from '@app/components/disclaimer';
import { NetworkRow } from '@app/components/network-row';
import { ChainID } from '@stacks/common';
import { Person } from '@stacks/profile';

import { ProfileBox } from './profile-box';
import { UpdateAction } from './update-action';

interface ProfileDataContentProps {
  requestToken: string;
}

export function ProfileDataContent(props: ProfileDataContentProps) {
  const { requestToken } = props;
  const profileUpdateRequest = getProfileDataContentFromToken(requestToken);
  const person = new Person(profileUpdateRequest.profile);
  const { network } = profileUpdateRequest;
  const appName = profileUpdateRequest.appDetails?.name;
  return (
    <>
      <ProfileBox profile={person} />
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
