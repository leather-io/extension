import { getProfileDataContentFromToken } from '@app/common/profiles/requests';
import { DisclaimerLayout } from '@app/components/disclaimer';
import { NetworkRow } from '@app/pages/signature-request/components/network-row';
import { ChainID } from '@stacks/common';

import { ProfileBox } from './profile-box';
import { UpdateAction } from './update-action';

interface ProfileDataContentProps {
  requestToken: string;
}
export function ProfileDataContent(props: ProfileDataContentProps) {
  const { requestToken } = props;
  const profileUpdaterRequest = getProfileDataContentFromToken(requestToken);
  const { name, image } = profileUpdaterRequest.profile;
  const { network } = profileUpdaterRequest;
  const appName = profileUpdaterRequest.appDetails?.name;
  return (
    <>
      <ProfileBox name={name} imageUrl={image[0].contentUrl} />
      <NetworkRow chainId={network?.chainId ?? ChainID.Testnet} />
      <UpdateAction profileUpdaterPayload={profileUpdaterRequest} />
      <hr />
      <DisclaimerLayout
        disclaimerText={`${appName ?? 'The app'} requested to update your public profile.
        The update will be published, however, some other apps might have still cached old values.`}
        learnMoreUrl="https://docs.hiro.so/build-apps/transaction-signing#get-the-users-stacks-address"
      />
    </>
  );
}
