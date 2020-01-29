import React from 'react';
import { Box, Flex, Stack, Button } from '@blockstack/ui';
import { ScreenBody, ScreenActions } from '@blockstack/connect';
import { Link } from '@components/link';
import useOnClickOutside from 'use-onclickoutside';
import { Image } from '@components/image';

interface App {
  icon: string;
  name: string;
}

const mockApps = [
  { icon: 'https://appco.imgix.net/apps/c6a79902-35d4-4233-b63d-28f220dcd96f?fit=clip&h=144&w=144', name: 'App Name' },
  { icon: 'https://appco.imgix.net/apps/409b27e0-5c04-48e0-b9a2-7a6e92cce4f6?fit=clip&h=144&w=144', name: 'App Name' },
  { icon: 'https://appco.imgix.net/apps/24000ad6-6617-47e8-b3d8-3c7f98ce67ac?fit=clip&h=144&w=144', name: 'App Name' },
];

interface PreviousAppsProps {
  apps: App[];
}

const PreviousApps = ({ apps, ...rest }: PreviousAppsProps) => (
  <Flex mx={6} {...rest}>
    {apps.map((app, key) => (
      <Box
        bg="blue"
        border="2px solid white"
        size="26px"
        borderRadius="6px"
        key={key}
        transform={key > 0 ? `translateX(-${4 * key}px)` : 'none'}
        overflow="hidden"
      >
        <Image src={app.icon} alt={app.name} />
      </Box>
    ))}
  </Flex>
);

const transition = '0.2s all ease-in-out';

interface DrawerProps {
  showing: boolean;
  close: () => void;
}
export const Drawer = ({ showing, close }: DrawerProps) => {
  const ref = React.useRef(null);

  useOnClickOutside(ref, () => showing && close());

  return (
    <Flex
      bg={`rgba(0,0,0,0.${showing ? 4 : 0})`}
      transition={transition}
      position="fixed"
      height="100%"
      width="100%"
      align="flex-end"
      dir="column"
      style={{
        pointerEvents: !showing ? 'none' : 'unset',
        userSelect: !showing ? 'none' : 'unset',
        willChange: 'background',
      }}
    >
      <Box
        ref={ref}
        opacity={showing ? 1 : 0}
        transform={showing ? 'none' : 'translateY(35px)'}
        transition={showing ? transition + ' 0.1s' : transition}
        style={{ willChange: 'transform, opacity' }}
        width="100%"
        bg="white"
        py={6}
        borderTopLeftRadius="24px"
        borderTopRightRadius="24px"
      >
        <Stack spacing={4}>
          <PreviousApps apps={mockApps} />
          <ScreenBody
            title="You're using this account with 3 other apps."
            body={[
              <>
                The apps used by an account is public information. If you want your use of this app to be private,
                consider choosing a different account or creating a new account.{' '}
                <Link color="blue" display="inline">
                  Learn more.
                </Link>
              </>,
              <>
                <Flex align="center">
                  <Box mr={2}>
                    <input name="checkbox" id="checkbox" type="checkbox" />
                  </Box>
                  <label htmlFor="checkbox">Do not show this again</label>
                </Flex>
              </>,
            ]}
          />
          <ScreenActions pt={2}>
            <Stack width="100%" isInline spacing={3}>
              <Button mode="secondary" onClick={close} flexGrow={1}>
                Go back
              </Button>
              <Button flexGrow={1}>Continue to app</Button>
            </Stack>
          </ScreenActions>
        </Stack>
      </Box>
    </Flex>
  );
};
