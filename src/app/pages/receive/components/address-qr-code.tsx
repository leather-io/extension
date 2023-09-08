import { memo, useMemo } from 'react';

import { createQR } from '@vkontakte/vk-qr';
import { Box, Flex, FlexProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

export const QrCode = memo(({ principal, ...rest }: { principal: string } & FlexProps) => {
  const qrSvg = useMemo(
    () =>
      createQR(principal, {
        ecc: 0,
        qrSize: 180,
        //  #4164 FIXME check these colors
        backgroundColor: token('colors.accent.text-primary'), //color('text-body'),
        foregroundColor: token('colors.accent.background-primary'), //color('invert'),
      }),
    [principal]
  );

  const qr = <Box dangerouslySetInnerHTML={{ __html: qrSvg }} />; // Bad?

  return (
    <Flex
      alignItems="center"
      border="1px solid"
      borderColor={token('colors.accent.background-primary')}
      borderRadius="18px"
      boxShadow="low"
      justifyContent="center"
      mx="auto"
      p="space.05"
      position="relative"
      {...rest}
    >
      {qr}
      <Box position="absolute">{qr}</Box>
    </Flex>
  );
});
