import { Box, color } from '@stacks/ui';

import { Money } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { whenPageMode } from '@app/common/utils';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Caption } from '@app/components/typography';

import { PreviewButton } from './preview-button';

export function FormFooter(props: { balance: Money }) {
  const { balance } = props;

  return (
    <Box
      bg={color('bg')}
      borderTop="1px solid #DCDDE2"
      bottom="0px"
      height={['106px', '116px']}
      position={whenPageMode({
        full: 'unset',
        popup: 'absolute',
      })}
      width="100%"
      zIndex={999}
    >
      <Box mt="loose" px="loose">
        <PreviewButton />
        <SpaceBetween>
          <Caption>Balance</Caption>
          <Caption>{formatMoney(balance)}</Caption>
        </SpaceBetween>
      </Box>
    </Box>
  );
}
