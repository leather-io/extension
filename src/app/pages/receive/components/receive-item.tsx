import { truncateMiddle } from '@leather-wallet/utils';

import { IconButton } from '@app/ui/components/icon-button/icon-button';
import { ItemLayoutWithButtons } from '@app/ui/components/item-layout/item-layout-with-buttons';
import { CopyIcon } from '@app/ui/icons/copy-icon';
import { QrCodeIcon } from '@app/ui/icons/qr-code-icon';
import { Pressable } from '@app/ui/pressable/pressable';

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
    <Pressable my="space.02">
      <ItemLayoutWithButtons
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
    </Pressable>
  );
}
