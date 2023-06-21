import { Flex } from '@stacks/ui';

import { Favicon } from '@app/components/favicon';
import { Flag } from '@app/components/layout/flag';
import { Caption, Title } from '@app/components/typography';

interface PsbtRequestHeaderProps {
  origin: string;
}
export function PsbtRequestHeader({ origin }: PsbtRequestHeaderProps) {
  const caption = `${origin} is requesting you sign this PSBT`;

  return (
    <Flex flexDirection="column" my="loose" width="100%">
      <Title fontSize={3} fontWeight={500} mb="base">
        Sign transaction
      </Title>
      {caption && (
        <Flag align="top" img={<Favicon origin={origin} />} pl="tight">
          <Caption wordBreak="break-word" lineHeight={1.3}>
            {caption}
          </Caption>
        </Flag>
      )}
    </Flex>
  );
}
