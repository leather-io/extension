import React from 'react';
import { Box, Flex, Text } from '@blockstack/ui';
import styled from 'styled-components';
// import { useAppDetails } from '../../hooks/use-app-details';

const BannerText = styled(Text)`
  font-size: 11px;
  position: relative;
  top: -2px;
  font-weight: 600;
`;

export const TestnetBanner: React.FC = ({ ...rest }) => {
  return (
    <Flex
      // py={[2]}
      // px="base"
      height="24px"
      bg="white"
      align="center"
      justify="space-between"
      {...rest}
    >
      <Flex width="100%" align="center">
        <Box textAlign="center" width="100%" backgroundColor="rgba(249, 161, 77, 0.12)">
          <BannerText color="orange">Testing mode</BannerText>
        </Box>
      </Flex>
    </Flex>
  );
};
