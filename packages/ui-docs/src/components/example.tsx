import React from 'react';
import {
  Box,
  Flex,
  Stack,
  space,
  color,
  BoxProps,
  BlockstackIcon,
  ChevronIcon,
  themeColor,
  FlexProps,
} from '@blockstack/ui';
import { Caption, Text } from '@components/typography';
import jsxToString from 'jsx-to-string';

import { border } from '@common/utils';

const Circle: React.FC<BoxProps> = ({ size = '72px', ...rest }) => (
  <Box size={size} borderRadius={size} bg={color('bg-alt')} {...rest} />
);

const Avatar = ({ ...rest }) => <Circle {...rest} />;

const Progress = ({ amount, ...rest }) => (
  <Box bg={color('bg-alt')} height="5px" borderRadius="5px" flexGrow={1} {...rest}>
    <Box width={`${amount}%`} bg={themeColor('green')} height="5px" borderRadius="5px" />
  </Box>
);

const AppItem: React.FC<FlexProps & { name: string; usage: string }> = ({
  name,
  usage,
  ...rest
}) => (
  <ListItem {...rest}>
    <Flex align="center">
      <Box
        bg={color('bg-alt')}
        border={border()}
        mr={space('tight')}
        size="18px"
        borderRadius="md"
      />
      <Title>{name}</Title>
    </Flex>
    <Flex justify="flex-end" maxWidth="100px" align="center" flexGrow={1}>
      <Caption>{usage}</Caption>
      <ChevronIcon size="22px" color={color('text-caption')} direction="right" />
    </Flex>
  </ListItem>
);

const ListItem: React.FC<FlexProps> = props => (
  <Flex
    align="center"
    justify="space-between"
    borderBottom={border()}
    pb={space('base')}
    {...props}
  />
);

const Title: React.FC<BoxProps> = props => (
  <Text textStyle="body.small" color={color('text-title')} fontWeight="600" {...props} />
);

export const ExampleComponent: React.FC<BoxProps> = props => (
  <Box
    bg="white"
    border={border()}
    boxShadow="mid"
    borderRadius="lg"
    width={['100%', '320px', '320px', '320px']}
    {...props}
  >
    <Flex borderBottom={border()} p={space('base-loose')} justify="space-between" align="center">
      <Title>Data storage</Title>
      <Avatar border={border()} size="24px" />
    </Flex>
    <Box p={space('base-loose')}>
      <Caption>Connected to</Caption>
      <ListItem mt={space('base-tight')}>
        <Flex align="center">
          <BlockstackIcon color={color('accent')} mr={space('tight')} size="18px" />
          <Title>My Gaia Hub</Title>
        </Flex>
        <Flex maxWidth="100px" align="center" flexGrow={1}>
          <Progress mr={space('base')} amount={72} />
          <ChevronIcon size="22px" color={color('text-caption')} direction="right" />
        </Flex>
      </ListItem>
      <Caption my={space('base')}>App data</Caption>
      <Stack spacing={space('base')}>
        <AppItem name="XOR Drive" usage="731.45 MB" />
        <AppItem name="Recall" usage="283.52 MB" />
        <AppItem name="XOR Drive" usage="99.25 MB" />
      </Stack>
    </Box>
  </Box>
);

export const exampleCode = `
<Box 
  border={border()} 
  boxShadow="mid" 
  borderRadius="lg" 
  width="320px">
  <Flex 
    align="center"
    justify="space-between" 
    p={space('base-loose')} 
    borderBottom={border()}> 
    <Title>Data storage</Title>
    <Avatar border={border()} size="24px" />
  </Flex>
  <Box p={space('base-loose')}>
    <Caption>Connected to</Caption>
    <GaiaHubUsage usage={70} />
    <Caption my={space('base')}>App data</Caption>
    <Stack spacing={space('base')}>
      <AppItem name="XOR Drive" usage="731.45 MB" />
      <AppItem name="Recall" usage="283.52 MB" />
      <AppItem name="XOR Drive" usage="99.25 MB" />
    </Stack>
  </Box>
</Box>`;

export const gaiaHubUsage = `
<ListItem>
  <Flex align="center">
    <BlockstackIcon 
      color={color('accent')} 
      mr={space('tight')} 
      size="18px" />
    <Title>My Gaia Hub</Title>
  </Flex>
  <Flex 
    maxWidth="100px" 
    align="center" 
    flexGrow={1}>
    <Progress 
      mr={space('base')} 
      amount={72} />
    <ChevronIcon 
      size="22px" 
      color={color('text-caption')} 
      direction="right" />
  </Flex>
</ListItem>`;

export const appItem = `
<ListItem>
  <Flex align="center">
    <Box
      bg={color('bg-alt')}
      border={border()}
      mr={space('tight')}
      size="18px"
      borderRadius="md"
    />
    <Title>{name}</Title>
  </Flex>
  <Flex 
    justify="flex-end" 
    maxWidth="100px" 
    align="center" 
    flexGrow={1}>
    <Caption>{usage}</Caption>
    <ChevronIcon 
      size="22px" 
      color={color('text-caption')} 
      direction="right" />
  </Flex>
</ListItem>`;
