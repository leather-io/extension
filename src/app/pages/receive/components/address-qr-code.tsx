import { memo, useMemo } from 'react';

import { createQR } from '@vkontakte/vk-qr';
import { Box, Flex } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

export const QrCode = memo(({ principal, ...rest }: { principal: string }) => {
  const qrSvg = useMemo(
    () =>
      createQR(principal, {
        ecc: 0,
        qrSize: 180,
        backgroundColor: token('colors.ink.background-primary'),
        foregroundColor: token('colors.ink.text-primary'),
      }),
    [principal]
  );

  const qr = <Box dangerouslySetInnerHTML={{ __html: qrSvg }} />; // Bad?

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      mx="auto"
      p="space.03"
      position="relative"
      {...rest}
    >
      {qr}
      <Box position="absolute">{qr}</Box>
    </Flex>
  );
});
