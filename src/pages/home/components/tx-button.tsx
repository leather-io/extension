import { Box, Button, ButtonProps } from '@stacks/ui';
import React, { memo, useCallback, useRef } from 'react';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { FiArrowUp } from 'react-icons/fi';
import { QrCodeIcon } from '@components/qr-code-icon';
import { RouteUrls } from '@routes/route-urls';

interface TxButtonProps extends ButtonProps {
  kind: 'send' | 'receive';
  path: RouteUrls.Send | RouteUrls.Receive;
}
export const TxButton: React.FC<TxButtonProps> = memo(({ kind, path, ...rest }) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const changeScreen = useChangeScreen();

  const isSend = kind === 'send';

  const handleClick = useCallback(() => changeScreen(path), [path, changeScreen]);

  const label = isSend ? 'Send' : 'Receive';
  return (
    <>
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
        <Box
          as={isSend ? FiArrowUp : QrCodeIcon}
          transform={isSend ? 'unset' : 'scaleY(-1)'}
          size={isSend ? '16px' : '14px'}
          mr={isSend ? 0 : '2px'}
        />
        <Box as="span" ml="extra-tight" fontSize="14px">
          {label}
        </Box>
      </Button>
    </>
  );
});
