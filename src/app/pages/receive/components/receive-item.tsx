import { truncateMiddle } from '@stacks/ui-utils';
import { Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
import { Flag } from '@app/components/layout/flag';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { QrCodeIcon } from '@app/ui/components/icons/qr-code-icon';

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
    <Flag align="middle" img={icon} spacing="base">
      <Flex justifyContent="space-between">
        <Stack gap="space.00">
          <styled.span textStyle="label.02">{title}</styled.span>
          <styled.span textStyle="caption.02">{truncateMiddle(address, 6)}</styled.span>
        </Stack>
        <HStack gap="space.00">
          <LeatherButton onClick={onCopyAddress} variant="ghost">
            <CopyIcon />
          </LeatherButton>
          {onClickQrCode && (
            <LeatherButton
              data-testid={dataTestId}
              ml="tight"
              onClick={onClickQrCode}
              variant="ghost"
            >
              <QrCodeIcon />
            </LeatherButton>
          )}
        </HStack>
      </Flex>
    </Flag>
  );
}
