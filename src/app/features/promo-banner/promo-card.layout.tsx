import { HStack, styled } from 'leather-styles/jsx';

import { CloseIcon, Flag, IconButton } from '@leather.io/ui';

import { useThemeSwitcher } from '@app/common/theme-provider';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';

interface PromoCardLayoutProps {
  message: string;
  imgSrc: string;
  linkUrl: string;
  onDismiss(): void;
}
export function PromoCardLayout({ imgSrc, message, linkUrl, onDismiss }: PromoCardLayoutProps) {
  const { theme } = useThemeSwitcher();
  const invertStyle = theme === 'light' ? {} : { filter: 'invert()' };
  return (
    <HStack
      cursor="pointer"
      background="ink.background-secondary"
      borderRadius={8}
      border="2px solid"
      borderColor="ink.border-default"
      gap="space.01"
      mt="space.01"
      width="100%"
    >
      <Flag
        cursor="pointer"
        img={<styled.img alt={message} src={imgSrc} height={70} width={100} style={invertStyle} />}
        pl="space.01"
        pr="space.00"
        spacing="space.00"
        width="100%"
        onClick={() => openInNewTab(linkUrl)}
      >
        <styled.p textStyle="label.02">{message}</styled.p>
      </Flag>
      <IconButton
        _hover={{ bg: 'transparent' }}
        alignSelf="flex-start"
        icon={<CloseIcon variant="small" />}
        onClick={onDismiss}
      />
    </HStack>
  );
}
