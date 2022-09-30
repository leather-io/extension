import { getProfileDataContentFromToken } from '@app/common/profiles/requests';
import { ChainID } from '@stacks/common';

import { DisclaimerLayout } from '@app/components/disclaimer';
import { NetworkRow } from './network-row';
import { UpdateAction } from './update-action';
import { ProfileBox } from './profile-box';

interface ProfileDataContentProps {
  requestToken: string;
}
export function ProfileDataContent(props: ProfileDataContentProps) {
  const { requestToken } = props;
  const updateProfileRequest = getProfileDataContentFromToken(requestToken);
  const { name, image } = updateProfileRequest.profile;
  const { network } = updateProfileRequest;
  const appName = updateProfileRequest.appDetails?.name;
  return (
    <>
      <ProfileBox name={name} imageUrl={image[0].contentUrl} />
      <NetworkRow chainId={network?.chainId ?? ChainID.Testnet} />
      <UpdateAction updateProfilePayload={updateProfileRequest} />
      <hr />
      <DisclaimerLayout
        disclaimerText={`${appName ?? 'The app'} requested to update your public profile.
        The update will be published, however, some other apps might have still cached old values.`}
        learnMoreUrl="https://docs.hiro.so/build-apps/transaction-signing#get-the-users-stacks-address"
      />
    </>
  );
}
