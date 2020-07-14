import React from 'react';
import { Flex, Box, BlockstackIcon, Portal, Input, color, space } from '@blockstack/ui';
import { Link, Text } from '@components/typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { useLockBodyScroll } from '@common/hooks/use-lock-body-scroll';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import { SideNav } from './side-nav';
import GithubIcon from 'mdi-react/GithubIcon';
import { IconButton } from '@components/icon-button';
import { border } from '@common/utils';
import useSWR from 'swr';
import { useAppState } from '@common/hooks/use-app-state';
import { css } from '@styled-system/css';
import NextLink from 'next/link';
const MenuButton = ({ ...rest }: any) => {
  const { isOpen, handleOpen, handleClose } = useMobileMenuState();
  const Icon = isOpen ? CloseIcon : MenuIcon;
  const handleClick = isOpen ? handleClose : handleOpen;
  return (
    <Flex
      color="var(--colors-invert)"
      display={['flex', 'flex', 'none']}
      onClick={handleClick}
      px={1}
    >
      <Icon color="currentColor" />
    </Flex>
  );
};

const GithubButton = () => (
  <IconButton
    as="a"
    href="https://github.com/blockstack/ux/tree/master/packages/ui#blockstack-ui"
    target="_blank"
    rel="nofollow noopener noreferrer"
    title="Find us on GitHub"
    position="relative"
    overflow="hidden"
    display="flex"
    style={{
      alignItems: 'center',
    }}
  >
    <Text position="absolute" opacity={0} as="label">
      Find us on GitHub
    </Text>
    <Version as="span" mr={space('tight')} fontSize="12px" />
    <GithubIcon size="20px" />
  </IconButton>
);

const MobileSideNav = () => {
  const { isOpen } = useMobileMenuState();
  useLockBodyScroll(isOpen);
  return (
    <SideNav
      position="fixed"
      top="50px"
      maxHeight="calc(100vh - 50px)"
      width="100%"
      zIndex={99}
      bg={color('bg')}
      display={isOpen ? ['block', 'block', 'none'] : 'none'}
      border="unset"
    />
  );
};

export const Version: React.FC<any> = props => {
  const { data, error } = useSWR('https://registry.npmjs.org/@blockstack/ui', fetch);
  const { version: _version, doSetVersion } = useAppState();
  const version = data && data['dist-tags'] && data['dist-tags'].latest;
  React.useEffect(() => {
    if (!error) {
      if (version && _version !== version) {
        doSetVersion(version);
      }
    }
  }, [_version, version]);

  return _version ? (
    <Box {...props}>
      <Text fontFamily={`"Fira Code", monospace`}>v{_version}</Text>
    </Box>
  ) : null;
};

const Header = ({ ...rest }: any) => {
  return (
    <>
      <Flex
        justifyContent="space-between"
        align="center"
        px="base"
        position="fixed"
        zIndex={9999}
        width="100%"
        bg="rgba(255,255,255, 0.8)"
        borderBottom={border()}
        style={{
          backdropFilter: 'blur(5px)',
        }}
        height="50px"
        boxShadow="mid"
        {...rest}
      >
        <NextLink href="/" passHref>
          <Link as="a">
            <Flex align="center">
              <Box color={color('invert')} mr={space('tight')}>
                <BlockstackIcon size="20px" />
              </Box>
              <Box>
                <Text
                  color={color('invert')}
                  css={css({
                    fontWeight: 500,
                    fontSize: '13.75px',
                    lineHeight: '14px',
                    padding: '0.05px 0',
                    ':before': {
                      content: "''",
                      marginTop: '-0.14909090909090908em',
                      display: 'block',
                      height: 0,
                    },
                    ':after': {
                      content: "''",
                      marginBottom: '-0.14909090909090908em',
                      display: 'block',
                      height: 0,
                    },
                  })}
                >
                  Blockstack UI
                </Text>
              </Box>
            </Flex>
          </Link>
        </NextLink>
        <Flex align="center">
          <Link
            as="a"
            mr={space('base')}
            href="https://www.dropbox.com/sh/5uyhon1dxax4t6t/AABnh34kFRzD2TSck1wE9fmqa?dl=0"
            target="_blank"
            rel="nofollow noopener noreferrer"
            fontSize="12px"
          >
            Branding Assets
          </Link>
          <GithubButton />
          <MenuButton />
        </Flex>
      </Flex>
      <MobileSideNav />
    </>
  );
};

export { Header };
