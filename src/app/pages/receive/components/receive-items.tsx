import { Divider, Stack, styled } from 'leaf-styles/jsx';

interface ReceiveItemListProps {
  children: React.ReactNode;
  title?: string;
}
export function ReceiveItemList({ children, title }: ReceiveItemListProps) {
  return (
    <>
      {title && <styled.span textStyle="">{title}</styled.span>}
      <Divider mt="space.02" />
      <Stack gap="space.05" mb="space.08" mt="space.05">
        {children}
      </Stack>
    </>
  );
}
