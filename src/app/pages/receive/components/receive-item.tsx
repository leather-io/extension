import { Button } from '@app/ui/components/button/button';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { QrCodeIcon } from '@app/ui/components/icons/qr-code-icon';
import { ItemInteractive } from '@app/ui/components/item/item-interactive';
import { ItemWithButtonsLayout } from '@app/ui/components/item/item-with-buttons.layout';
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
            <Button onClick={onCopyAddress} variant="ghost">
              <CopyIcon />
            </Button>
            {onClickQrCode && (
              <Button
                data-testid={dataTestId}
                ml="space.02"
                onClick={onClickQrCode}
                variant="ghost"
              >
                <QrCodeIcon />
              </Button>
            )}
          </>
        }
      />
    </ItemInteractive>
  );
}
