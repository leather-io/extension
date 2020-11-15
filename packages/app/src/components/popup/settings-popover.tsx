import React, { useCallback } from 'react';
import { Box, Text, BoxProps } from '@stacks/ui';
import useOnClickOutside from 'use-onclickoutside';
import { Divider } from '@components/divider';

const SettingsItem: React.FC<BoxProps> = ({ onClick, ...props }) => (
  <Box
    {...props}
    width="100%"
    p="base-tight"
    _hover={{ backgroundColor: 'ink.150' }}
    onClick={e => {
      onClick?.(e);
    }}
  />
);

interface SettingsPopoverProps {
  showing: boolean;
  close: () => void;
  showSwitchAccount: () => void;
  showNetworks: () => void;
  showAddUsername: () => void;
  showCreateAccount: () => void;
}
export const SettingsPopover: React.FC<SettingsPopoverProps> = ({
  showing,
  close,
  showSwitchAccount,
  showNetworks,
  showAddUsername,
  showCreateAccount,
}) => {
  const ref = React.useRef(null);

  useOnClickOutside(ref, () => {
    if (showing) {
      close();
    }
  });

  const clicked = useCallback(
    cb => {
      return () => {
        close();
        cb();
      };
    },
    [close]
  );

  return (
    <Box
      ref={ref}
      position="absolute"
      top="14px"
      right="0px"
      borderRadius="8px"
      width="296px"
      boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08);"
      zIndex={2000}
      background="white"
      display={showing ? 'block' : 'none'}
    >
      <SettingsItem mt="tight" onClick={clicked(showSwitchAccount)}>
        <Text>Switch account</Text>
      </SettingsItem>
      <SettingsItem onClick={clicked(showCreateAccount)}>
        <Text>Create an Account</Text>
      </SettingsItem>
      {/* <SettingsItem
        onClick={() => {
          const url = chrome.runtime.getURL(ScreenPaths.SETTINGS_KEY);
          window.open(url, '_blank');
        }}
      >
        <Text>View Secret Key</Text>
      </SettingsItem> */}
      <Divider />
      <SettingsItem onClick={clicked(showAddUsername)}>
        <Text>Add username</Text>
      </SettingsItem>
      <Divider />
      <SettingsItem mb="tight" onClick={clicked(showNetworks)}>
        <Text>Change Network</Text>
      </SettingsItem>
    </Box>
  );
};
