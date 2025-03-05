import type { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { type PostConditionWire, addressToString } from '@stacks/transactions';

import {
  type StacksUnsignedTransactionOptions,
  TransactionTypes,
  formatContractId,
} from '@leather.io/stacks';
import { truncateMiddle } from '@leather.io/utils';

import { ftDecimals } from '@app/common/stacks-utils';
import {
  getAmountFromPostCondition,
  getIconStringFromPostCondition,
  getNameFromPostCondition,
  getPostConditionCodeMessage,
  getPostConditionTitle,
  getSymbolFromPostCondition,
} from '@app/common/transactions/stacks/post-condition.utils';
import type { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

export function checkIsContractPrincipal(
  pc: PostConditionWire,
  txOptions: StacksUnsignedTransactionOptions
) {
  const contractName = 'contractName' in pc.principal && pc.principal.contractName.content;
  const address = 'address' in pc.principal ? addressToString(pc.principal.address) : '';

  const isContractPrincipal =
    !!contractName ||
    (txOptions.txType === TransactionTypes.ContractCall && txOptions.contractAddress === address) ||
    address.includes('.');

  return isContractPrincipal;
}

interface FormatPostConditionMessageArgs {
  account?: StacksAccount;
  asset?: FtMetadataResponse;
  isContractPrincipal: boolean;
  postCondition: PostConditionWire;
}
export function formatPostConditionMessage({
  account,
  asset,
  isContractPrincipal,
  postCondition: pc,
}: FormatPostConditionMessageArgs) {
  const pcTitle = getPostConditionTitle(pc);
  const pcIconString = getIconStringFromPostCondition(pc);
  const pcTicker = getSymbolFromPostCondition(pc);
  const pcAmount = getAmountFromPostCondition(pc);
  const pcName = getNameFromPostCondition(pc);

  const contractName = 'contractName' in pc.principal && pc.principal.contractName.content;
  const address = 'address' in pc.principal ? addressToString(pc.principal.address) : '';
  const isSending = address === account?.address;

  const contractId = 'asset' in pc ? formatContractId(address, pc.asset.contractName.content) : '';
  const amount = asset?.decimals ? ftDecimals(pcAmount, asset.decimals) : pcAmount;
  const ticker = asset?.symbol || pcTicker;

  const message = pc.conditionCode
    ? `${getPostConditionCodeMessage(
        pc.conditionCode,
        isSending
      )} ${amount} ${ticker} or the transaction will abort.`
    : undefined;

  return {
    amount,
    contract: `${truncateMiddle(address, 4)}${contractName ? `.${contractName}` : ''}`,
    contractId,
    iconString: pcIconString,
    message,
    name: asset?.name || pcName,
    ticker,
    title: `${
      isContractPrincipal ? 'The contract ' : isSending ? 'You ' : 'Another address '
    } ${pcTitle}`,
  };
}
