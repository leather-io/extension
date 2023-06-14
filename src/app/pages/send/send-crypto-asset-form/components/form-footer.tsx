import { Box, color } from '@stacks/ui';

import { Money } from '@shared/models/money.model';

import { whenPageMode } from '@app/common/utils';

import { AvailableBalance } from '../../../../components/available-balance';
import { PreviewButton } from '../../../../components/preview-button';

export function FormFooter(props: { balance: Money; balanceTooltipLabel?: string }) {
  const { balance, balanceTooltipLabel } = props;

  return (
    <Box
      bg={color('bg')}
      borderTop="1px solid #DCDDE2"
      bottom="0px"
      height={['96px', '116px']}
      position={whenPageMode({
        full: 'unset',
        popup: 'absolute',
      })}
      width="100%"
      zIndex={999}
    >
      <Box mt="loose" px="loose">
        <PreviewButton />
        <AvailableBalance balance={balance} balanceTooltipLabel={balanceTooltipLabel} />
      </Box>
    </Box>
  );
}
