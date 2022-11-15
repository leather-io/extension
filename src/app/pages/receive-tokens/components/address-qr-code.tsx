import { memo, useMemo } from 'react';

import { Box, Flex, FlexProps, color } from '@stacks/ui';
import { createQR } from '@vkontakte/vk-qr';

export const QrCode = memo(({ principal, ...rest }: { principal: string } & FlexProps) => {
  const qrSvg = useMemo(
    () =>
      createQR(principal, {
        ecc: 0,
        qrSize: 180,
        backgroundColor: color('text-body'),
        foregroundColor: color('invert'),
      }),
    [principal]
  );

  const qr = <Box dangerouslySetInnerHTML={{ __html: qrSvg }} />; // Bad?

  return (
    <Flex
      alignItems="center"
      border="1px solid"
      borderColor={color('border')}
      borderRadius="18px"
      boxShadow="low"
      justifyContent="center"
      mx="auto"
      p="loose"
      position="relative"
      {...rest}
    >
      {qr}
      <Box position="absolute">{qr}</Box>
    </Flex>
  );
});
