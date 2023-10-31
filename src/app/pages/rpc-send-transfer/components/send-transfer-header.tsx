import { Flex, styled } from 'leather-styles/jsx';

import { Favicon } from '@app/components/favicon';
import { Flag } from '@app/components/layout/flag';

interface SendTransferHeaderProps {
  amount: string;
  origin: string;
}
export function SendTransferHeader({ amount, origin }: SendTransferHeaderProps) {
  const title = `Send ${amount}`;
  const caption = origin ? `Requested by ${origin}` : null;

  return (
    <Flex flexDirection="column" mb="space.05" width="100%">
      <styled.h1 mb="space.04" textStyle="heading.03">
        {title}
      </styled.h1>
      {caption && (
        <Flag align="middle" img={<Favicon origin={origin} />} pl="space.02">
          <styled.span textStyle="label.02" wordBreak="break-word">
            {caption}
          </styled.span>
        </Flag>
      )}
    </Flex>
  );
}
