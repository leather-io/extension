import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Text } from '@stacks/ui';
import { stacksMainnetNetwork } from '@common/utils';
import { openProfileUpdateRequestPopup } from '@stacks/connect';
import { PublicPersonProfile, PublicProfile } from '@stacks/profile';
import { StacksNetwork } from '@stacks/network';
import { ProfileTabSelectors } from '@tests/integration/profile/profile-test-app.selectors';

export const ProfileTab = () => {
  const name = 'Name ' + new Date().getTime().toString();
  const avatarUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' fill='red' /%3E%3C/svg%3E";

  const [updatedProfile, setUpdatedProfile] = useState<{ profile?: PublicProfile }>();

  const updateProfile = async (profile: PublicPersonProfile, network?: StacksNetwork) => {
    const defaultNetwork = stacksMainnetNetwork;

    await openProfileUpdateRequestPopup({
      profile,
      network: network ?? defaultNetwork,
      onFinish: (profile: PublicProfile) => {
        console.log('profile from debugger', profile);
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
                  { '@type': 'ImageObject', name: 'background', contentUrl: avatarUrl },
                ],
                sameAs: ['https://twitter.com/twitterHandle', 'https://instagram.com/instaHandle'],
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
