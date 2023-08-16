import { ButtonProps, Stack } from '@stacks/ui';

import { Caption } from '@app/components//typography';

interface ReceiveItemListProps extends ButtonProps {
  children: React.ReactNode;
  title?: string;
}
export function ReceiveItemList({ children, title }: ReceiveItemListProps) {
  return (
    <>
      {title && <Caption>{title}</Caption>}
      <Stack spacing="loose" mt="base" mb="extra-loose">
        {children}
      </Stack>
    </>
  );
}
