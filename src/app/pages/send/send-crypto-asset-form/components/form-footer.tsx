import { Box, Flex } from 'leather-styles/jsx';

import { Money } from '@shared/models/money.model';

import { whenPageMode } from '@app/common/utils';
import { AvailableBalance } from '@app/components/available-balance';
import { PreviewButton } from '@app/components/preview-button';

export function FormFooter(props: { balance: Money; balanceTooltipLabel?: string }) {
  const { balance, balanceTooltipLabel } = props;

  return (
    <Box
      bg="accent.background-primary"
      bottom="0px"
      height={['96px', '116px']}
      position={whenPageMode({
        full: 'unset',
        popup: 'absolute',
      })}
      width="100%"
      zIndex={999}
    >
      <Flex gap="space.04" mt="space.03" px="space.05" direction="column">
        <PreviewButton />
        <AvailableBalance balance={balance} balanceTooltipLabel={balanceTooltipLabel} />
      </Flex>
    </Box>
  );
}
