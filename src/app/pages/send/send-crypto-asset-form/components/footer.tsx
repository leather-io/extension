import { Outlet } from 'react-router-dom';

import { Box, color } from '@stacks/ui';

import { Money } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { whenPageMode } from '@app/common/utils';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Caption } from '@app/components/typography';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';

import { PreviewButton } from './preview-button';

export function Footer(props: { balance: Money; url: string }) {
  const { balance, url } = props;

  return (
    <Box
      bg={color('bg')}
      borderTop="1px solid #DCDDE2"
      bottom="0px"
      height={['128px', '116px']}
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
      <HighFeeDrawer learnMoreUrl={url} />
      <Outlet />
    </Box>
  );
}
