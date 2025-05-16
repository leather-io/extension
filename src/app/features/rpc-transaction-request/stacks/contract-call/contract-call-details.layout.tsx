import { useMemo } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Stack, styled } from 'leather-styles/jsx';

import { formatContractId } from '@leather.io/stacks';
import { AddressDisplayer, Approver } from '@leather.io/ui';

import { useStacksExplorerLink } from '@app/common/hooks/use-stacks-explorer-link';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { FunctionArgumentList } from '@app/features/rpc-transaction-request/stacks/contract-call/function-arguments/function-argument-list';
import { useGetContractInterface } from '@app/query/stacks/contract-interface.query';

interface ContractCallDetailsLayoutProps {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: string[];
}
export function ContractCallDetailsLayout({
  contractAddress,
  contractName,
  functionName,
  functionArgs,
}: ContractCallDetailsLayoutProps) {
  const { handleOpenStacksTxLink } = useStacksExplorerLink();

  const { data: contractAbi, isLoading } = useGetContractInterface(contractAddress, contractName);
  const contractFunction = useMemo(
    () => contractAbi?.functions.find(fn => fn.name === functionName),
    [contractAbi?.functions, functionName]
  );

  function onClickContractAddress() {
    return handleOpenStacksTxLink({
      txid: formatContractId(contractAddress, contractName),
    });
  }

  if (isLoading)
    return (
      <Approver.Section>
        <LoadingSpinner />
      </Approver.Section>
    );

  if (!contractAbi) {
    return (
      <Approver.Section>
        <Approver.Subheader>
          <styled.span textStyle="label.01">Contract</styled.span>
        </Approver.Subheader>
        <styled.span textStyle="caption.01" color="red.action-primary-default">
          Not a valid contract
        </styled.span>
      </Approver.Section>
    );
  }

  if (!contractFunction) {
    return (
      <Approver.Section>
        <Approver.Subheader>
          <styled.span textStyle="label.01">Contract</styled.span>
        </Approver.Subheader>
        <styled.span textStyle="caption.01" color="red.action-primary-default">
          Function not found
        </styled.span>
      </Approver.Section>
    );
  }

  return (
    <>
      <Approver.Section>
        <Approver.Subheader>
          <styled.span textStyle="label.01">Contract</styled.span>
        </Approver.Subheader>
        <Stack gap="space.04">
          <Stack _hover={{ cursor: 'pointer' }} gap="space.02" onClick={onClickContractAddress}>
            <styled.span color="ink.text-subdued" textStyle="caption.01">
              Address
            </styled.span>
            <AddressDisplayer
              data-testid={SharedComponentsSelectors.AddressDisplayer}
              address={contractAddress}
            />
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
        <FunctionArgumentList fn={contractFunction} fnArgs={functionArgs} />
      </Approver.Section>
    </>
  );
}
