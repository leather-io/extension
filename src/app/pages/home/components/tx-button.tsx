import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonProps, Text } from '@stacks/ui';

import { PrimaryButton } from '@app/components/primary-button';
import { SecondaryButton } from '@app/components/secondary-button';
import { RouteUrls } from '@shared/route-urls';

interface TxButtonProps extends ButtonProps {
  icon: any;
  route: RouteUrls;
  type: string;
}
export const TxButton = memo((props: TxButtonProps) => {
  const { icon, route, type, ...rest } = props;
  const navigate = useNavigate();

  const handleClick = useCallback(() => navigate(route), [navigate, route]);

  return type === 'Buy' ? (
    <SecondaryButton
      height="36px"
      onClick={handleClick}
      px="base-tight"
      py="tight"
      position="relative"
      {...rest}
    >
      <Box as={icon} mr="tight" size="14px" />
      <Text fontSize="14px">{type}</Text>
    </SecondaryButton>
  ) : (
    <PrimaryButton
      height="36px"
      onClick={handleClick}
      px="base-tight"
      py="tight"
      position="relative"
      {...rest}
    >
      <Box as={icon} mr="tight" size="14px" />
      <Text fontSize="14px">{type}</Text>
    </PrimaryButton>
  );
});
