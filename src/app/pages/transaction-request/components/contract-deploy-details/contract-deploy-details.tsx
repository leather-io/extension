import { useState } from 'react';

import { BoxProps, CodeBlock, Stack, color } from '@stacks/ui';

import { Prism } from '@app/common/clarity-prism';
import { Divider } from '@app/components/layout/divider';
import { Caption, Title } from '@app/components/typography';
import { AttachmentRow } from '@app/pages/transaction-request/components/attachment-row';
import { ContractPreviewLayout } from '@app/pages/transaction-request/components/contract-preview';
import { Row } from '@app/pages/transaction-request/components/row';
import {
  useCurrentAccountStxAddressState,
  useCurrentStacksAccount,
} from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

function ContractCodeSection(): React.JSX.Element | null {
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

  return (
    <CodeBlock
      overflow="auto"
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      backgroundColor="ink.1000"
      width="100%"
      code={transactionRequest.codeBody}
      Prism={Prism as any}
    />
  );
}

interface TabButtonProps extends BoxProps {
  isActive: boolean;
}

function TabButton(props: TabButtonProps): React.JSX.Element {
  const { isActive, ...rest } = props;

  return (
    <Caption
      as="button"
      border={0}
      borderRadius="8px"
      px="base"
      py="base"
      bg={isActive ? color('bg-4') : 'transparent'}
      fontWeight={isActive ? 600 : 500}
      {...rest}
    />
  );
}

export function ContractDeployDetails(): React.JSX.Element | null {
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
    <Stack mb="loose" spacing="loose">
      <Stack spacing="0" isInline>
        <TabButton onClick={() => setTab('details')} isActive={tab === 'details'}>
          Details
        </TabButton>
        <TabButton onClick={() => setTab('code')} isActive={tab === 'code'}>
          Code
        </TabButton>
      </Stack>
      {tab === 'details' ? (
        <Stack
          spacing="loose"
          border="4px solid"
          borderColor={color('border')}
          borderRadius="12px"
          py="extra-loose"
          px="base-loose"
        >
          <Title as="h2" fontWeight="500">
            Contract deploy details
          </Title>
          <ContractPreviewLayout
            contractAddress={currentAccountStxAddress}
            contractName={transactionRequest.contractName}
          />
          <Stack spacing="base-loose" divider={<Divider />}>
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
