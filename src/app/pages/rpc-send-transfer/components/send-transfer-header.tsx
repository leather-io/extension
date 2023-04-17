import { Flex } from '@stacks/ui';

import { Caption, Title } from '@app/components/typography';

interface SendTransferHeaderProps {
  amount: string;
  requester: string;
}
export function SendTransferHeader({ amount, requester }: SendTransferHeaderProps) {
  const title = `Send ${amount}`;
  const caption = `Requested by ${requester}`;

  return (
    <Flex flexDirection="column" mb="loose" width="100%">
      <Title fontSize={4} fontWeight={500} mb="base-tight">
        {title}
      </Title>
      <Caption wordBreak="break-word">{caption}</Caption>
    </Flex>
  );
}
