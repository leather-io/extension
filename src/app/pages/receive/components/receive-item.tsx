import { Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import { Flag } from '@app/components/layout/flag';
import { Button } from '@app/ui/components/button/button';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { QrCodeIcon } from '@app/ui/components/icons/qr-code-icon';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

interface ReceiveItemProps {
  address?: string;
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
  if (!address) return null;
  return (
    <Flag align="middle" img={icon} spacing="space.04">
      <Flex justifyContent="space-between">
        <Stack gap="space.00">
          <styled.span textStyle="label.02">{title}</styled.span>
          <styled.span textStyle="caption.02">{truncateMiddle(address, 6)}</styled.span>
        </Stack>
        <HStack gap="space.00">
          <Button onClick={onCopyAddress} variant="ghost">
            <CopyIcon />
          </Button>
          {onClickQrCode && (
            <Button data-testid={dataTestId} ml="space.02" onClick={onClickQrCode} variant="ghost">
              <QrCodeIcon />
            </Button>
          )}
        </HStack>
      </Flex>
    </Flag>
  );
}
