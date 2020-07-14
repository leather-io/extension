import React from 'react';
import { Box, space, color } from '@blockstack/ui';

import { Body, SubHeading } from '@components/home/text';
export const GridItem = ({ icon: Icon, title, body, ...rest }) => {
  return (
    <Box {...rest}>
      {Icon && (
        <Box size="34px" color={color('accent')} mb={space('base')}>
          <Icon />
        </Box>
      )}
      <SubHeading color={color('text-title')} mb={space('base-loose')}>
        {title}
      </SubHeading>
      <Body>{body}</Body>
    </Box>
  );
};
