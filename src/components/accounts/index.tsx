import React from 'react';
import { useDispatch } from 'react-redux';
import { Identity } from '@blockstack/keychain';

import { Box, Text, Flex, BoxProps } from '@blockstack/ui';
import { useHover } from 'use-events';
import { Image } from '@components/image';
import { doChangeScreen } from '@store/onboarding/actions';
import { ScreenName } from '@store/onboarding/types';
import { PlusInCircle } from '@components/icons/plus-in-circle';

interface AccountAvatarProps extends BoxProps {
  username: string;
  avatar?: string;
}

const AccountAvatar = ({ username, avatar, ...rest }: AccountAvatarProps) => {
  const firstLetter = username[0];
  return (
    <Flex
      overflow="hidden"
      flexShrink={0}
      bg="#007AFF"
      size="36px"
      borderRadius="100%"
      align="center"
      justify="center"
      {...rest}
    >
      {avatar && <Image src={avatar} alt={username} />}
      <Box>
        <Text color="white" textTransform="uppercase" display="block">
          {firstLetter}
        </Text>
      </Box>
    </Flex>
  );
};

interface AccountItemProps {
  label: string;
  iconComponent?: (props: { hover: boolean }) => void;
  isFirst?: boolean;
  onClick?: () => void;
}

const AccountItem = ({ label, iconComponent, isFirst, ...rest }: AccountItemProps) => {
  const [hover, bind] = useHover();

  return (
    <Flex
      style={{ textOverflow: 'ellipsis' }}
      py={3}
      borderBottom="1px solid"
      borderBottomColor="inherit"
      borderTop={isFirst ? '1px solid' : undefined}
      borderTopColor="inherit"
      align="center"
      cursor={hover ? 'pointer' : 'unset'}
      mt={isFirst ? 5 : 0}
      {...bind}
      {...rest}
    >
      {iconComponent && iconComponent({ hover })}
      <Box overflow="hidden">
        <Text textStyle="body.small.medium" textDecoration={hover ? 'underline' : 'unset'}>
          {label}
        </Text>
      </Box>
    </Flex>
  );
};

interface AccountsProps {
  identities: Identity[];
  next: (identityIndex: number) => void;
}

export const Accounts = ({ identities, next }: AccountsProps) => {
  const dispatch = useDispatch();
  return (
    <>
      {identities.map(({ defaultUsername, address }, key) => {
        return (
          <AccountItem
            isFirst={key === 0}
            iconComponent={() => <AccountAvatar username={defaultUsername || address} mr={3} />}
            label={defaultUsername || address}
            key={key}
            onClick={() => next(key)}
          />
        );
      })}
      <AccountItem
        onClick={() => dispatch(doChangeScreen(ScreenName.ADD_ACCOUNT))}
        iconComponent={({ hover }) => (
          <Flex
            justify="center"
            width="36px"
            mr={3}
            color={hover ? 'ink.400' : 'ink.300'}
            transition="0.08s all ease-in-out"
          >
            <PlusInCircle />
          </Flex>
        )}
        label="Add a new account"
      />
    </>
  );
};
