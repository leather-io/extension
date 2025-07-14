import { HStack, styled } from 'leather-styles/jsx';

import { CloseIcon, Flag, IconButton } from '@leather.io/ui';

interface PromoCardLayoutProps {
  img: React.ReactNode;
  message: string;
  onClickCard(): void;
  onDismissCard(): void;
}
export function PromoCardLayout({
  img,
  message,
  onClickCard,
  onDismissCard,
}: PromoCardLayoutProps) {
  return (
    <HStack
      cursor="pointer"
      background="ink.background-secondary"
      borderRadius={8}
      border="2px solid"
      borderColor="ink.border-default"
      gap="space.01"
      mt="space.01"
    >
      <Flag
        cursor="pointer"
        img={img}
        pl="space.01"
        pr="space.00"
        spacing="space.00"
        width="100%"
        onClick={onClickCard}
      >
        <styled.p textStyle="label.02">{message}</styled.p>
      </Flag>
      <IconButton
        _hover={{ bg: 'transparent' }}
        alignSelf="flex-start"
        icon={<CloseIcon variant="small" />}
        onClick={onDismissCard}
      />
    </HStack>
  );
}
