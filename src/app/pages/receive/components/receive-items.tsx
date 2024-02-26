import { Divider, Stack, styled } from 'leather-styles/jsx';

interface ReceiveItemListProps {
  children: React.ReactNode;
  title?: string;
}
export function ReceiveItemList({ children, title }: ReceiveItemListProps) {
  return (
    <>
      {title && (
        <styled.span color="ink.text-subdued" textStyle="caption.01">
          {title}
        </styled.span>
      )}
      <Divider mt="space.02" color="ink.border-default" />
      <Stack mb="space.08" mt="space.05">
        {children}
      </Stack>
    </>
  );
}
