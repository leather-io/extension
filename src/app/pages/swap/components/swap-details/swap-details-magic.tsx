import { SpaceBetween } from "@app/components/layout/space-between";
import { SwapDetailLayout } from "./swap-detail.layout";
import { SwapDetailsLayout } from "./swap-details.layout";
import { Box, Stack, Text, Tooltip, color } from '@stacks/ui';
import { useAverageBitcoinFeeRates } from "@app/query/bitcoin/fees/fee-estimates.hooks";
import { useMagicSwapper } from "@app/common/magic/hooks";

export function SwapDetailsMagicInbound() {
  const { data: bitcoinFees } = useAverageBitcoinFeeRates();

  const bitcoinFee = bitcoinFees?.halfHourFee;

  const stacksFeesTooltipText =
    `A Magic swap involves multiple transactions on the Stacks network (listed below). ` +
      `This is the fee rate used per transaction, not the total fees for all transactions.`

  const bitcoinFeeText = bitcoinFee ? `Low (${bitcoinFee} sats/vB)` : '-';

  const bitcoinFeeTooltipText =
    `A Magic swap involves sending the specified amount of Bitcoin to an escrow address.` +
      `This is the fee used for sending the Bitcoin.`

  return (
    <SwapDetailsLayout>
      <SwapDetailLayout title="Protocol" value="Magic" />
      <SwapDetailLayout
        tooltipLabel={stacksFeesTooltipText}
        title="Stacks fee (per-transaction)"
        value="Low" />
      <SwapDetailLayout
        title="Bitcoin fee"
        value={bitcoinFeeText}
        tooltipLabel={bitcoinFeeTooltipText}
      />
      <SwapTransactions />
    </SwapDetailsLayout>
  )
}

function SwapTransactions() {
  const {magicSwapper} = useMagicSwapper();

  return (
    <>
      <SpaceBetween ml="base" width="100%">
        <Stack alignItems="center" isInline spacing="extra-tight">
          <Text color={color('text-caption')}>Transactions</Text>
        </Stack>
      </SpaceBetween>
      <SpaceBetween ml="loose" width="100%">
        <Stack>
          {!magicSwapper?.isAuthorized && (
            <SwapDetailLayout
              title="Authorize"
              tooltipLabel={
                `Your address have not been authorized to swap using Magic. ` +
                  `This will require an additional, one-time transaction.`
              }
            />
          )}
          <SwapDetailLayout title="Send Bitcoin" />
          <SwapDetailLayout title="Escrow funds" />
          <SwapDetailLayout title="Finalize swap" />
        </Stack>
      </SpaceBetween>
    </>
  );
}
