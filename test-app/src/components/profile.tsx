import React, { useState } from 'react';

import { useAuth } from '@common/use-auth';
import { stacksMainnetNetwork } from '@common/utils';
import { openProfileUpdateRequestPopup } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';
import { PublicPersonProfile, PublicProfile } from '@stacks/profile';
import { Box, Button, ButtonGroup, Text } from '@stacks/ui';
import { ProfileTabSelectors } from '@tests-legacy/integration/profile/profile-test-app.selectors';

export const Profile = () => {
  const name = 'Name ' + new Date().getTime().toString();
  const avatarUrl =
    'https://byzantion.mypinata.cloud/ipfs/Qmb84UcaMr1MUwNbYBnXWHM3kEaDcYrKuPWwyRLVTNKELC/2256.png';
  const backgroundUrl =
    'https://unsplash.com/photos/h0Vxgz5tyXA/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8YmFja2dyb3VuZHxlbnwwfDB8fHwxNjY2NDA0Nzkx&force=true&w=640';
  const [updatedProfile, setUpdatedProfile] = useState<{ profile?: PublicProfile }>();
  const { authOptions } = useAuth();

  const updateProfile = async (profile: PublicPersonProfile, network?: StacksNetwork) => {
    const defaultNetwork = stacksMainnetNetwork;

    await openProfileUpdateRequestPopup({
      profile,
      network: network ?? defaultNetwork,
      appDetails: authOptions.appDetails,
      onFinish: (profile: PublicProfile) => {
        console.log('profile', profile);
        setUpdatedProfile({ profile });
      },
      onCancel: () => {
        setUpdatedProfile({});
        console.log('popup closed!');
      },
    });
  };

  return (
    <Box py={6}>
      {updatedProfile && (
        <Text textStyle="body.large" display="block" my={'base'}>
          <Text color="green" fontSize={1}>
            Profile {updatedProfile.profile ? 'successfully ' : 'not'} updated
          </Text>
          <Text>{updatedProfile.profile && JSON.stringify(updatedProfile.profile)}</Text>
        </Text>
      )}
      <ButtonGroup spacing={4} my="base">
        <Button
          data-testid={ProfileTabSelectors.BtnUpdateValidProfile}
          mt={3}
          onClick={() =>
            updateProfile(
              {
                '@context': 'http://schema.org',
                '@type': 'Person',
                name,
                image: [
                  { '@type': 'ImageObject', name: 'avatar', contentUrl: avatarUrl },
                  { '@type': 'ImageObject', name: 'background', contentUrl: backgroundUrl },
                ],
                sameAs: ['https://twitter.com/twitterHandle', 'https://instagram.com/instaHandle'],
                owns: [
                  {
                    '@type': 'OwnershipInfo',
                    identifier:
                      'bip122:000000000019d6689c085ae165831e93:12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S',
                  },
                ],
              },
              stacksMainnetNetwork
            )
          }
        >
          Update profile (Mainnet)
        </Button>

        <Button
          data-testid={ProfileTabSelectors.BtnUpdateInvalidProfile}
          mt={3}
          onClick={() =>
            updateProfile(
              {
                name: 1,
              } as any,
              stacksMainnetNetwork
            )
          }
        >
          Try to update invalid profile (Mainnet)
        </Button>
      </ButtonGroup>
    </Box>
  );
};
