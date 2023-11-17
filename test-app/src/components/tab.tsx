import React from 'react';

import { Box } from 'leather-styles/jsx';

interface Props {
  children: React.ReactNode;
}

export const InactiveTab: React.FC<Props> = ({ children }) => {
  return (
    <Box color="ink.400" mr={6} py={3} borderColor="white" borderBottomWidth="2px" cursor="pointer">
      {children}
    </Box>
  );
};

export const ActiveTab: React.FC<Props> = ({ children }) => {
  return (
    <Box color="ink.900" mr={6} py={3} borderColor="blue" borderBottomWidth="2px" cursor="pointer">
      {children}
    </Box>
  );
};

interface TabProps extends Props {
  active: boolean;
}

export const Tab: React.FC<TabProps> = ({ active, ...rest }) => {
  if (active) {
    return <ActiveTab {...rest} />;
  }
  return <InactiveTab {...rest} />;
};
