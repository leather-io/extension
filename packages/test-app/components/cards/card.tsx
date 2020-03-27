import React from 'react';
import { Flex, Box, Text, BoxProps } from '@blockstack/ui';

interface CardProps extends BoxProps {
  title: string;
}

export const Card: React.FC<CardProps> = ({ children, title, ...props }) => (
  <Box width="calc(1/3*100% - (1 - 1/3)*20px)" my={6} mr="10px">
    <Flex
      border="1px solid"
      borderRadius="6px"
      borderColor="inherit"
      p={6}
      direction="column"
      boxShadow="mid"
      minWidth="420px"
      {...props}
    >
      <Box textAlign="center" pb={6}>
        <Text as="h1">{title}</Text>
      </Box>
      <Flex wrap="wrap">
        <Box width="100%">{children}</Box>
      </Flex>
    </Flex>
  </Box>
);
