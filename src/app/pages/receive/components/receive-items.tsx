import { Divider, Stack, styled } from 'leather-styles/jsx';

interface ReceiveItemListProps {
  children: React.ReactNode;
  title?: string;
}
export function ReceiveItemList({ children, title }: ReceiveItemListProps) {
  return (
    <>
      {title && (
        <styled.span color="accent.text-subdued" textStyle="caption.01">
          {title}
        </styled.span>
      )}
      <Divider mt="space.02" color="accent.border-default" />
      <Stack gap="space.05" mb="space.08" mt="space.05">
        {children}
      </Stack>
    </>
  );
}
