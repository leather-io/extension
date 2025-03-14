import { PayloadType, addressToString } from '@stacks/transactions';
import { Flex, HStack, Stack, VStack, styled } from 'leather-styles/jsx';

import { formatContractId } from '@leather.io/stacks';
import { AddressDisplayer, Approver } from '@leather.io/ui';

import { useStacksExplorerLink } from '@app/common/hooks/use-stacks-explorer-link';
import { useRpcRequestContext } from '@app/features/rpc-request/rpc-request.context';

import { ContractCallDetails } from './contract-call-details/contract-call-details';
import type { RpcCallContractRequest } from './rpc-stx-call-contract-container';

export function ApproveContractCallDetails() {
  const {
    rpcRequest: { unsignedTx },
  } = useRpcRequestContext<RpcCallContractRequest>();
  const { handleOpenStacksTxLink } = useStacksExplorerLink();

  if (unsignedTx.payload.payloadType !== PayloadType.ContractCall) return null;

  const contractAddress = addressToString(unsignedTx.payload.contractAddress);
  const contractName = unsignedTx.payload.contractName.content;
  const functionName = unsignedTx.payload.functionName.content;

  function onClickContract() {
    return handleOpenStacksTxLink({
      txid: formatContractId(contractAddress, contractName),
    });
  }

  return (
    <>
      <Approver.Section>
        <Approver.Subheader>
          <styled.span textStyle="label.01">Contract</styled.span>
        </Approver.Subheader>
        <Stack _hover={{ cursor: 'pointer' }} gap="space.04" onClick={onClickContract}>
          <Stack gap="space.02">
            <styled.span color="ink.text-subdued" textStyle="caption.01">
              Address
            </styled.span>
            <AddressDisplayer address={contractAddress} />
          </Stack>
          <Stack gap="space.02">
            <styled.span color="ink.text-subdued" textStyle="caption.01">
              Contract name
            </styled.span>
            <styled.span textStyle="label.01">{contractName}</styled.span>
          </Stack>
          <Stack gap="space.02">
            <styled.span color="ink.text-subdued" textStyle="caption.01">
              Function name
            </styled.span>
            <styled.span textStyle="label.01">{functionName}</styled.span>
          </Stack>
        </Stack>
      </Approver.Section>
      <Approver.Section>
        <Approver.Subheader>
          <styled.span textStyle="label.01">Contract arguments</styled.span>
        </Approver.Subheader>
        <ContractCallDetails payload={unsignedTx.payload} />
      </Approver.Section>
    </>
  );
}
