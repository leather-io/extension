import { PayloadType, StacksTransaction } from '@stacks/transactions';
import { Box, BoxProps, color, Stack } from '@stacks/ui';

import { Tx } from '@app/common/api/transactions';
import { usePressable } from '@app/components/item-hover';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { stacksValue } from '@app/common/stacks-utils';
import { getTxSenderAddress } from '@app/store/accounts/account-activity.utils';
import { SpaceBetween } from '@app/components/space-between';
import { Caption, Title } from '@app/components/typography';
import { Tooltip } from '@app/components/tooltip';
import { getTxCaption } from '@app/common/transactions/transaction-utils';
import { TransactionTitle } from '@app/components/transaction/components/transaction-title';
import { StacksTransactionIcon } from '@app/components/transaction/components/stacks-transaction-icon';

interface LocalTxItemProps extends BoxProps {
  transaction: StacksTransaction;
  txid: string;
}
export const LocalTxItem = ({ transaction, txid, ...rest }: LocalTxItemProps) => {
  const [component, bind] = usePressable(true);
  const { handleOpenTxLink } = useExplorerLink();

  if (!transaction) {
    return null;
  }

  const getTxTitle = () => {
    switch (transaction.payload.payloadType) {
      case PayloadType.TokenTransfer:
        return 'Stacks Token';
      case PayloadType.ContractCall:
        return transaction.payload.functionName.content;
      case PayloadType.SmartContract:
        return transaction.payload.contractName.content;
      // this should never be reached
      default:
        return '';
    }
  };

  const value = () => {
    switch (transaction.payload.payloadType) {
      case PayloadType.TokenTransfer:
        return `-${stacksValue({
          value: Number(transaction.payload.amount),
          withTicker: false,
        })}`;

      case PayloadType.ContractCall:
      // TODO: this is a good improvement to have, currently we do not show the asset amount transfered, but we can!
      // return transaction.payload.functionName.content === 'transfer'
      //   ? cvToValue(transaction.payload.functionArgs[0])
      //   : null;
      case PayloadType.SmartContract:
      default:
        return null;
    }
  };

  const txCaption = () => {
    switch (transaction.payload.payloadType) {
      case PayloadType.TokenTransfer:
        return getTxCaption({
          tx_type: 'token_transfer',
          tx_id: txid,
        } as Tx);
      case PayloadType.ContractCall:
        return getTxCaption({
          tx_type: 'contract_call',
          contract_call: {
            contract_id: `.${transaction.payload.contractName.content}`,
          },
        } as unknown as Tx);
      case PayloadType.SmartContract:
        return getTxCaption({
          tx_type: 'smart_contract',
          smart_contract: {
            contract_id: `${getTxSenderAddress(transaction)}.${
              transaction.payload.contractName.content
            }`,
          },
        } as unknown as Tx);
      // this should never be reached
      default:
        return null;
    }
  };

  return (
    <Box position="relative" cursor="pointer" {...bind} {...rest}>
      <Stack
        alignItems="center"
        spacing="base-loose"
        isInline
        position="relative"
        zIndex={2}
        onClick={() => handleOpenTxLink(txid, `&submitted=true`)}
      >
        <StacksTransactionIcon transaction={transaction} />
        <SpaceBetween flexGrow={1}>
          <Stack spacing="base-tight" minWidth="0px">
            <TransactionTitle title={getTxTitle()} />
            <Stack isInline flexWrap="wrap">
              <Caption variant="c2">{txCaption()}</Caption>
              <Tooltip
                placement="bottom"
                label={
                  'This transaction has been broadcast, but is not yet visible in the mempool.'
                }
              >
                <Caption variant="c2" color={color('text-caption')}>
                  Submitted
                </Caption>
              </Tooltip>
            </Stack>
          </Stack>
          <Stack alignItems="flex-end" spacing="base-tight">
            {value() && (
              <Title as="h3" fontWeight="normal">
                {value()}
              </Title>
            )}
          </Stack>
        </SpaceBetween>
      </Stack>
      {component}
    </Box>
  );
};
