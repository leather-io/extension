import { useNavigate } from 'react-router-dom';

import { Box, Flex, Stack, Text } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { CaptionDotSeparator } from '@app/components/caption-dot-separator';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { StatusPending } from '@app/components/status-pending';
import { StatusReady } from '@app/components/status-ready';
import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { useCheckOrderStatuses } from '@app/query/bitcoin/ordinals/brc20/use-check-order-status';
import { fetchInscripionById } from '@app/query/bitcoin/ordinals/inscription-by-id.query';
import { convertInscriptionToSupportedInscriptionType } from '@app/query/bitcoin/ordinals/inscription.hooks';
import { useOrdinalsbotClient } from '@app/query/bitcoin/ordinalsbot-client';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import {
  OrdinalsbotInscriptionStatus,
  PendingBrc20Transfer,
  usePendingBrc20Transfers,
} from '@app/store/ordinals/ordinals.slice';

function StatusIcon({ status }: { status: OrdinalsbotInscriptionStatus }) {
  switch (status) {
    case 'pending':
      return <StatusPending />;
    case 'paid':
      return <StatusPending />;
    case 'waiting-for-indexer':
      return <StatusPending />;
    case 'ready':
      return <StatusReady />;
    default:
      return null;
  }
}
function StatusLabel({ status }: { status: OrdinalsbotInscriptionStatus }) {
  switch (status) {
    case 'pending':
      return <>Paying for transfer inscription…</>;
    case 'paid':
      return (
        <Tooltip label="Your funds have been received. Your inscription will be available shortly.">
          <Text>Creating transfer inscription…</Text>
        </Tooltip>
      );
    case 'waiting-for-indexer':
      return (
        <Tooltip label="Inscription complete, awaiting metadata">
          <Text>Receiving transfer inscription…</Text>
        </Tooltip>
      );
    case 'ready':
      return <Text>Ready to transfer</Text>;
    default:
      return null;
  }
}

export function PendingBrc20TransferList() {
  const transferOrders = usePendingBrc20Transfers();

  useCheckOrderStatuses(
    transferOrders.filter(order => order.status !== 'ready').map(order => order.id)
  );

  if (!transferOrders.length) return null;

  return (
    <Flex flexDirection="column" justifyContent="space-between" flex={1} my="base-loose">
      <Flex columnGap="8px">
        <Caption>Pending BRC-20 transfers</Caption>
      </Flex>
      <Stack mt="tight">
        {transferOrders.map(order => (
          <PendingBrcTransfer key={order.id} order={order} />
        ))}
      </Stack>
    </Flex>
  );
}

interface PendingBrcTransferProps {
  order: PendingBrc20Transfer;
}
function PendingBrcTransfer({ order }: PendingBrcTransferProps) {
  const [component, bind] = usePressable(order.status === 'ready');
  const navigate = useNavigate();
  const ordinalsbotClient = useOrdinalsbotClient();
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const btcCryptoCurrencyAssetBalance = useNativeSegwitBalance(currentAccountBtcAddress);

  const hasPositiveBtcBalanceForFees =
    btcCryptoCurrencyAssetBalance.balance.amount.isGreaterThan(0);

  return (
    <Box
      key={order.id}
      my="base-tight"
      onClick={
        hasPositiveBtcBalanceForFees
          ? order.status === 'ready'
            ? async () => {
                // Really inefficient, find way to not have to refetch data
                const { data: orderInfo } = await ordinalsbotClient.orderStatus(order.id);
                const { data: inscription } = await fetchInscripionById(
                  (orderInfo as any).files[0].tx?.inscription
                );
                navigate(RouteUrls.SendOrdinalInscription, {
                  state: {
                    inscription: convertInscriptionToSupportedInscriptionType({
                      ...inscription,
                      addressIndex: 0,
                    }),
                  },
                });
              }
            : noop
          : noop
      }
      {...(order.status === 'ready' ? bind : {})}
    >
      <Text>
        {order.amount} {order.tick}
      </Text>
      <Stack isInline width="100%" mt="tight">
        <CaptionDotSeparator>
          <Flex as={Caption}>
            <Flag
              ml="tight"
              align="middle"
              spacing="tight"
              img={<StatusIcon status={order.status} />}
            >
              <StatusLabel status={order.status} />
            </Flag>
          </Flex>
        </CaptionDotSeparator>
      </Stack>
      {component}
    </Box>
  );
}
