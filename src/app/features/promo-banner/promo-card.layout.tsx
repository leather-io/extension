import { HStack, styled } from 'leather-styles/jsx';

import { CloseIcon, Flag, type FlagProps, IconButton } from '@leather.io/ui';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';

interface PromoCardContentProps extends FlagProps {
  img: React.ReactNode;
  message: string;
  url: string;
  onClose(): void;
}
export function PromoCardLayout({ img, message, url, onClose, ...props }: PromoCardContentProps) {
  return (
    <HStack
      cursor="pointer"
      background="ink.background-secondary"
      borderRadius={8}
      border="2px solid"
      borderColor="ink.border-default"
      mt="space.01"
    >
      <Flag
        cursor="pointer"
        img={img}
        pl="space.01"
        spacing="space.00"
        width="100%"
        onClick={() => openInNewTab(url)}
        {...props}
      >
        <styled.p textStyle="label.02">{message}</styled.p>
      </Flag>
      <IconButton
        _hover={{ bg: 'transparent' }}
        alignSelf="flex-start"
        icon={<CloseIcon variant="small" />}
        onClick={onClose}
      />
    </HStack>
  );
}
