import { FiInfo } from 'react-icons/fi';

import { Box, Flex, Stack, Tooltip, color } from '@stacks/ui';

import { Money } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { whenPageMode } from '@app/common/utils';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Caption } from '@app/components/typography';

import { PreviewButton } from './preview-button';

export function FormFooter(props: { balance: Money }) {
  const { balance } = props;
  const balanceTooltipLabel =
    'Amount that is immediately available for use after taking into account any pending transactions or holds placed on your account by the protocol.';
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
        <SpaceBetween>
          <Flex alignItems="center">
            <Caption mr="tight">Available balance</Caption>
            <Tooltip placement="top" label={balanceTooltipLabel}>
              <Stack>
                <Box
                  _hover={{ cursor: 'pointer' }}
                  as={FiInfo}
                  color={color('text-caption')}
                  size="14px"
                />
              </Stack>
            </Tooltip>
          </Flex>

          <Caption>{formatMoney(balance)}</Caption>
        </SpaceBetween>
      </Box>
    </Box>
  );
}
