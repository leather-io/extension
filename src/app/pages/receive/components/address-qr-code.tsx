import { memo, useMemo } from 'react';

// FIXME migrate QR color
import { color } from '@stacks/ui';
import { createQR } from '@vkontakte/vk-qr';
import { Box, Flex } from 'leather-styles/jsx';

// got rid of ...rest as <QrCode only called once and provided with principal only
export const QrCode = memo(({ principal }: { principal: string }) => {
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
      borderColor={color('border')} // FIXME figure this color out
      borderRadius="18px"
      boxShadow="low"
      justifyContent="center"
      mx="auto"
      p="space.05"
      position="relative"
    >
      {qr}
      <Box position="absolute">{qr}</Box>
    </Flex>
  );
});
