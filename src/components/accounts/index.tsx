import React from 'react';
import { Box, Text, Flex } from '@blockstack/ui';
import PlusCircleIcon from 'mdi-react/PlusCircleIcon';
import { useHover } from 'use-events';
import { Image } from '@components/image';

const AccountAvatar = ({ username, avatar, ...rest }) => {
  const firstLetter = username[0];
  return (
    <Flex
      overflow="hidden"
      flexShrink={0}
      bg="#007AFF"
      size="36px"
      borderRadius="100%"
      align={'center'}
      justify={'center'}
      {...rest}
    >
      {avatar && <Image src={avatar} alt={username} />}
      <Box>
        <Text color="white" textTransform={'uppercase'} display="block">
          {firstLetter}
        </Text>
      </Box>
    </Flex>
  );
};

const AccountItem = ({ label, iconComponent, isFirst, ...rest }) => {
  const [hover, bind] = useHover();

  return (
    <Flex
      style={{ textOverflow: 'ellipsis' }}
      py={3}
      borderBottom="1px solid"
      borderBottomColor="inherit"
      borderTop={isFirst ? '1px solid' : undefined}
      borderTopColor="inherit"
      align={'center'}
      cursor={hover ? 'pointer' : 'unset'}
      mt={isFirst ? 3 : 0}
      {...bind}
      {...rest}
    >
      {iconComponent && iconComponent({ hover })}
      <Box overflow="hidden">
        <Text textStyle={'body.small.medium'} textDecoration={hover ? 'underline' : 'unset'}>
          {label}
        </Text>
      </Box>
    </Flex>
  );
};

export const Accounts = ({ accounts }) => {
  return (
    <>
      {accounts.map(({ username }, key) => {
        return (
          <AccountItem
            isFirst={key === 0}
            iconComponent={({ hover }) => <AccountAvatar username={username} mr={3} />}
            label={username}
            key={key}
          />
        );
      })}
      <AccountItem
        iconComponent={({ hover }) => (
          <Flex
            justify="center"
            width="36px"
            mr={3}
            color={hover ? 'ink.400' : 'ink.300'}
            transition="0.08s all ease-in-out"
          >
            <PlusCircleIcon size="26px" />
          </Flex>
        )}
        label="Add a new account"
      />
    </>
  );
};
