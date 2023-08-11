import { FiCopy } from 'react-icons/fi';

import { Box, Button, ButtonProps, Flex, Stack } from '@stacks/ui';
import { color, truncateMiddle } from '@stacks/ui-utils';

import { Caption } from '@app/components//typography';
import { Flag } from '@app/components/layout/flag';
import { QrCodeIcon } from '@app/components/qr-code-icon';

interface ReceiveItemProps extends ButtonProps {
  address: string;
  dataTestId?: string;
  icon: React.JSX.Element;
  onCopyAddress(): void;
  onClickQrCode?(): void;
  title: string;
}
export function ReceiveItem({
  address,
  dataTestId,
  icon,
  onCopyAddress,
  onClickQrCode,
  title,
}: ReceiveItemProps) {
  return (
    <Flag img={icon} spacing="base">
      <Flex justifyContent="space-between">
        <Box>
          {title}
          <Caption mt="2px">{truncateMiddle(address, 6)}</Caption>
        </Box>
        <Stack>
          <Box>
            <Button borderRadius="10px" mode="tertiary" onClick={onCopyAddress}>
              <FiCopy />
            </Button>
            {onClickQrCode && (
              <Button
                borderRadius="10px"
                data-testid={dataTestId}
                mode="tertiary"
                ml="tight"
                onClick={onClickQrCode}
              >
                <QrCodeIcon color={color('text-caption')} size="14px" />
              </Button>
            )}
          </Box>
        </Stack>
      </Flex>
    </Flag>
  );
}
