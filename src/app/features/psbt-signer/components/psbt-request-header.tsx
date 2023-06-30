import { Flex, Text } from '@stacks/ui';

import { addPortSuffix, getUrlHostname } from '@app/common/utils';
import { Favicon } from '@app/components/favicon';
import { Flag } from '@app/components/layout/flag';
import { Caption, Title } from '@app/components/typography';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

interface PsbtRequestHeaderProps {
  name?: string;
  origin: string;
}
export function PsbtRequestHeader({ name, origin }: PsbtRequestHeaderProps) {
  const { chain, isTestnet } = useCurrentNetworkState();

  const originAddition = origin ? ` (${getUrlHostname(origin)})` : '';
  const testnetAddition = isTestnet
    ? ` using ${getUrlHostname(chain.stacks.url)}${addPortSuffix(chain.stacks.url)}`
    : '';

  const displayName = name ?? origin;

  const caption = displayName
    ? `Requested by ${displayName}${originAddition}${testnetAddition}`
    : null;

  return (
    <Flex flexDirection="column" my="loose" width="100%">
      <Title fontSize={4} fontWeight={500} mb="base">
        Approve transaction
      </Title>
      <Text lineHeight="24px" mb="base">
        Please review the recipient address, amount, and associated fees. Authorize only
        transactions you fully understand.
      </Text>
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
