import { useState } from 'react';

// #4164 FIXME migrate CodeBlock
import { CodeBlock } from '@stacks/ui';
import { BoxProps, HStack, Stack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Prism } from '@app/common/clarity-prism';
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
      borderColor={token('colors.accent.background-primary')}
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
      px="space.04"
      py="space.04"
      bg={isActive ? token('colors.accent.background-secondary') : 'transparent'}
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
    <Stack mb="space.05" gap="space.05">
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
          borderColor={token('colors.accent.background-primary')}
          borderRadius="12px"
          py="space.06"
          px="base-loose"
        >
          <Title as="h2" fontWeight="500">
            Contract deploy details
          </Title>
          <ContractPreviewLayout
            contractAddress={currentAccountStxAddress}
            contractName={transactionRequest.contractName}
          />
          {/* // #4164 FIXME migrate <Divider */}
          <Stack gap="base-loose" /* divider={<Divider />} */>
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
