import { useState } from 'react';

import { HStack, HTMLStyledProps, Stack, styled } from 'leather-styles/jsx';

//  #4476 TODO - test and see if we need this
// import { Prism } from '@app/common/clarity-prism';
import { AttachmentRow } from '@app/features/stacks-transaction-request/attachment-row';
import { ContractPreviewLayout } from '@app/features/stacks-transaction-request/contract-preview';
import { Row } from '@app/features/stacks-transaction-request/row';
import {
  useCurrentAccountStxAddressState,
  useCurrentStacksAccount,
} from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import { Title } from '@app/ui/components/typography/title';

function ContractCodeSection() {
  const transactionRequest = useTransactionRequestState();

  const currentAccount = useCurrentStacksAccount();
  const currentAccountStxAddress = useCurrentAccountStxAddressState();

  if (
    !transactionRequest ||
    transactionRequest.txType !== 'smart_contract' ||
    !currentAccount ||
    !currentAccountStxAddress
  ) {
    return null;
  }

  //#4476 TODO - test and style this CodeBlock
  return (
    <styled.pre
      overflowX="scroll"
      border="borders.default"
      borderRadius="12px"
      // backgroundColor="ink.1000"
      maxWidth="100vw"

      // Prism={Prism as any}
    >
      {transactionRequest.codeBody}
    </styled.pre>
  );
}

interface TabButtonProps extends HTMLStyledProps<'button'> {
  isActive: boolean;
}

function TabButton(props: TabButtonProps) {
  const { isActive, ...rest } = props;

  return (
    <styled.button
      bg={isActive ? 'accent.component-background-hover' : 'transparent'}
      border={0}
      borderRadius="xs"
      fontWeight={isActive ? 600 : 500}
      px="space.04"
      py="space.04"
      {...rest}
    />
  );
}

export function ContractDeployDetails() {
  const transactionRequest = useTransactionRequestState();
  const currentAccount = useCurrentStacksAccount();
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const [tab, setTab] = useState<'details' | 'code'>('details');

  if (
    !transactionRequest ||
    transactionRequest.txType !== 'smart_contract' ||
    !currentAccount ||
    !currentAccountStxAddress
  ) {
    return null;
  }

  return (
    <Stack mb="space.05" gap="space.05" width="100%">
      <HStack gap="0">
        <TabButton onClick={() => setTab('details')} isActive={tab === 'details'}>
          Details
        </TabButton>
        <TabButton onClick={() => setTab('code')} isActive={tab === 'code'}>
          Code
        </TabButton>
      </HStack>
      {tab === 'details' ? (
        <Stack
          gap="space.05"
          border="4px solid"
          borderColor="accent.border-default"
          borderRadius="12px"
          py="space.06"
          px="space.04"
        >
          <Title>Contract deploy details</Title>
          <ContractPreviewLayout
            contractAddress={currentAccountStxAddress}
            contractName={transactionRequest.contractName}
          />
          <Stack gap="space.04">
            {currentAccountStxAddress && (
              <Row name="Contract address" value={currentAccountStxAddress} type="Principal" />
            )}
            <Row name="Contract name" value={transactionRequest.contractName} type="String" />
            {transactionRequest.attachment && <AttachmentRow />}
          </Stack>
        </Stack>
      ) : (
        <ContractCodeSection />
      )}
    </Stack>
  );
}
