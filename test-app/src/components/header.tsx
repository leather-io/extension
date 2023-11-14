import React, { useContext } from 'react';

import { AppContext } from '@common/context';
import { Link } from '@components/link';
import { Box, styled } from 'leather-styles/jsx';

interface HeaderProps {
  signOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ signOut }) => {
  const state = useContext(AppContext);
  return (
    <styled.nav justifyContent="space-between" alignItems="center" height="64px" px={6}>
      {state.userData ? (
        <Box>
          <Link
            display="inline-block"
            ml={2}
            textStyle="caption.medium"
            color="blue"
            onClick={() => {
              signOut();
            }}
          >
            Sign out
          </Link>
        </Box>
      ) : null}
    </styled.nav>
  );
};
