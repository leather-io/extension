import { Flex, styled } from 'leather-styles/jsx';

import { Flag } from '@leather.io/ui';

import { Favicon } from '@app/components/favicon';

interface PsbtRequestHeaderProps {
  name?: string;
  origin: string;
}
export function PsbtRequestHeader({ name, origin }: PsbtRequestHeaderProps) {
  const displayName = name ?? origin;
  const caption = displayName ? `Requested by ${displayName}` : null;

  return (
    <Flex flexDirection="column" mb="space.05" width="100%">
      <styled.h1 mb="space.04" textStyle="heading.03">
        Approve
        <br />
        transaction
      </styled.h1>
      <styled.p mb="space.04" textStyle="label.01">
        Please review the recipient address, amount, and associated fees. Authorize only
        transactions you fully understand.
      </styled.p>
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
