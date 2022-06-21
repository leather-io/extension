import { FiArrowLeft, FiX as IconX } from 'react-icons/fi';
import { IconType } from 'react-icons/lib';
import { Flex, IconButton, color } from '@stacks/ui';

import { Title } from '@app/components/typography';

interface HeaderActionButtonProps {
  icon?: IconType;
  onAction?(): void;
}
function HeaderActionButton({ icon, onAction }: HeaderActionButtonProps) {
  return (
    <IconButton
      _hover={{ color: color('text-title') }}
      size="36px"
      iconSize="20px"
      onClick={onAction}
      color={color('text-caption')}
      icon={icon}
      position="relative"
      zIndex={9}
    />
  );
}

interface DrawerHeaderProps {
  enableGoBack?: boolean;
  icon?: JSX.Element;
  onClose?(): void;
  onGoBack(): void;
  title?: string;
}
export function DrawerHeader({ enableGoBack, icon, onClose, onGoBack, title }: DrawerHeaderProps) {
  const onlyShowCloseAction = !(enableGoBack || icon || title);

  return (
    <Flex
      pb="base"
      justifyContent={onlyShowCloseAction ? 'right' : 'space-between'}
      alignItems="center"
      pt="loose"
      px="loose"
    >
      {enableGoBack && <HeaderActionButton icon={FiArrowLeft} onAction={onGoBack} />}
      {icon && icon}
      {title && (
        <Title fontSize="20px" lineHeight="28px">
          {title}
        </Title>
      )}
      {onClose && <HeaderActionButton icon={IconX} onAction={onClose} />}
    </Flex>
  );
}
