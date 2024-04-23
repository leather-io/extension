import { Flex, styled } from 'leather-styles/jsx';

import { getUrlHostname } from '@app/common/utils';
import { Favicon } from '@app/components/favicon';
import { Flag } from '@app/ui/components/flag/flag';

interface SendTransferHeaderProps {
  amount: string;
  origin: string;
}
export function SendTransferHeader({ amount, origin }: SendTransferHeaderProps) {
  const n = parseFloat(amount)
  const title = `Send ${Number(n.toFixed(4))}`;
  const displayName = origin ? `${getUrlHostname(origin)}` : '';
  const caption = origin ? `Requested by ${displayName}` : null;

  return (
    <Flex flexDirection="column" mb="space.05" width="100%">
      <styled.h1 mb="space.04" textStyle="heading.03">
        {title}
      </styled.h1>
      {caption && (
        <Flag img={<Favicon origin={origin} />} pl="space.02">
          <styled.span textStyle="label.02" wordBreak="break-word">
            {caption}
          </styled.span>
        </Flag>
      )}
    </Flex>
  );
}
