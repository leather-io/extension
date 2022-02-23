import { memo, useCallback, useRef } from 'react';
import { FiArrowUp, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Box, Button, ButtonProps } from '@stacks/ui';

import { QrCodeIcon } from '@app/components/qr-code-icon';
import { RouteUrls } from '@shared/route-urls';

export const SendTxButton = memo((props: ButtonProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const handleClick = useCallback(() => navigate(RouteUrls.Send), [navigate]);

  return (
    <Button
      size="sm"
      pl="base-tight"
      pr={'base'}
      py="tight"
      fontSize={2}
      mode="primary"
      position="relative"
      ref={ref}
      onClick={handleClick}
      borderRadius="10px"
      {...props}
    >
      <Box as={FiArrowUp} transform={'unset'} size={'16px'} mr={0} />
      <Box as="span" ml="extra-tight" fontSize="14px">
        Send
      </Box>
    </Button>
  );
});

export const ReceiveTxButton: React.FC<ButtonProps> = memo(({ ...rest }) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const handleClick = useCallback(() => navigate(RouteUrls.Receive), [navigate]);
  return (
    <Button
      size="sm"
      pl="base-tight"
      pr={'base'}
      py="tight"
      fontSize={2}
      mode="primary"
      position="relative"
      ref={ref}
      onClick={handleClick}
      borderRadius="10px"
      {...rest}
    >
      <Box as={QrCodeIcon} transform="scaleY(-1)" size="14px" mr="2px" />
      <Box as="span" ml="extra-tight" fontSize="14px">
        Receive
      </Box>
    </Button>
  );
});

export const BuyTxButton: React.FC<ButtonProps> = memo(({ ...rest }) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const handleClick = useCallback(() => navigate(RouteUrls.Buy), [navigate]);

  return (
    <Button
      size="sm"
      pl="base-tight"
      pr={'base'}
      py="tight"
      fontSize={2}
      mode="primary"
      position="relative"
      ref={ref}
      onClick={handleClick}
      borderRadius="10px"
      {...rest}
    >
      <Box as={FiPlus} transform={'scaleY(-1)'} size={'14px'} mr={'2px'} />
      <Box as="span" ml="extra-tight" fontSize="14px">
        Buy
      </Box>
    </Button>
  );
});
