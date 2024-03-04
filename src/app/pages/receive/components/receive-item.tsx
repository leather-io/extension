import { IconButton } from '@app/ui/components/icon-button/icon-button';
import { ItemInteractive } from '@app/ui/components/item/item-interactive';
import { ItemWithButtonsLayout } from '@app/ui/components/item/item-with-buttons.layout';
import { CopyIcon } from '@app/ui/icons/copy-icon';
import { QrCodeIcon } from '@app/ui/icons/qr-code-icon';
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
    <ItemInteractive>
      <ItemWithButtonsLayout
        flagImg={icon}
        title={title}
        caption={truncateMiddle(address, 6)}
        buttons={
          <>
            <IconButton icon={<CopyIcon />} onClick={onCopyAddress} />
            {onClickQrCode && (
              <IconButton
                data-testid={dataTestId}
                icon={<QrCodeIcon />}
                ml="space.02"
                onClick={onClickQrCode}
              />
            )}
          </>
        }
      />
    </ItemInteractive>
  );
}
