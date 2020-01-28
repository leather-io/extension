import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { Image } from '@components/image';
import { useSelector } from 'react-redux';
import { AppState } from '@store';
import { selectAppName, selectAppIcon } from '@store/onboarding/selectors';

const AppIcon = (props: BoxProps) => {
  const appIcon = useSelector((state: AppState) => selectAppIcon(state));
  const appName = useSelector((state: AppState) => selectAppName(state));
  return (
    <Box size={['48px', '78px']} mx="auto" {...props}>
      <Image src={appIcon} alt={appName} />
    </Box>
  );
};
export { AppIcon };
