import React, { useState } from 'react';

import { useAuth } from '@common/use-auth';
import { stacksMainnetNetwork, stacksTestnetNetwork } from '@common/utils';
import { openProfileUpdateRequestPopup } from '@stacks/connect-jwt';
import { StacksNetwork } from '@stacks/network';
import { PublicPersonProfile, PublicProfile } from '@stacks/profile';
import { TestAppSelectors } from '@tests/selectors/test-app.selectors';
import { Box, Flex, styled } from 'leather-styles/jsx';

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
        <styled.span textStyle="body.large" display="block" my="space.04">
          <styled.span color="green">
            Profile {updatedProfile.profile ? 'successfully ' : 'not'} updated
          </styled.span>
          <styled.span>
            {updatedProfile.profile && JSON.stringify(updatedProfile.profile)}
          </styled.span>
        </styled.span>
      )}
      <Flex gap={4} my="space.04">
        <styled.button
          data-testid={TestAppSelectors.BtnUpdateValidProfile}
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
              stacksTestnetNetwork
            )
          }
        >
          Update profile (Testnet)
        </styled.button>

        <styled.button
          data-testid={TestAppSelectors.BtnUpdateInvalidProfile}
          mt={3}
          onClick={() =>
            updateProfile(
              {
                name: 1,
              } as any,
              stacksTestnetNetwork
            )
          }
        >
          Try to update invalid profile (Testnet)
        </styled.button>
      </Flex>
    </Box>
  );
};
