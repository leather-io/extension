import React, { useState } from 'react';
import { Box, Button, Text } from '@stacks/ui';
import { stacksMainnetNetwork } from '@common/utils';
import { openProfileUpdateRequestPopup } from '@stacks/connect';
import { Profile } from '@stacks/profile';
import { StacksNetwork } from '@stacks/network';

export const ProfileTab = () => {
  const name = 'Name ' + new Date().getTime().toString();
  const avatarUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' fill='red' /%3E%3C/svg%3E";

  const [updatedProfile, setUpdatedProfile] = useState<{ profile?: Profile }>();

  const updateProfile = async (name: string, avatarUrl: string, network?: StacksNetwork) => {
    const defaultNetwork = stacksMainnetNetwork;

    await openProfileUpdateRequestPopup({
      profile: {
        name,
        image: [{ '@type': 'ImageObject', name: 'avatar', contentUrl: avatarUrl }],
      },
      network: network ?? defaultNetwork,
      onFinish: (profile: Profile) => {
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
          {updatedProfile.profile && JSON.stringify(updatedProfile.profile)}
        </Text>
      )}
      <Button mt={3} onClick={() => updateProfile(name, avatarUrl, stacksMainnetNetwork)}>
        Update profile (Mainnet)
      </Button>
    </Box>
  );
};
