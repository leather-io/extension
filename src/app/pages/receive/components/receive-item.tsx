import { CopyIcon, IconButton, ItemLayoutWithButtons, Pressable, QrCodeIcon } from '@leather.io/ui';
import { truncateMiddle } from '@leather.io/utils';

interface ReceiveItemProps {
  address?: string;
  dataTestId?: string;
  icon: React.ReactNode;
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
    <Pressable my="space.02">
      <ItemLayoutWithButtons
        img={icon}
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
    </Pressable>
  );
}
